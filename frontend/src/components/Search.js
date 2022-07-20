import React, {useState, useEffect, useCallback} from "react";
import {useNavigate, useLocation, useSearchParams} from "react-router-dom";
import useSearchParam from "../useSearchParam";

import Button from 'react-bootstrap/Button';
import {dataServiceUrl} from "../config/environment";

import BackgroundImage1 from '../resources/Photo Africa Coast Original.jpg'

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
        ...query ? {search_text: query} : {},
        ...region && region.toUpperCase() !== "GLOBAL" ? {region} : {}
    })}`

    const handleChange = useCallback(() => navigate(hrefFor(region, searchQuery)), [navigate, region, searchQuery]);

    return (
        <div className="pb-3 searchbg">
            <div className="container">
                <h1 className="text-light text-start pt-5">SEARCH THE <b className="bg-alt">{region.toUpperCase()}</b>
                    <br/>OCEAN INFOHUB</h1>
                <form id='searchBarForm' className="d-flex flex-justify-start align-self mt-3 w-75" onSubmit={e => {
                    e.preventDefault()
                    handleChange()
                }}>
                    <select className="form-select w-25 rounded-0" value={region}
                            onChange={e => setRegion(e.target.value)}>
                        <option value="">Global</option>
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
                    <Button className="btn-lg btn-info rounded-0 text-dark" type="submit"><span className="h6">Search</span></Button>
                </form>
                {!isResults && <div className="text-light text-start mt-3">
                    <span className="p-2 h5">TRY:</span>
                    <a href={hrefFor(region, 'Coral Reefs')} className="text-info h6 p-2">Coral Reefs</a>
                    <a href={hrefFor(region, 'Rare Species')} className="text-info h6 p-2">Rare Species</a>
                </div>}
            </div>

        </div>
    )

}
