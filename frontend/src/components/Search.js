import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

import {Button} from 'react-bootstrap';
import {dataServiceUrl} from "../config/environment";


export default function Search({setSearchText, isDisplaySearch, setIsDisplaySearch, region, setRegion}) {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState(' ');
    const [availableRegions, setAvailableRegions] = useState([]);

    useEffect(() => {
        fetch(`${dataServiceUrl}/count?field=txt_region`)
            .then(response => response.json())
            .then(json => {
                setAvailableRegions(Object.keys(json['counts']))
            })
    }, []);

    const handleChange = () => {
        if (searchQuery.length > 0)
        {
            setSearchText(searchQuery);
            setIsDisplaySearch(true);
            navigate(`/results/search_text=${searchQuery}/document_type=CreativeWork`)
        }
    };

    const updateSearchQuery = (event) => {
        setSearchQuery(event.target.value);
    };

    const searchOnEnterKey = (event) => {
        if(event.key === 'Enter'){
            handleChange()
        }
    }

    const suggestionLink = (event) => {
        setSearchQuery(event.currentTarget.textContent)
        setSearchText(event.currentTarget.textContent);
        setIsDisplaySearch(true);
        navigate(`/results/search_text=${event.currentTarget.textContent}/document_type=CreativeWork`)
    }

    const updateSearchRegion = (event) => {
        if (event.target.value.toUpperCase() !== 'GLOBAL') {
            setRegion(event.target.value)
        } else {
            setRegion('')
        }
    }

    return (
        <div id="SearchSection">
            <h1 className="infohubH">SEARCH THE <b>{region}</b></h1>
            <h1 className="infohubH">OCEAN INFOHUB</h1>
            <div className="searchForm">
                <select onChange={updateSearchRegion}>
                    <option>Global</option>
                    {
                        availableRegions.map((region) => {
                            return <option>{region}</option>
                        })
                    }
                </select>
                <input type="text" placeholder="Search for content" defaultValue={searchQuery} onChange={updateSearchQuery} onKeyDown={searchOnEnterKey} name="search"/>
                <Button onClick={handleChange} id="SearchBtn"><i className="fa fa-search">Search</i></Button>
                <h3 className="infohubH" hidden={isDisplaySearch}>
                    TRY: &nbsp;
                    <a className="searchSuggestionLink" onClick={suggestionLink}>Coral Reefs</a>&nbsp;
                    <a className="searchSuggestionLink" onClick={suggestionLink}>Rare Species</a>
                </h3>
            </div>
        </div>
    )

}
