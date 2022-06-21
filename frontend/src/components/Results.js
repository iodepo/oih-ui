import React, {useEffect, useState} from "react";

import Expert from './Expert'
import DescriptionResult from "./results/descriptionResult";
import ResultTabs from "./ResultTabs";
import { dataServiceUrl } from '../config/environment';

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
    const [facetQuery, setFacetQuery] = useState(null);

    useEffect(() => {
        // let URI = `${dataServiceUrl}/search?text=${searchText}&document_type=${searchType}`
        let URI = `https://api.oih.staging.derilinx.com/search?text=${searchText}&document_type=${searchType}`
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
        const clickedFacetQuery = `&facetType=${event.target.className}&facetName=${event.target.text}`
        if (facetQuery) {
            setFacetQuery(facetQuery + clickedFacetQuery)
        } else {
            setFacetQuery(clickedFacetQuery)
        }
    }

    const clearFactQuery = () => {
        setFacetQuery('')
    }

    return (
        <div id='resultsMain'>
            <div id="resultsFacets">
                <div id='factsHeading'>
                    <h3><b>Filter By:</b></h3>
                    <a id='clearFacet' onClick={clearFactQuery}>clear</a>
                </div>
                        {
                            facets.map((facet, i) => {
                                return (
                                    <div key={i}>
                                        <h6>{facet.name}</h6>
                                        {
                                            facet.counts.map((facetCount, i) => {
                                                return <p><a className={facet.name} onClick={facetSearch}>{facetCount.name}</a> ({facetCount.count})</p>
                                            })
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
            <div id="resultsBackground">
                <ResultTabs tabList={tabs} setSearchType={setSearchType} clearFactQuery={clearFactQuery}/>
                <h3 className="resultsHeading">Search Query: {searchText}</h3>
                <h4 className="resultsHeading">{mapSearchTypeToProfile(searchType)}</h4>
                <h6 className="resultsHeading"> Total results found {resultCount || 0}</h6>
                <div>
                    <div id="resultsInfo">
                        {
                            results.map((data, i) => {
                                if (data['type'] === 'Person') {
                                    return (<div key={i}>
                                        <Expert expert={data} clearFactQuery={clearFactQuery}></Expert>
                                    </div>)
                                }
                                return (
                                    <div>
                                        <DescriptionResult result={data}/>
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
