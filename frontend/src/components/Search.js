import React, {useState, useCallback} from "react";
import {useNavigate, useLocation, useSearchParams} from "react-router-dom";
import useSearchParam from "../useSearchParam";

import Button from 'react-bootstrap/Button';
import BackgroundImage1 from '../resources/Photo Africa Coast Original.jpg'
import OIHLogo from "../resources/Logo Nav x 2.png";

const REGIONS = ['Global', 'Atlantic Ocean', 'Latin America and the Caribbean', 'Africa', 'Pacific Small Islands']

export default function Search() {
    const navigate = useNavigate();
    const [params,] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(params.has('search_text') ? params.get('search_text') : '');
    const [region, setRegion] = useSearchParam("region", "global")
    const location = useLocation();
    const isResults = location.pathname.startsWith("/results")


    const hrefFor = (region, query) => `/results/?${new URLSearchParams({
        ...query ? {search_text: query} : {},
        ...region && region.toUpperCase() !== "GLOBAL" ? {region} : {}
    })}`

    const handleChange = useCallback(() => navigate(hrefFor(region, searchQuery)), [navigate, region, searchQuery]);

    let url = window.location.href.split('/')[3]

    return (
        <div className={"pb-3 mt-4" + (url == " results" ? ' searchbg-alt' : '')}>
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-2 col-sm-12 me-4 mb-4">
                        <a href="/"><img className="p-1" height="100px" src={OIHLogo}/></a>
                    </div>


                    <div className="col-12 col-md-9 col-sm-11">
                        <form id='searchBarForm' className={"d-flex flex-justify-start align-self pt-2" + (url == "results" ? 'result-search' : '')} onSubmit={e => {
                    e.preventDefault()
                    handleChange()
                }}>
                    <select className="form-select w-50 rounded-0" value={region}
                            onChange={e => setRegion(e.target.value)}>
                        {
                            REGIONS.map((region) => {
                                return <option>{region}</option>
                            })
                        }
                    </select>
                    <input
                        className="flex-fill form-control rounded-0"
                        type="text"
                        placeholder={"Search across our " + region.toUpperCase() + " partners"}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        name="search"/>
                    <Button className="btn-lg btn-info rounded-0 text-dark" type="submit"><span className="h6">Search</span></Button>
                </form>
                        {!isResults && <div className="text-light text-start mt-3">
                    <span className="p-2 h5">TRY:</span>
                    <a href={hrefFor(region, 'Coral Reefs')} className="text-info text-light h6 p-2">Coral Reefs</a>
                    <a href={hrefFor(region, 'Rare Species')} className="text-info text-light h6 p-2">Rare Species</a>
                </div>}
                    </div>

                </div>
            </div>

        </div>
    )

}
