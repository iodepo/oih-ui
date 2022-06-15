import React from "react";
import {Col, Container, Row} from "react-bootstrap";
import PersonResult from "./PersonResult";
import CourseResult from "./CourseResult";
import VesselResult from "./VesselResult";
import ProjectResult from "./ProjectResult";

export default function DescriptionResult({result}) {
    return (
        <div id="expertDetails">
            <h6>Name: <a href={result['txt_url'] || result['id']}> {result['name']}</a></h6>
            <Container>
                <Row>
                    <Col id="topBubbleRow" className="col col-lg-4">
                        {result['type'] === 'CreativeWork' && <PersonResult result={result}/>}
                        {result['type'] === 'Course' && <CourseResult result={result}/>}
                        {result['type'] === 'Vehicle' && <VesselResult result={result}/>}
                        {result['type'] === 'ResearchProject' && <ProjectResult result={result}/>}
                    </Col>
                    <Col id="topBubbleBottom">
                        <p>{result['description']}</p>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}