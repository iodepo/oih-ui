/* global URLSearchParams */

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSearchParam from "../../useSearchParam";

import ResultTabs from "./ResultTabs";
import { dataServiceUrl } from "../../config/environment";
import { Row } from "react-bootstrap";
import {
  regionMap,
  regionBoundsMap,
  INITIAL_BOUNDS,
  DEFAULT_QUERY_BOUNDS,
  tabs,
} from "../../constants";
import throttle from "lodash/throttle";

import ReMap from "../map/ReMap";
import Pagination, { ITEMS_PER_PAGE } from "../results/Pagination";
import { Popup } from "react-map-gl";
import FacetsFullWidth from "../results/FacetsFullWidth";

import typeMap from "../results/types";
import { useAppTranslation } from "ContextManagers/context/AppTranslation";
import Search from "components/Search";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import FilterListIcon from "@mui/icons-material/FilterList";
import ViewSidebarOutlinedIcon from "@mui/icons-material/ViewSidebarOutlined";
import Divider from "@mui/material/Divider";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import FilterBy from "./FilterBy";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Fab from "@mui/material/Fab";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
//import Pagination from "@mui/material/Pagination";

import {
  expandMapBounds,
  containsMapBounds,
  mapboxBounds_toQuery,
} from "./mapFunctions";
import ResultValue from "./ResultValue";

function resolveAsUrl(url) {
  const pattern = /^((http|https):\/\/)/;
  if (!pattern.test(url)) {
    return "http://" + url;
  }
  return url;
}

const fetchDetail = (id) =>
  fetch(`${dataServiceUrl}/detail?id=${id}`).then((r) => r.json());

export default function Results() {
  const [results, setResults] = useState([]);
  const [resultCount, setResultCount] = useState(0);
  const [counts, setCounts] = useState({});
  const [facets, setFacets] = useState([]);
  const [mapBounds, setMapBounds] = useState(false);

  const navigate = useNavigate();
  const { searchType = "CreativeWork" } = useParams();
  const showMap = searchType === "SpatialData";
  const [searchText, setSearchText] = useSearchParam("search_text", "");
  const [region, setRegion] = useSearchParam("region", "global");
  const [facetQuery, setFacetQuery] = useSearchParam("facet_query");
  const [page, setPage] = useSearchParam("page", 0);
  const [facetValues, setFacetFacetValues] = useState(
    new Array(facets.length).fill("")
  );

  const [openDialog, setOpenDialog] = useState(false);
  const translationState = useAppTranslation();
  useEffect(() => {
    fetch(
      `${dataServiceUrl}/search?${new URLSearchParams({
        rows: 0,
        include_facets: false,
        ...(region.toUpperCase() !== "GLOBAL" ? { region } : {}),
        ...(searchText ? { search_text: searchText } : {}),
      })}`
    )
      .then((response) => response.json())
      .then((json) =>
        setCounts((prev) => ({
          ...json.counts,
          [searchType]: prev[searchType],
          SpatialData: prev.SpatialData,
        }))
      );
  }, [region, searchText, searchType]);

  const mapSearch = useCallback(
    throttle((mapBounds, page) => {
      let URI = `${dataServiceUrl}/search?`;
      const params = new URLSearchParams({
        ...(searchType !== "SpatialData" ? { document_type: searchType } : {}),
        facetType: "the_geom",
        facetName: mapboxBounds_toQuery(mapBounds, region),
        rows: ITEMS_PER_PAGE,
        start: page * ITEMS_PER_PAGE,
      });
      if (searchText !== "") {
        params.append("search_text", searchText);
      }
      if (region && region.toUpperCase() !== "GLOBAL") {
        params.append("region", region);
      }
      URI += [params.toString(), facetQuery].filter((e) => e).join("&");
      fetch(URI)
        .then((response) => response.json())
        .then((json) => {
          setResults(json.docs);
          setFacets(json.facets.filter((facet) => facet.counts.length > 0));
          const count = json.count;
          setResultCount(count);
          setCounts((prev) => ({ ...prev, [searchType]: count }));
        });
    }, 1000),
    [dataServiceUrl, searchText, searchType, region, facetQuery]
  );

  useEffect(() => {
    if (showMap) {
      mapSearch(mapBounds, page);
    } else {
      debugger;
      let URI = `${dataServiceUrl}/search?`;
      const params = new URLSearchParams({
        document_type: searchType,
        start: page * ITEMS_PER_PAGE,
        rows: ITEMS_PER_PAGE,
      });
      if (searchText !== "") {
        params.append("search_text", searchText);
      }
      if (region.toUpperCase() !== "GLOBAL") {
        params.append("region", region);
      }
      URI += [params.toString(), facetQuery].filter((e) => e).join("&");

      fetch(URI)
        .then((response) => response.json())
        .then((json) => {
          setResults(json.docs);
          const count = json.count;
          setResultCount(count);
          setCounts((prev) => ({ ...prev, [searchType]: count }));
          setFacets(json.facets.filter((facet) => facet.counts.length > 0));
        });

      const geoParams = new URLSearchParams({
        facetType: "the_geom",
        facetName: get_region_bounds(),
        include_facets: false,
        rows: 0,
      });
      if (region && region.toUpperCase() !== "GLOBAL") {
        geoParams.append("region", region);
      }
      if (searchText) {
        geoParams.append("search_text", searchText);
      }
      fetch(`${dataServiceUrl}/search?${geoParams.toString()}`)
        .then((response) => response.json())
        .then((json) =>
          setCounts((prev) => ({
            ...prev,
            SpatialData: Object.values(json.counts).reduce((x, y) => x + y, 0),
          }))
        );
    }
  }, [searchText, searchType, facetQuery, showMap, mapBounds, region, page]);

  const facetSearch = (name, value) => {
    debugger;
    //const selectedIndex = event.target.selectedIndex;
    const clickedFacetQuery = new URLSearchParams({
      facetType: name,
      facetName: value,
    }).toString();
    setFacetQuery([facetQuery, clickedFacetQuery].filter((e) => e).join("&"));
  };

  const resetDefaultSearchUrl = (type) => {
    navigate(
      `/results/${type}?${new URLSearchParams({
        ...(searchText ? { search_text: searchText } : {}),
        ...(region.toUpperCase() !== "GLOBAL" ? { region } : {}),
      })}`
    );
  };

  const clearFacetQuery = () => {
    setFacetFacetValues(new Array(facets.length).fill(""));
    resetDefaultSearchUrl(searchType);
  };

  const [expandedMapBounds, setExpandedMapBounds] = useState(false);
  const [allowSetMapBounds] = useState(true);
  const [viewport, setViewport] = useState({});

  const updateMapBounds = useCallback(
    (bounds, viewport) => {
      setViewport(viewport);
      if (allowSetMapBounds) {
        setMapBounds(bounds);
        if (
          !expandedMapBounds ||
          !containsMapBounds(expandedMapBounds, bounds)
        ) {
          setExpandedMapBounds(expandMapBounds(bounds));
        }
      }
    },
    [expandedMapBounds, setMapBounds, setExpandedMapBounds, allowSetMapBounds]
  );

  const geoJsonUrl = useMemo(() => {
    if (showMap) {
      let geoJsonUrl = `${dataServiceUrl}/spatial.geojson?`;
      const params = new URLSearchParams({
        ...(searchType !== "SpatialData" ? { document_type: searchType } : {}),
        search_text: searchText,
        facetType: "the_geom",
        facetName: mapboxBounds_toQuery(expandedMapBounds, region),
      });
      if (region !== "" && region.toUpperCase() !== "GLOBAL") {
        params.append("region", region);
      }
      geoJsonUrl += [params.toString(), facetQuery].filter((e) => e).join("&");
      return geoJsonUrl;
    }
    return null;
  }, [
    showMap,
    dataServiceUrl,
    searchType,
    searchText,
    region,
    expandedMapBounds,
    facetQuery,
  ]);

  const layers = useMemo(() => {
    return [
      {
        id: "search_results_layer",
        label: "Search Results",
        type: "geojson",
        url: geoJsonUrl,
        cluster: true,
      },
    ];
  }, [geoJsonUrl]);

  const [mousePos, setMousePos] = useState(undefined);
  const [selectedElem, setSelectedElem] = useState(undefined);
  const [selectedDetails, setSelectedDetails] = useState(undefined);
  const [selectHold, setSelectHold] = useState(false);
  useEffect(() => {
    if (selectedElem == undefined) {
      setSelectedDetails(undefined);
      return;
    }
    fetchDetail(selectedElem.properties.id).then((d) => {
      if (!d) {
        setSelectedDetails(undefined);
        return;
      }
      let position;
      switch (selectedElem.layer.type) {
        case "circle":
          position = /POINT +\((-?\d+\.\d+) +(-?\d+\.\d+)\)/g
            .exec(d.the_geom)
            ?.map((i) => parseFloat(i))
            ?.slice(1);
          if (position == undefined) {
            console.log(d.the_geom);
          }
          break;
        case "line":
          position = undefined;
          break;
      }
      setSelectedDetails({ detail: d, position });
    });
  }, [selectedElem?.properties?.id]);

  const tooltip = (() => {
    if (!selectedDetails || !selectedElem) return null;
    let [lng, lat] = selectedDetails.position ?? mousePos;
    while (lng - mousePos[0] > +180) {
      lng -= 360.0;
    }
    while (lng - mousePos[0] < -180) {
      lng += 360.0;
    }
    return (
      <Popup
        latitude={lat}
        longitude={lng}
        dynamicPosition={true}
        closeButton={false}
        className="w-25"
      >
        {selectedDetails.detail.name}
      </Popup>
    );
  })();

  const detail = (() => {
    if (!selectedDetails || !selectedElem) return undefined;
    return <Result result={selectedDetails.detail} />;
  })();

  const get_region_bounds = () => {
    const bounds = regionBoundsMap[region.replaceAll(" ", "_")];
    if (bounds) return bounds;
    else return DEFAULT_QUERY_BOUNDS;
  };

  const initial_bounds = () => {
    const bounds = regionMap[region.replaceAll(" ", "_")];
    if (bounds) return bounds;
    else return INITIAL_BOUNDS;
  };

  const maybe_set_selected_element = (eltList) => {
    const { zoom = 0 } = viewport;
    if (!eltList || !eltList.length) {
      return undefined;
    }
    if (zoom < 3) {
      return undefined;
    }
    // // one hit
    // if (eltList.length == 1) {
    //     setSelectedElem(eltList[0]);
    //     return eltList[0];
    // }
    // Priority to points, maybe there's a better option, but choose one of 3
    const points = eltList.filter((e) => e.layer.type == "circle");
    if (points.length) {
      if (points.length < 3) {
        const elem = points.pop();
        setSelectedElem(elem);
        return elem;
      }
      return undefined;
    }
    if (zoom > 3 && eltList && eltList.length < 100) {
      const elements = eltList.sort(
        (a, b) => a.properties.geom_length - b.properties.geom_length
      );
      const elem = elements[0];
      setSelectedElem(elem);
      return elem;
    }
    return undefined;
  };

  const { zoom = 0 } = viewport;

  return (
    <>
      <Search />
      <Divider
        sx={{
          marginTop: 2,
          marginBottom: 2,
          display: { xs: "none", lg: "block" },
        }}
      />
      <Container maxWidth="lg" sx={{ marginBottom: { xs: 5, lg: 0 } }}>
        <Grid container mt={{ xs: 4, lg: 0 }}>
          <Grid item lg={3} display={{ xs: "none", lg: "block" }}>
            <Accordion
              defaultExpanded
              sx={{ width: "17.5rem", flexShrink: 0 }}
              elevation={0}
            >
              <AccordionSummary
                expandIcon={<ViewSidebarOutlinedIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Filter by</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FilterBy
                  counts={counts}
                  tabList={tabs}
                  searchType={searchType}
                  resetDefaultSearchUrl={resetDefaultSearchUrl}
                  clearFacetQuery={clearFacetQuery}
                  facetSearch={facetSearch}
                  facetValues={facetValues}
                  setFacetFacetValues={setFacetFacetValues}
                  facets={facets}
                  isMobile={false}
                />
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid
            item
            xs={12}
            display={{ xs: "flex", lg: "none" }}
            justifyContent={"space-between"}
            gap={2}
          >
            <Box>
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                sx={{
                  color: "#7B8FB7",
                  backgroundColor: "#F6F8FA",
                  "&.MuiButton-outlined": {
                    borderColor: "#BDC7DB",
                  },
                }}
                endIcon={
                  <Chip
                    size="small"
                    sx={{
                      maxWidth: "40px",
                      maxHeight: "20px",
                      ".MuiChip-label": {
                        fontSize: "12px",
                      },
                    }}
                    label={"42K"}
                  />
                }
              >
                Documents
              </Button>
            </Box>
            <Box display={"flex"} alignItems={"center"} gap={1}>
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={() => setOpenDialog(true)}
                sx={{
                  color: "#7B8FB7",
                  "&.MuiButton-outlined": {
                    borderColor: "#BDC7DB",
                  },
                }}
              >
                Filter
              </Button>
              <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle
                  id="alert-dialog-title"
                  sx={{ paddingRight: "10px" }}
                >
                  <Box display="flex" alignItems="center">
                    <Box flexGrow={1}>Filter by</Box>
                    <Box>
                      <IconButton onClick={() => setOpenDialog(false)}>
                        <ClearIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </DialogTitle>
                <DialogContent>
                  <FilterBy
                    counts={counts}
                    tabList={tabs}
                    searchType={searchType}
                    resetDefaultSearchUrl={resetDefaultSearchUrl}
                    clearFacetQuery={clearFacetQuery}
                    facetSearch={facetSearch}
                    facetValues={facetValues}
                    setFacetFacetValues={setFacetFacetValues}
                    facets={facets}
                    isMobile={true}
                  />
                </DialogContent>
                {/* 
                <DialogActions>
                  <Button onClick={handleClose}>Disagree</Button>
                  <Button onClick={handleClose} autoFocus>
                    Agree
                  </Button>
                </DialogActions> */}
              </Dialog>
              <IconButton
                aria-label="delete"
                sx={{
                  border: 1,
                  borderColor: "#BDC7DB",
                  borderRadius: 1,
                  maxHeight: "36px",
                }}
              >
                <FilterListIcon />
              </IconButton>
            </Box>
          </Grid>
          <Grid item lg={9} xs={12} columnSpacing={2}>
            <Stack spacing={2}>
              <Box
                display={{ xs: "none", lg: "flex" }}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography variant="subtitle2" sx={{ color: "#7B8FB7" }}>
                  <b>{resultCount || 0}</b>{" "}
                  {translationState.translation["Total results found"]}{" "}
                </Typography>
                <Box>
                  <Select
                    defaultValue={"Recently updated"}
                    startAdornment={
                      <InputAdornment position="start">
                        <Typography
                          variant="subtitle2"
                          sx={{ color: "#7B8FB7" }}
                        >
                          Sort by:
                        </Typography>
                      </InputAdornment>
                    }
                    fullWidth
                    sx={{
                      backgroundColor: "#FFFFFF",
                      color: "black",
                      fontWeight: 600,
                      fontSize: "12px",
                      borderRadius: 0,
                      height: "35px",
                    }}
                  >
                    <MenuItem value="Recently updated">
                      Recently updated
                    </MenuItem>
                  </Select>
                </Box>
              </Box>
              {results.map((result) => (
                <ResultValue result={result} key={result["id"]} />
              ))}
            </Stack>
            <Button
              variant="outlined"
              disableElevation
              sx={{
                display: { xs: "block", lg: "none" },
                borderRadius: 1,
                fontWeight: 700,
                textTransform: "none",
                color: "#1A2C54",
              }}
            >
              Show more
            </Button>
            <Pagination
              searchType={searchType}
              resultCount={resultCount}
              setPage={setPage}
              page={page}
            />
          </Grid>
        </Grid>
      </Container>
      {/* <div id="result-container">
        <div>
          <ResultTabs
            counts={counts}
            tabList={tabs}
            searchType={searchType}
            resetDefaultSearchUrl={resetDefaultSearchUrl}
            clearFacetQuery={clearFacetQuery}
          />
          <div id="result-section">
            <div>
              {facets.length > 0 && (
                <FacetsFullWidth
                  facets={facets}
                  clearFacetQuery={clearFacetQuery}
                  facetSearch={facetSearch}
                  facetValues={facetValues}
                  setFacetFacetValues={setFacetFacetValues}
                />
              )}
            </div>

            <div className="row mx-auto">
              <div className="col-12 container mb-3">
                <h6 className="primary-color text-start text-light ps-5 pt-3">
                  {" "}
                  {translationState.translation["Total results found"]}{" "}
                  {resultCount || 0}
                </h6>
              </div>
              <div>
                <div style={{ minHeight: "500px" }}>
                  {showMap && (
                    <div className="">
                      <div className="row">
                        <div className="container col-6">
                          <ReMap
                            externalLayers={layers}
                            bounds={initial_bounds()}
                            handleBoundsChange={updateMapBounds}
                            layersState={[true]}
                            onHover={(e) => {
                              if (!selectHold) {
                                maybe_set_selected_element(e.features);
                                setMousePos(e.lngLat);
                              }
                            }}
                            onClick={(e) => {
                              if (selectHold) {
                                setMousePos(e.lngLat);
                                const selected = maybe_set_selected_element(
                                  e.features
                                );
                                setSelectHold(Boolean(selected));
                              } else if (selectedElem) {
                                setSelectHold(true);
                              }
                            }}
                            popup={tooltip}
                            selectedId={selectedElem?.properties?.id}
                          />
                          <div>
                            {translationState.translation["Note"]} <br />
                            {translationState.translation["Note2"]} <br />
                            <span>
                              {zoom <= 3 &&
                                translationState.translation["Zoom"]}
                            </span>
                            <br />
                          </div>
                        </div>
                        <div className="container col-3">{detail}</div>
                      </div>

                      <hr />
                    </div>
                  )}
                  <div className="container">
                    <ResultList results={results} />
                    <Pagination
                      searchType={searchType}
                      resultCount={resultCount}
                      setPage={setPage}
                      page={page}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
}

const ResultList = ({ results }) =>
  results.map((result) => {
    return <Result result={result} key={result["id"]} />;
  });

const Result = ({ result }) => {
  var url =
    result["type"] === "Person" || result["type"] === "Organization"
      ? resolveAsUrl(result["id"])
      : result["txt_url"] || resolveAsUrl(result["id"]);
  const { Component } = typeMap[result["type"]];
  const [truncate, setTruncate] = useState(true);
  const jsonLdParams = new URLSearchParams({ id: result["id"] }).toString();
  const sendGoogleEvent = () => {
    gtag("config", "G-MQDK6BB0YQ");
    gtag("event", "click_on_result", {
      oih_result_target: url,
    });

    /*
        //GA4 debug code
        const measurement_id = `G-MQDK6BB0YQ`;
        const api_secret = `dtIVKr8XQHSKJ0FrI4EkDQ`;

        fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${measurement_id}&api_secret=${api_secret}`, {
            method: "POST",
            body: JSON.stringify({
                client_id: 'arno.clientId',
                events: [
                    {
                        name: 'click_on_result_fetch',
                        params: {
                            'target': url
                        },
                    }
                ]
            })
        });

         */
  };

  return (
    <div
      key={result["id"]}
      className="result-item container rounded-3 p-3 mb-2"
      id="resultsDiv"
    >
      <h4 className="text-start mb-3">
        {/*
           <a href={result['type'] === 'Person' || result['type'] === 'Organization' ? resolveAsUrl(result['id']) :
                    result['txt_url'] || resolveAsUrl(result['id'])}
              className="result-title" target="_blank">
             {result['name']}
           </a>
           */}
        <a
          href={url}
          className="result-title"
          target="_blank"
          onClick={sendGoogleEvent}
        >
          {result["name"]}
        </a>
      </h4>
      <Row className="">
        <div className="col">
          <Component result={result} />
          {"description" in result && result["type"] !== "Person" && (
            <div className="col">
              <p
                className={`result-p ${truncate ? "description-truncate" : ""}`}
                onClick={() => setTruncate(!truncate)}
              >
                <b>Description:</b> {result["description"]}
              </p>
            </div>
          )}
        </div>
      </Row>
      <a
        href={`${dataServiceUrl}/source?${jsonLdParams}`}
        target="_blank"
        rel="noreferrer noopener"
        className="text-align-start float-start text-decoration-none"
        style={{ fontSize: "x-small" }}
      >
        View JSONLD source
      </a>
    </div>
  );
};
