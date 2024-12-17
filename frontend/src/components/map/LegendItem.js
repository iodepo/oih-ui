import React, { Component }from 'react';
import { render } from 'react-dom';
import { PropTypes as T } from 'prop-types';

import { environment } from '../../config';



class LegendItem extends Component {

  render() {

    const { source, range, description, legend_url, units } = this.props.layer;

    return (
      <div className='layers__legend'>
        {description &&
         (<div className='layers__legend-description'>
            {description}
          </div>) || "" }
        { legend_url &&
          (<div
             className="layers__legend-img"
             data-image-src={legend_url}
             style={{backgroundImage:`url(${legend_url})`}}
           />) || ''}
        {range && range.length &&
         (<div className='layers__legend-range'>
            <div className='range label-min'>
              { range[0] }
            </div>
            <div className='range label-max'>
              { range[1] }
            </div>
          </div>) || ''}
        { units &&
          ( <div className='layers__legend-units'>
              ({units})
            </div>) || '' }
        {source && (<div className='layers__legend-source'>
                      Source:{' '}
                      <a target='_blank' href={source.url} title='View'>
                        {source.label}
                      </a>
                    </div>) || ''}
      </div>
    );
  }
}


if (environment !== 'production') {
  LegendItem.propTypes = {
    layer: T.object,
  };
}

export default LegendItem;
