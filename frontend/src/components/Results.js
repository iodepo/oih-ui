import React, {Component, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useLocation} from "react-router";

import Expert from './Expert'
import ResultTabs from "./ResultTabs";
import {dataServiceUrl} from '../config/environment';
import {Col, Container, Row} from "react-bootstrap";
import DocumentResult from "./results/DocumentResult";
import CourseResult from "./results/CourseResult";
import VesselResult from "./results/VesselResult";
import ProjectResult from "./results/ProjectResult";


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
};

export default function Results({searchText, setSearchText}) {

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
    const [facetQuery, setFacetQuery] = useState(null);

    const navigate = useNavigate();
    const location = useLocation()

    useEffect(() => {
        const doFetch = async () => {
            let URI = `${dataServiceUrl}/search?`;
            const params = new URLSearchParams({'search_text': searchText, 'document_type': searchType})
            URI += params.toString()
            if (facetQuery) {
                URI += facetQuery
            }
            fetch(encodeURI(URI))
                .then(response => response.json())
                .then(json => {
                    setResults(json.docs)
                    setResultCount(json.counts[searchType])
                    setFacets(json.facets)
                })
        }

        const checkParams = async () => {
            if (searchText === '') {
                const params = decodeURIComponent(location['pathname'].replace('/results/', ''))
                for (const url_parameter of params.split('/')) {
                    if (url_parameter.startsWith('search_text')) {
                        setSearchText(url_parameter.replace('search_text=', ''))
                    } else if (url_parameter.startsWith('document_type')) {
                        setSearchType(url_parameter.replace('document_type=', ''))
                    } else if (url_parameter.startsWith('facetSearch=')) {
                        setFacetQuery(url_parameter.replace('facetSearch=', ''))
                    }
                }
            }
        }

        checkParams().then(() => {
            if (searchText !== '') {
                doFetch().catch(console.error)
            }
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

    const facetSearch = async (event) => {
        const clickedFacetQuery = `&facetType=${event.target.className}&facetName=${event.target.text}`
        if (facetQuery) {
             setFacetQuery(facetQuery + clickedFacetQuery)
            navigate(`${location['pathname'].replace('/results/', '')}/facetSearch=${facetQuery + clickedFacetQuery}`)
        } else {
            setFacetQuery(clickedFacetQuery)
            navigate(`${location['pathname'].replace('/results/', '')}/facetSearch=${clickedFacetQuery}`)
        }
    }

    const resetDefaultSearchUrl = (searchType) => {
        navigate(`/results/search_text=${searchText}/document_type=${searchType}`)
    }

    const clearFacetQuery = () => {
        setFacetQuery('')
        resetDefaultSearchUrl(searchType)
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
            <div id="resultsFacets">
                <div id='factsHeading'>
                    <h3><b>Filter By:</b></h3>
                    <a id='clearFacet' onClick={clearFacetQuery}>Clear</a>
                </div>
                {
                    facets.map((facet, i) => {
                        return (
                            <div key={i}>
                                <h6>{facet.name.substring(4)}</h6>
                                {
                                    facet.counts.map((facetCount, i) => {
                                        return <p><a className={facet.name}
                                                     onClick={facetSearch}>{facetCount.name}</a> ({facetCount.count})
                                        </p>
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
            <div id="resultsBackground">
                <ResultTabs tabList={tabs} setSearchType={setSearchType} searchType={searchType} clearFacetQuery={clearFacetQuery} resetDefaultSearchUrl={resetDefaultSearchUrl}/>
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
