import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { PropTypes as T } from 'prop-types';

import { mapboxAccessToken, environment, basemapStyleLink } from '../../config';

import ReactMapGL, {NavigationControl, Source,
                    Layer, WebMercatorViewport,
                    HTMLOverlay, Popup, Marker} from 'react-map-gl';

import LayerControlDropdown from './MapLayerControl';
import LayerControl from './LayerControl';
import MapboxControl from './MapboxReactControl';
import './map.scss'


/**
 * Id of the last "topmost" layer, before which all GEP layers
 * should be added. This is needed to show place names and borders above
 * all other layers.
 **/
const labelsAndBordersLayer = 'wb-boundaries';

// Adds layers for points
const buildLayersForSource = (selectedId, sourceId, sourceLayer) => [
  {
    id: `${sourceId}-line`,
    key: `${sourceId}-line`,
    type: 'line',
    source: sourceId,
    filter: ['==', '$type', 'LineString'],
    paint: {
      'line-color':  ['case', ['==', ['get', 'id'], selectedId ?? null], 'green', 'red']
    }
  },
  {
    id: `${sourceId}-polygon`,
    key: `${sourceId}-polygon`,
    type: 'fill',
    source: sourceId,
    filter: [
      'all',
      ['==', ['geometry-type'], 'Polygon'],
      ['has', 'geom_length'],
      ['<', ['number',['get', 'geom_length']], ['/', 350, ['^', 2, ['zoom']]]],
      ['>', ['number',['get', 'geom_length']], ['/', 15, ['^', 2, ['zoom']]]],  // ~.7 px/deg @zoom=0
    ],
    paint: {
      'fill-outline-color': [
        'step',
        ['zoom'],
        'rgba(0,0,0,0)',
        2.5, ['case', ['==', ['get', 'id'], selectedId ?? null], 'green', 'rgba(0,0,225,.5)'],
      ],
      'fill-opacity': ['interpolate', ['linear'], ['get', 'geom_length'],
                       0, 1,
                       10, .2,
                       100, 0.1
                      ],
      'fill-color': ['case', ['==', ['get', 'id'], selectedId ?? null], 'rgba(0,225,0,.5)',
                     'rgba(0,0,225,.1)'],

    }
  },
  {
    id: `${sourceId}-point`,
    key: `${sourceId}-point`,
    type: 'circle',
    source: sourceId,
    filter: [
      'all',
      ['==', ['geometry-type'], 'Point'],
      ['any',
       ['!', ['has', 'geom_length']],
       // This is the bit that adds the extra points for small polygons that have been hidden from the poly layer.
        ['<', ['number',['get', 'geom_length']], ['/', 15, ['^', 2, ['zoom']]]],   // opposite of the polygon layer
      ]
    ],
    paint: {
      'circle-color': ['case', ['==', ['get', 'id'], selectedId ?? null], 'green', 'purple']
    }
  }
];

class ReMap extends React.Component {
  constructor (props) {
    super(props);

    const { layersState, bounds } = props;

    const base = new WebMercatorViewport({width:window.innerWidth,
                                          height:window.innerHeight});
    const vp = base.fitBounds(bounds.map(e=> [e.lon, e.lat]));
    const { latitude, longitude, zoom } = vp;
    const smallScreen = window.innerWidth <= 600;

    this.state = {
      layersState: layersState,
      viewport: {latitude: latitude,
                 longitude: longitude,
                 zoom: zoom,
                },
      lngLat: undefined,
      showDetail: false,
      smallScreen: smallScreen,
    };

    this.renderLayer = this.renderLayer.bind(this);
    this.renderExistingLayer = this.renderExistingLayer.bind(this);
    this.maybeRenderLayer = this.maybeRenderLayer.bind(this);
    this.onViewportChange = this.onViewportChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.hide = this.hide.bind(this);
  }


  onClick(e) {
    if (e.target.className === 'mapboxgl-popup-close-button' ||
        Object.keys(e.target.dataset).length) {
      return;
    }

    const {lngLat, showDetail} = this.state;
    const {handleSelectedLocation, selectedLayer } = this.props;
    const selectedLayerId = selectedLayer && `ext-${selectedLayer.id}`;
    const features = selectedLayer ? e.features.filter((f) => f.source == selectedLayerId ): e.features;

    this.setState({
      showDetail: true,
      lngLat: e.lngLat,
      point: e.point,
      selectedFeatures: features,
    });

    handleSelectedLocation && handleSelectedLocation(e.lngLat, features);
  }

  maybeRenderLayer(layer, idx) {

    const { layersState } = this.props;
    if (!layersState[idx]){
      return '';
    }
    return this.renderLayer(layer);
  }


  renderGeoJsonLayer(layer) {
    // Add layers.
    // Layers come from the model. Each layer object must have:
    // id:            Id of the layer
    // label:         Label for display
    // type:          (geojson)
    // url:           Url to a tilejson or mapbox://. Use interchangeably with tiles

    if (!(layer.url || layer.data)) {
      // eslint-disable-next-line no-console
      console.warn(
        `Layer [${layer.label}] must have (url) property.`
      );
      return '';
    }

    const sourceId = `ext-${layer.id}`;
    let options = { type: 'geojson',
                    id: sourceId,
                    key: sourceId,
                    data: layer.url || layer.data
                  };

    let layers;

    if (layer.style) {
      layers = (<Layer
                  id={layer.id}
                  key={`${sourceId}-point`}
                  source={sourceId}
                  {...layer.style}
                />);
    } else {
      layers = buildLayersForSource(this.props.selectedId, sourceId, '').map(l =>
        (<Layer
           {...l}
           visible={true}
           beforeId={labelsAndBordersLayer}
         >
         </Layer>
        ));
    }

    return (
      <Source
        {...options}
      >
        { layers }
      </Source>
    );
  }

  renderVectorLayer(layer) {
    // Add layers.
    // Layers come from the model. Each layer object must have:
    // id:            Id of the layer
    // label:         Label for display
    // type:          (vector|raster)
    // url:           Url to a tilejson or mapbox://. Use interchangeably with tiles
    // tiles:         Array of tile url. Use interchangeably with url
    // vectorLayers:  Array of source layers to show. Only in case of type vector
    if (!layer.vectorLayers || !layer.vectorLayers.length) {
      // eslint-disable-next-line no-console
      console.warn(
        `Layer [${layer.label}] has missing (vectorLayers) property.`
      );
      return '';
    }
    if ((!layer.tiles || !layer.tiles.length) && !layer.url) {
      // eslint-disable-next-line no-console
      console.warn(
        `Layer [${layer.label}] must have (url) or (tiles) property.`
      );
      return '';
    }

    const sourceId = `ext-${layer.id}`;
    let options = { type: 'vector',
                    id: sourceId,
                    key: sourceId,
                  };

    if (layer.tiles) {
      options.tiles = layer.tiles;
    } else if (layer.url) {
      options.url = layer.url;
    }

    //const vectorLayers = layer.vectorLayers || [ undefined ];

    return (
      <Source
        {...options}
      >
        { layer.vectorLayers.map(vt =>
          buildLayersForSource(this.props.selectedId, sourceId, vt).map(l => (
            <Layer
              {...l}
              sourceLayer={vt}
              visible={true}
              beforeId={labelsAndBordersLayer}
            >
            </Layer> )
                                                )
        )
        }
      </Source>
    );
  }

  // Raster layer type.
  renderRasterLayer(layer) {
    // Add layers.
    // Layers come from the model. Each layer object must have:
    // id:            Id of the layer
    // label:         Label for display
    // type:          (vector|raster)
    // url:           Url to a tilejson or mapbox://. Use interchangeably with tiles
    // tiles:         Array of tile url. Use interchangeably with url
    // vectorLayers:  Array of source layers to show. Only in case of type vector
    if (!layer.tiles || !layer.tiles.length) {
      // eslint-disable-next-line no-console
      console.warn(
        `Layer [${layer.label}] must have (tiles) property.`
      );
      return '';
    }

    const sourceId = `ext-${layer.id}`;
    const layerId = sourceId + '-tiles';
    return (
      <Source
        id={sourceId}
        key={sourceId}
        type='raster'
        tiles={layer.tiles}
        tileSize={512}
      >
        <Layer
          id={layerId}
          key={layerId}
          type='raster'
          visible={true}
          beforeId={labelsAndBordersLayer}
        >
        </Layer>
      </Source>
    );
  }

  renderExistingLayer(layer) {
    return (
      <Layer
        {...layer}
        type={layer.sourceType}
 /* {... {'source-layer': sourceLayer.sourceLayer}} */
 /*        source={sourceLayer.source} */
 /*        type={sourceLayer.type} */
      >
      </Layer>
    );
  }

  renderLayer(layer) {
    // Add layers.
    // Layers come from the model. Each layer object must have:
    // id:            Id of the layer
    // label:         Label for display
    // type:          (vector|raster|geojson)
    // url:           Url to a geojson, tilejson or mapbox://. Use interchangeably with tiles
    // tiles:         Array of tile url. Use interchangeably with url for vector type
    // vectorLayers:  Array of source layers to show. Only in case of type vector

    if (layer.type === 'vector') {
      return this.renderVectorLayer(layer);
    } else if (layer.type === 'geojson') {
      return this.renderGeoJsonLayer(layer);
    } else if (layer.type === 'raster') {
      return this.renderRasterLayer(layer);
    } else if (layer.type === 'existing') {
      return this.renderExistingLayer(layer);
    } else {
      // eslint-disable-next-line no-console
      console.warn(
        `Layer [${
              layer.label
            }] has unsupported type [layer.type] and won't be added.`
      );
      return '';
    }
  }

  onViewportChange(viewport) {
    const { handleBoundsChange } = this.props;
    this.setState({viewport});

    if (handleBoundsChange) {
      const mapGL = this.mapRef && this.mapRef.getMap();
      if (!mapGL) {return;}
      const bounds = mapGL.getBounds();
        handleBoundsChange(bounds, viewport);
    }
  }

  hide(e) {
    this.setState({showDetail: false});
    e.stopPropagation();
    e.preventDefault();
    return true;
  }


  render () {
    const { viewport, lngLat, showDetail, smallScreen } = this.state;
    const { layersState, externalLayers, handleLayerChange,
            details, title, layersSelector,
            titleComponent, selectedLayer,
            onMouseEnter, onMouseLeave, onHover,
            marker, popup, onClick
          } = this.props;

    const getCursor = ({isDragging, isHovering}) => {
      return isDragging ? 'grabbing' : isHovering ? 'pointer' : 'default';
    };

    return (
      <section className='exp-map'>
        <h1 className='exp-map__title'>Map</h1>
        <ReactMapGL
          {...viewport}
          ref={ map => this.mapRef = map }
          width="100%"
          height="100%"

          dragRotate={false}
          mapStyle={ basemapStyleLink }
          mapboxApiAccessToken={ mapboxAccessToken }
          onViewportChange={ this.onViewportChange }
          onClick={onClick}
          onContextMenu={ e=> true }
          onKeyup={ e=> true }
          getCursor={getCursor}
          interactiveLayerIds={ [selectedLayer, ...externalLayers].filter(l=>l).map(l=>`ext-${l.id}`).flatMap(l => ['point', 'line', 'polygon'].map(t => `${l}-${t}`) ).filter(l=>l) }
          clickRadius={2}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onHover={onHover}
          // mapOptions={{projection:'naturalEarth'}} doesn't appear to be working
        >
          {popup}
          { title && (<HTMLOverlay
                        captureClick={false}
                        captureScroll={false}
                        captureDoubleClick={false}
                        captureDrag={false}
                        redraw={() => (<div className='exp-map__title'>
                                         <h2>{title}</h2>
                                       </div>)}
                      />) || '' }
          { titleComponent && titleComponent || '' }
          <div className='map-controls__position'>
            <div>
              { false && externalLayers && <LayerControl
                                    captureClick={true}
                                    captureDoubleClick={false}
                                    captureDrag={true}
                                    captureScroll={true}
                                    externalLayers={externalLayers}
                                    layersState={layersState}
                                    handleLayerChange={handleLayerChange}
                                    initiallyVisible={false}
                                  /> || '' }
            </div>
            <NavigationControl
              style={{position:'relative'}}
              showCompass={false}
            />
          </div>
          { layersSelector && ( <div className='layer_selector__position'>
                              <div>
                                { layersSelector }
                                  </div>
                                </div>
                              )}
          { externalLayers && externalLayers.map(this.maybeRenderLayer) || '' }
          { selectedLayer && this.renderLayer(selectedLayer) || '' }
          { !smallScreen && showDetail && details && (
            <Fragment>
              <Popup
                dynamicPosition={true}
                latitude={lngLat[1]}
                longitude={lngLat[0]}
                closeButton={true}
                closeOnClick={false}
                onClose={() => this.setState({showDetail: false})}
              >
                {details}
              </Popup>
              { marker && (<Marker
                latitude={lngLat[1]}
                longitude={lngLat[0]}
                offsetLeft={-10}
                offsetTop={-12}
                className='popup__marker'
                captureClick={false}
                captureDoubleClick={false}
                captureDrag={false}
                captureScroll={false}
              >
                <img height={20} width={20} src='/static/graphics/marker.png' />
                         </Marker>) ||'' }
            </Fragment>
          ) || ''}
          { smallScreen && showDetail && details && (
            <HTMLOverlay
              captureClick={false}
              captureScroll={true}
              captureDoubleClick={true}
              captureDrag={true}
              redraw={() => (<div className="overlay__detail">
                               <button
                                 onClick={this.hide}
                                 className="mapboxgl-popup-close-button"
                                 type="button"
                                 //data-event='click'
                               >×</button>
                               {details}
                             </div>)}
            />
           ) || ''}
           {this.props.legend && <HTMLOverlay redraw={() => this.props.legend}/>}
        </ReactMapGL>
      </section>
    );
  }
}

if (environment !== 'production') {
  ReMap.propTypes = {
    bounds: T.array,
    handleLayerChange: T.func,
    handleSelectedLocation: T.func,
    externalLayers: T.array,
    selectedLayer: T.object,
    layersState: T.array,
    details: T.object,
    title: T.string,
    titleComponent: T.object,
    layersSelector: T.object,
  };
}

export default ReMap;
