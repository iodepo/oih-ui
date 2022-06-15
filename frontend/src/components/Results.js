import React, {useEffect, useState} from "react";

import Expert from './Expert'
import DescriptionResult from "./results/descriptionResult";
import ResultTabs from "./ResultTabs";

export default function Results({searchText}) {

    const [searchType, setSearchType] = useState('CreativeWork');
    const [results, setResults] = useState([]);
    const [resultCount, setResultCount] = useState(0);

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

    useEffect(() => {
        fetch(encodeURI(`http://backend-api:8000/search?text=${searchText}&document_type=${searchType}`))
            .then(response => response.json())
            .then(json => {
                setResults(json.docs)
                setResultCount(json.counts[searchType])
            })
    }, [searchText, searchType]);

    function mapSearchTypeToProfile(searchType){
        for (const tab of tabs) {
            if (tab['title'] === searchType){
                return tab['tab_name']
            }
        }
        return 'unknown type'
    }

    return (
        <div id="resultsBackground">
            <ResultTabs tabList={tabs} setSearchType={setSearchType}/>
            <h3 className="resultsHeading">Search Query: {searchText}</h3>
            <h4 className="resultsHeading">{mapSearchTypeToProfile(searchType)}</h4>
            <h6>Total results found {resultCount || 0}</h6>
            {
                results.map((data, i) => {
                    if (data['type'] === 'Person') {
                        return (<div key={i}>
                            <Expert expert={data}></Expert>
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
    )
}
