import React, {Component, useEffect, useState} from "react";

import Expert from './Expert'
import ResultTabs from "./ResultTabs";
import {dataServiceUrl} from '../config/environment';
import {Col, Container, Row} from "react-bootstrap";
import DocumentResult from "./results/DocumentResult";
import CourseResult from "./results/CourseResult";
import VesselResult from "./results/VesselResult";
import ProjectResult from "./results/ProjectResult";
import OrganizationResult from "./results/OrganizationResult";

import FacetsSidebar from "./results/FacetsSidebar";


const typeMap = {
    CreativeWork: {
        Component: DocumentResult,
        type: "Document",
    },
    Person: {
        Component: Expert,
        type: "Experts",
    },
    Course: {
        Component: CourseResult,
        type: "Training",
    },
    Vehicle: {
        Component: VesselResult,
        type: "Vessels",
    },
    ResearchProject: {
        Component: ProjectResult,
        type: "Projects",
    },
    Organization: {
	Component: OrganizationResult,
	type: "Organizations",
    },
};

export default function Results({searchText}) {

    const tabs = [
        {
            title: 'CreativeWork',
            tab_name: 'Documents',
        },
        {
            title: 'Person',
            tab_name: 'Experts',
        },
        {
            title: 'Course',
            tab_name: 'Training',
        },
        {
            title: 'Vehicle',
            tab_name: 'Vessels',
        },
        {
            title: 'ResearchProject',
            tab_name: 'Projects',
        },
        {
            title: 'SpatialData',
            tab_name: 'Spatial Data & Maps',
        }
    ];
    const [searchType, setSearchType] = useState('CreativeWork');
    const [results, setResults] = useState([]);
    const [resultCount, setResultCount] = useState(0);
    const [facets, setFacets] = useState([]);
    const [facetQuery, setFacetQuery] = useState('');

    useEffect(() => {
        let URI = `${dataServiceUrl}/search?`;
        const params = new URLSearchParams({'search_text': searchText, 'document_type': searchType})
        URI += [params.toString(), facetQuery].filter(e=>e).join("&")

        fetch(URI)
            .then(response => response.json())
            .then(json => {
                setResults(json.docs)
                setResultCount(json.counts[searchType])
                setFacets(json.facets)
            })
    }, [searchText, searchType, facetQuery]);

    function mapSearchTypeToProfile(searchType) {
        for (const tab of tabs) {
            if (tab['title'] === searchType) {
                return tab['tab_name']
            }
        }
        return 'unknown type'
    }

    const facetSearch = (event) => {
        const selectedIndex = event.target.selectedIndex;
        const clickedFacetQuery = new URLSearchParams({facetType:event.target.children[selectedIndex].className,
						       facetName:event.target.value}).toString()
	setFacetQuery([facetQuery , clickedFacetQuery].filter(e=>e).join("&"))

    }

    const clearFacetQuery = () => {
        setFacetQuery('')
    }

    function resolveAsUrl(url) {
        const pattern = /^((http|https):\/\/)/;
        if (!pattern.test(url)) {
            return "http://" + url;
        }
        return url
    }

    return (
        <div id='resultsMain'>
            <FacetsSidebar facets={facets} clearFacetQuery={clearFacetQuery} facetSearch={facetSearch} />
            <div id="resultsBackground">
                <ResultTabs tabList={tabs} setSearchType={setSearchType} clearFacetQuery={clearFacetQuery}/>
                <h3 className="resultsHeading">Search Query: {searchText}</h3>
                <h4 className="resultsHeading">{mapSearchTypeToProfile(searchType)}</h4>
                <h6 className="resultsHeading"> Total results found {resultCount || 0}</h6>
                <div>
                    <div id="resultsInfo">
                        {
                            results.map((result, i) => {
                                const {Component} = typeMap[result['type']]
                                return (
                                    <div id="expertDetails">
                                        <h6>Name: <a
                                            href={result['txt_url'] || resolveAsUrl(result['id'])}> {result['name']}</a>
                                        </h6>
                                        <Container>
                                            <Row>
                                                <Col id="topBubbleRow" className="col col-lg-4">
                                                    <Component result={result}/>
                                                </Col>
                                                {'description' in result && result['type'] !== 'Person' &&
                                                    (
                                                        <Col id="topBubbleBottom">
                                                            <p>{result['description']}</p>
                                                        </Col>
                                                    )
                                                }
                                            </Row>
                                        </Container>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
