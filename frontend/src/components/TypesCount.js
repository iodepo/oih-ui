import React, {useEffect, useState} from "react";
import {Col, Container, Row} from "react-bootstrap";

import { dataServiceUrl } from '../config/environment';
import {useNavigate} from "react-router-dom";

const doc_types = ['CreativeWork', 'Person', 'Organization', 'Dataset', 'ResearchProject', 'Event', 'Course', 'Vehicle']
const defaultCountState = {'counts': Object.fromEntries(doc_types.map(e => [e, 0]))}

const entries = counts => [
    [
        {
            id: 'Person',
            count: counts['Person'] + counts['Organization'],
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
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${dataServiceUrl}/count?field=type`)
            .then(response => response.json())
            .then(json => setCounts(json))
    }, []);
    
    const searchByType = type => event => navigate(`/results/${type}`);
    
    return (
        <Container>
            <Row>
                {entries(counts.counts).map(row =>
                    <Row className="pb-3 mb-2">
                        {row.map(col =>
                            <Col className="bg-light rounded-circle h-100 bubble" role="button" id={`bubble_${col.id}`} onClick={searchByType(col.id)}>
                                <p className="text-light-blue">{col.count ?? counts.counts[col.id] }</p>
                                <p className="text-dark-blue">{col.text ?? col.id}</p>
                            </Col>
                        )}
                    </Row>
                )}
            </Row>
        </Container>
    )
}
