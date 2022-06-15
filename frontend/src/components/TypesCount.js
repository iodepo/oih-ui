import React, {useEffect, useState} from "react";
import {Col, Container, Row} from "react-bootstrap";


const defaultCountState = {
    "counts": {
        "CreativeWork": 0,
        "Person": 0,
        "Organization": 0,
        "Dataset": 0,
        "ResearchProject": 0,
        "Event": 0,
        "Course": 0,
        "Vehicle": 0
    }
}


export default function TypesCount() {
    const [counts, setCounts] = useState(defaultCountState);

    useEffect(() => {
        fetch('http://backend-api:8000/count?field_to_count=type')
            .then(response => response.json())
            .then(json => setCounts(json))
    }, []);

        return (
        <Container>
            <Row>
                <Row id="topBubbleRow">
                    <Col id="topCol"><p id="bubbleCount">{counts['counts']['Person'] + counts['counts']['Organization']}</p><p
                        id="bubbleText">Experts</p></Col>
                    <Col id="topCol"><p id="bubbleCount">{counts['counts']['CreativeWork']}</p><p id="bubbleText">Documents</p></Col>
                    <Col id="topCol"><p id="bubbleCount">{counts['counts']['Course']}</p><p id="bubbleText">Training</p></Col>
                </Row>
                <Row id="topBubbleBottom">
                    <Col id="topCol"><p id="bubbleCount">{counts['counts']['Vehicle']}</p><p id="bubbleText">Vessels</p></Col>
                    <Col id="topCol"><p id="bubbleCount">{counts['counts']['ResearchProject']}</p><p id="bubbleText">Projects</p></Col>
                    <Col id="topCol"><p id="bubbleCount">0</p><p id="bubbleText">Spatial Data & Maps</p></Col>
                </Row>
            </Row>
        </Container>
    )
}