import React, {useState} from "react";

import {Button} from 'react-bootstrap';


export default function Search({setSearchText, isDisplaySearch, setIsDisplaySearch}) {
    const [searchQuery, setSearchQuery] = useState(' ');


    const handleChange = () => {
        console.log('handleChange()')
        console.log(searchQuery.length)
        if (searchQuery.length > 0)
        {
            setSearchText(searchQuery);
            setIsDisplaySearch(true);
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
    }

    return (
        <div id="SearchSection">
            <h1 id="infohubH">SEARCH THE <b>Global</b></h1>
            <h1 id="infohubH">OCEAN INFOHUB</h1>
            <div className="searchForm">
                <input type="text" placeholder="Search for content" defaultValue={searchQuery} onChange={updateSearchQuery} onKeyDown={searchOnEnterKey} name="search"/>
                <Button onClick={handleChange} id="SearchBtn"><i className="fa fa-search">Search</i></Button>
                <h3 id="infohubH" hidden={isDisplaySearch}>
                    TRY: &nbsp;
                    <a className="searchSuggestionLink" onClick={suggestionLink}>Coral Reefs</a>&nbsp;
                    <a className="searchSuggestionLink" onClick={suggestionLink}>Rare Species</a>
                </h3>
            </div>
        </div>
    )

}
