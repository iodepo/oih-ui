import React from 'react';
import { render } from 'react-dom';
import { PropTypes as T } from 'prop-types';

import {BaseControl, HTMLOverlay} from 'react-map-gl';

import { environment } from '../../config';
import ShadowScrollbars from './ShadowScrollbar';
import LegendItem from './LegendItem';

class LayerControl extends BaseControl {

  constructor(props) {
    super(props);
    this.state = {
      visible: !!this.props.initiallyVisible,
    };
    this._onToggleLayerList = this._onToggleLayerList.bind(this);
    this._overlay = this._overlay.bind(this);
  }

  _onToggleLayerList(e) {
    const visible = !this.state.visible;
    this.setState({visible:visible});
  }

  _renderButton(type, label, callback, children) {
    return (
      <button
        key={type}
        className={`mapboxgl-ctrl-icon layers-menu-trigger`}
        type="button"
        title={label}
        onClick={callback}
      >
        {children || <span className="mapboxgl-ctrl-icon" aria-hidden="true" />}
      </button>
    );
  }

  _overlay(options) {
    const { handleLayerChange, externalLayers, layersState } = this.props;

    return (
      <div
        className='layers__container'
        >
        <ShadowScrollbars theme="light">
        <h5 className='layers__title'>Layers</h5>
        <ul className='layers-list'>
          {externalLayers.map((l, idx) => (
            <li className='layers-list__item' key={l.id}>
              <div className='form__group'>
                { l.legend_color && (
                  <div className='layers__legend-blob'
                       style={{backgroundColor:l.legend_color}}
                  />
                ) || ''}
                <Toggle
                  text={l.label}
                  name={`switch-${l.id}`}
                  title='Toggle on/off'
                  checked={layersState[idx]}
                  onChange={() => handleLayerChange(idx)}
                />
              </div>
              <LegendItem
                layer={l}
              />
            </li>
          ))}
        </ul>
        </ShadowScrollbars>
      </div>
    );
  }


  _render() {
    const {
      handleLayerChange,
      externalLayers,
      layersState,
      children
    } = this.props;

    const { visible } = this.state;

    return (
      <div className="mapboxgl-ctrl mapboxgl-ctrl-group " ref={this._containerRef}>
        { this._renderButton('layers', 'Select Layers', this._onToggleLayerList, children )}
        { visible && (
          <HTMLOverlay
            captureClick={true}
            captureScroll={true}
            captureDoubleClick={false}
            captureDrag={false}
            redraw={this._overlay}
          />
        ) || ""}
      </div>
    );
  }
}


if (environment !== 'production') {
  LayerControl.propTypes = {
    handleLayerChange: T.func,
    externalLayers: T.array,
    layersState: T.array,
    initiallyVisible: T.bool,
  };
}

export default LayerControl;



const Toggle = props => {
  const { text, name, title, checked, onChange } = props;

  return (
    <label
      htmlFor={name}
      className='form__option form__option--switch'
      title={title}
    >
      <input
        type='checkbox'
        name={name}
        id={name}
        value='on'
        checked={checked}
        onChange={onChange}
      />
      <span className='form__option__text'>{text}</span>
      <span className='form__option__ui' />
    </label>
  );
};

if (environment !== 'production') {
  Toggle.propTypes = {
    text: T.string,
    name: T.string,
    title: T.string,
    checked: T.bool,
    onChange: T.func,
  };
}
