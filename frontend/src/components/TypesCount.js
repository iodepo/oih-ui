import React, {useEffect, useState} from "react";
import {Col, Container, Row} from "react-bootstrap";

import { dataServiceUrl } from '../config/environment';
import {useNavigate} from "react-router-dom";

const doc_types = ['CreativeWork', 'Person', 'Organization', 'Dataset', 'ResearchProject', 'Event', 'Course', 'Vehicle']
const defaultCountState = {'counts': Object.fromEntries(doc_types.map(e => [e, 0]))}


export default function TypesCount({setIsLoadingFromSharableURL, setSearchType, setIsDisplaySearch}) {
    const [counts, setCounts] = useState(defaultCountState);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${dataServiceUrl}/count?field=type`)
            .then(response => response.json())
            .then(json => setCounts(json))
    }, []);
    
    const searchByType = (event) => {
        setIsLoadingFromSharableURL(false);
        const typeToSearch = event.currentTarget.id.replace('bubble_', '')
        setSearchType(typeToSearch);
        setIsDisplaySearch(true);
        navigate(`/results/document_type=${typeToSearch}`)
    }
    
    return (
        <Container>
            <Row>
                <Row id="topBubbleRow">
                    <Col id="topCol">
                        <div className='bubbleClickZone' id='bubble_Person' onClick={searchByType}>
                            <p id="bubbleCount" >{counts['counts']['Person'] + counts['counts']['Organization']}</p>
                            <p id="bubbleText">Experts</p>
                        </div>
                    </Col>
                    <Col id="topCol">
                        <div className='bubbleClickZone' id='bubble_CreativeWork' onClick={searchByType} >
                            <p id="bubbleCount">{counts['counts']['CreativeWork']}</p><p id="bubbleText">Documents</p>
                        </div>
                    </Col>
                    <Col id="topCol">
                        <div className='bubbleClickZone' id='bubble_Course' onClick={searchByType} >
                            <p id="bubbleCount">{counts['counts']['Course']}</p><p id="bubbleText">Training</p>
                        </div>
                    </Col>
                </Row>
                <Row id="bottomBubbleRow">
                    <Col id="topCol">
                        <div className='bubbleClickZone' id='bubble_Vehicle' onClick={searchByType} >
                            <p id="bubbleCount">{counts['counts']['Vehicle']}</p><p id="bubbleText">Vessels</p>
                        </div>
                    </Col>
                    <Col id="topCol">
                        <div className='bubbleClickZone' id='bubble_ResearchProject' onClick={searchByType} >
                            <p id="bubbleCount">{counts['counts']['ResearchProject']}</p><p id="bubbleText">Projects</p>
                        </div>
                    </Col>
                    <Col id="topCol">
                        <div className='bubbleClickZone' id='bubble_Spatial' onClick={searchByType} >
                            <p id="bubbleCount">0</p><p id="bubbleText">Spatial Data & Maps</p>
                        </div>
                    </Col>
                </Row>
            </Row>
        </Container>
    )
}
