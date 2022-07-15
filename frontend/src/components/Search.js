import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

import Button from 'react-bootstrap/Button';
import {dataServiceUrl} from "../config/environment";


export default function Search({setSearchText, isDisplaySearch, setIsDisplaySearch, region, setRegion, setIsLoadingFromSharableURL}) {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
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
            setIsLoadingFromSharableURL(false)
            navigate(`/results/search_text=${searchQuery}/document_type=CreativeWork/selected_region=${region}`)
        }
    };

    const updateSearchQuery = (event) => {
        setSearchQuery(event.target.value);
    };

    const suggestionLink = (event) => {
        setSearchQuery(event.currentTarget.textContent)
        setSearchText(event.currentTarget.textContent);
        setIsDisplaySearch(true);
        setIsLoadingFromSharableURL(false)
        navigate(`/results/search_text=${searchQuery}/document_type=CreativeWork/selected_region=${region}`)
    }

    return (
        <div className="w-50 mx-auto pb-3">
            <h1 className="text-light text-start">SEARCH THE <b>{region}</b></h1>
            <h1 className="text-light text-start">OCEAN INFOHUB</h1>
            <form className="d-flex flex-justify-start align-self" onSubmit={e => {
                e.preventDefault()
                handleChange()
            }}>
                <select className="form-select w-25 rounded-0" value={region} onChange={e => setRegion(e.target.value)}>
                    <option>Global</option>
                    {
                        availableRegions.map((region) => {
                            return <option>{region}</option>
                        })
                    }
                </select>
                <input
                    className="flex-fill form-control rounded-0"
                    type="text"
                    placeholder="Search for content"
                    value={searchQuery}
                    onChange={updateSearchQuery}
                    name="search"/>
                <Button className="btn-lg btn-info rounded-0 text-dark" type="submit">Search</Button>
            </form>
            <div hidden={isDisplaySearch} className="text-light text-start d-flex flex-justify-start">
                <h5 className="p-2">TRY:</h5>
                <a href="#" className="text-info h5 p-2" onClick={suggestionLink}>Coral Reefs</a>
                <a href="#" className="text-info h5 p-2" onClick={suggestionLink}>Rare Species</a>
            </div>
        </div>
    )

}
