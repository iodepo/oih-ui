import React, {useEffect, useState} from "react";
import {Col, Container, Row} from "react-bootstrap";

import { dataServiceUrl } from '../config/environment';
import {useNavigate} from "react-router-dom";
import useSearchParam from "../useSearchParam";
import { regionBoundsMap }  from '../constants';
import diver from "../resources/diving.png";
import lighthouse from "../resources/lighthouse.png";
import thinking from "../resources/thinking.png";
import documents from "../resources/document.png";
import map from "../resources/map.png";
import boat from "../resources/boat.png";
import project_mgmt from "../resources/project-management.png";
import database from "../resources/database.png";
const doc_types = ['CreativeWork', 'Person', 'Organization', 'Dataset', 'ResearchProject', 'Event', 'Course', 'Vehicle']
const defaultCountState = Object.fromEntries(doc_types.map(e => [e, 0]))

const formatter = Intl.NumberFormat([], { "notation": "compact" })
const HOME_PAGE_CATEGORIES =
    [
        {
            id: 'Person',
            text: 'Experts',
            icon: diver
        },
        {
            id: 'CreativeWork',
            text: 'Documents',
            icon: documents
        },
        {
            id: 'Course',
            text: 'Training',
            icon: thinking
        },
        {
            id: 'Dataset',
            text: 'Datasets',
            icon: database
        },
        {
            id: 'Vehicle',
            text: 'Vessels',
            icon: boat
        },
        {
            id: 'ResearchProject',
            text: 'Projects',
            icon: project_mgmt
        },
        {
            id: 'Organization',
            text: 'Institution',
            icon: lighthouse
        },
        {
            id: 'SpatialData',
            text: 'Spatial Data',
            icon: map
        }
];

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
