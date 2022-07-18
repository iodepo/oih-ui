import React, {useState, useEffect, useCallback} from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import useSearchParam from "../useSearchParam";

import Button from 'react-bootstrap/Button';
import {dataServiceUrl} from "../config/environment";

export default function Search() {
    const navigate = useNavigate();
    const [params,] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(params.has('search_text') ? params.get('search_text') : '');
    const [region, setRegion] = useSearchParam("region", "global")
    const [availableRegions, setAvailableRegions] = useState([]);
    const location = useLocation();
    const isResults = location.pathname.startsWith("/results")

    useEffect(() => {
        fetch(`${dataServiceUrl}/count?field=txt_region`)
            .then(response => response.json())
            .then(json => {
                setAvailableRegions(Object.keys(json['counts']))
            })
    }, []);

    const hrefFor = (region, query) => `/results/?${new URLSearchParams({
        ...query ? { search_text: query } : {},
        ...region && region.toUpperCase() !== "GLOBAL" ? { region } : {} 
    })}`

    const handleChange = useCallback(() => navigate(hrefFor(region, searchQuery)), [navigate, region, searchQuery]);

    return (
        <div className="w-50 mx-auto pb-3">
            <h1 className="text-light text-start">SEARCH THE <b>{region.toUpperCase()}</b></h1>
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
                    onChange={e => setSearchQuery(e.target.value)}
                    name="search"/>
                <Button className="btn-lg btn-info rounded-0 text-dark" type="submit">Search</Button>
            </form>
            {!isResults && <div className="text-light text-start d-flex flex-justify-start">
                <h5 className="p-2">TRY:</h5>
                <a href={hrefFor(region, 'Coral Reefs')} className="text-info h5 p-2">Coral Reefs</a>
                <a href={hrefFor(region, 'Rare Species')} className="text-info h5 p-2">Rare Species</a>
            </div>}
        </div>
    )

}
