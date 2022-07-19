import React, {useEffect, useState} from "react";
import {Col, Container, Row} from "react-bootstrap";

import { dataServiceUrl } from '../config/environment';
import {useNavigate} from "react-router-dom";
import useSearchParam from "../useSearchParam";

const doc_types = ['CreativeWork', 'Person', 'Organization', 'Dataset', 'ResearchProject', 'Event', 'Course', 'Vehicle']
const defaultCountState = {'counts': Object.fromEntries(doc_types.map(e => [e, 0]))}

const entries = counts => [
    [
        {
            id: 'Experts',
            count: (counts['Person'] || 0) + (counts['Organization'] || 0),
            text: 'Experts'
        },
        {
            id: 'CreativeWork',
            text: 'Documents'
        },
        {
            id: 'Course',
            text: 'Training'
        }
    ],
    [
        {
            id: 'Vehicle',
            text: 'Vessels'
        },
        {
            id: 'ResearchProject',
            text: 'Projects'
        },
        {
            id: 'SpatialData',
            count: 0,
            text: 'Spatial Data & Maps'
        }
    ]
];

export default function TypesCount() {
    const [counts, setCounts] = useState(defaultCountState);
    const [spatialData, setSpatialData] = useState(0);
    const navigate = useNavigate();
    const [region,] = useSearchParam("region")

    useEffect(() => {
        fetch(`${dataServiceUrl}/count?field=type${region ? '&region=' + region : ''}`)
            .then(response => response.json())
            .then(json => setCounts(json))

        fetch(`${dataServiceUrl}/spatial.geojson?${region ? 'region=' + region : ''}`)
            .then(response => response.json())
            .then(json => setSpatialData(json['count']))

    }, [region]);

    const searchByType = type => event => navigate(`/results/${type}?${region ? 'region=' + region : ''}`);

    return (
        <Container>
            <Row>
                {entries(counts.counts).map(row =>
                    <Row className="pb-3 mb-2">
                        {row.map(col =>
                            <Col className="bg-light rounded-circle h-100 bubble" role="button" id={`bubble_${col.id}`} onClick={searchByType(col.id)}>
                                <p className="text-light-blue">
                                    {
                                        col.id !== 'SpatialData' ? counts.counts[col.id] || 0 : spatialData
                                    }
                                </p>
                                <p className="text-dark-blue">{col.text ?? col.id}</p>
                            </Col>
                        )}
                    </Row>
                )}
            </Row>
        </Container>
    )
}
