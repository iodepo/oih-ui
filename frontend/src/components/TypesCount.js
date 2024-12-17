/* global Intl */

import React, {useEffect, useState} from "react";
import {Col, Container, Row} from "react-bootstrap";

import { dataServiceUrl } from '../config/environment';
import {useNavigate} from "react-router-dom";
import useSearchParam from "../useSearchParam";
import { regionBoundsMap, HOME_PAGE_CATEGORIES }  from '../constants';
const doc_types = ['CreativeWork', 'Person', 'Organization', 'Dataset', 'ResearchProject', 'Event', 'Course', 'Vehicle']
const defaultCountState = Object.fromEntries(doc_types.map(e => [e, 0]))

const formatter = Intl.NumberFormat([], { "notation": "compact" })

export default function TypesCount() {
    const [counts, setCounts] = useState(defaultCountState);
    const navigate = useNavigate();
    const [region,] = useSearchParam("region")

    const get_region_bounds = () => {
        let bounds;
        if (region) bounds = regionBoundsMap[region.replaceAll(' ', '_')]
        if (bounds) return bounds
        else return '[-90,-180 TO 90,180]'
    }

    useEffect(() => {
        fetch(`${dataServiceUrl}/search?rows=0&include_facets=false&${region ? '&region=' + region : ''}`)
            .then(response => response.json())
            .then(json => setCounts(prev => ({ ...prev, ...json.counts })))

        fetch(`${dataServiceUrl}/search?rows=0&include_facets=false&facetType=the_geom&facetName=${get_region_bounds()}${region ? '&region=' + region : ''}`)
            .then(response => response.json())
            .then(json => setCounts(prev => ({...prev, SpatialData: Object.values(json.counts).reduce((x, y) => x + y, 0)})))
    }, [region]);

    const searchByType = type => event => navigate(`/results/${type}?${region ? 'region=' + region : ''}`);

    return (
      <Container className="bubble-height">
        <div id="bbc" className="category-section">
          <div className='container__categories'>
              {HOME_PAGE_CATEGORIES.map(col =>
                       <div
                         className="p-4 category__button"
                         role="button"
                         id={`bubble_${col.id}`}
                         key={col.id}
                         onClick={searchByType(col.id)}
                       >
                         <div>
                           <img className="p-1 category-icon" height="100px" src={col.icon}/>
                           <div className="d-flex">
                             <div className="bubble-container">
                               <div className="primary-bg rounded-circle bubble">
                                 <span className="text-light-alt">
                                   {counts[col.id] !== undefined ? formatter.format(counts[col.id]) : 0}
                                 </span>
                               </div>
                             </div>

                             <div className="">
                               <div className="text-light fw-bold bubble-textarea">{col.text ?? col.id}</div>
                             </div>
                           </div>
                         </div>
                       </div>
                      )}
          </div>
        </div>
      </Container>
    );
}
