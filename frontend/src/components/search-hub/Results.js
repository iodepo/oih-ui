/* global URLSearchParams */

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSearchParam } from "utilities/generalUtility";
import { dataServiceUrl } from "../../config/environment";
import { CATEGORIES } from "../../portability/configuration";
import { regionMap, INITIAL_BOUNDS } from "../../constants";
import { boundsToQuery, regionBoundsMap } from "utilities/mapUtility";
import throttle from "lodash/throttle";
import Pagination, { ITEMS_PER_PAGE } from "./Pagination";
import { Popup } from "react-map-gl";
import { useAppTranslation } from "context/context/AppTranslation";
import Search from "components/search/Search";
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
import Stack from "@mui/material/Stack";
import FilterBy from "./FilterBy";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import {
  expandMapBounds,
  containsMapBounds,
  mapboxBounds_toQuery,
} from "utilities/mapUtility";
import ResultValue from "./ResultValue";
import { cutWithDots } from "components/results/ResultDetails";

const fetchDetail = (id) =>
  fetch(`${dataServiceUrl}/detail?id=${id}`).then((r) => r.json());

export default function Results() {
  const [results, setResults] = useState([]);
  const [resultCount, setResultCount] = useState(0);
  const [counts, setCounts] = useState({});
  const [facets, setFacets] = useState([]);
  const [mapBounds, setMapBounds] = useState(false);
  const [showMorePages, setShowMorePages] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth >= 768);
  const [filterChosenMobile, setFilterChosenMobile] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [currentURI, setCurrentURI] = useState("");

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
    const category = CATEGORIES.find((category) => category.id === searchType);

    setFilterChosenMobile([{ type: "searchType", text: category.text }]);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth >= 768;

      if (isMobile !== newIsMobile) {
        setShowMorePages(0);
      }

      setIsMobile(newIsMobile);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

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
        rows: ITEMS_PER_PAGE + showMorePages,
        start: page * (ITEMS_PER_PAGE + showMorePages),
      });
      if (searchText !== "") {
        params.append("search_text", searchText);
      }
      if (region && region.toUpperCase() !== "GLOBAL") {
        params.append("region", region);
      }
      URI += [params.toString(), facetQuery].filter((e) => e).join("&");
      setCurrentURI(URI);

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
      let URI = `${dataServiceUrl}/search?`;
      const params = new URLSearchParams({
        document_type: searchType,
        start: page * (ITEMS_PER_PAGE + showMorePages),
        rows: ITEMS_PER_PAGE + showMorePages,
      });
      if (searchText !== "") {
        params.append("search_text", searchText);
      }
      if (region.toUpperCase() !== "GLOBAL") {
        params.append("region", region);
      }
      URI += [params.toString(), facetQuery].filter((e) => e).join("&");
      setCurrentURI(URI);

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
  }, [
    searchText,
    searchType,
    facetQuery,
    showMap,
    mapBounds,
    region,
    page,
    showMorePages,
  ]);

  const facetSearch = (name, value) => {
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

  const get_region_bounds = () => {
    const bounds = regionBoundsMap[region.replaceAll(" ", "_")];
    if (bounds) return bounds;
    else return boundsToQuery(INITIAL_BOUNDS);
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

  const setValue = (i, value) =>
    setFacetFacetValues((values) => [
      ...values.slice(0, i),
      value,
      ...values.slice(i + 1, values.length),
    ]);

  const clear = useCallback(
    (e) => {
      setFacetFacetValues(new Array(facets.length).fill(""));
      clearFacetQuery();
    },
    [clearFacetQuery, setValue]
  );

  const { zoom = 0 } = viewport;
  const paletteFilter = "custom.resultPage.filters.";
  return (
    <>
      <Search
        uri={currentURI}
        searchType={searchType}
        resultCount={resultCount}
        facets={facets}
      />
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
                expandIcon={
                  <ViewSidebarOutlinedIcon
                    sx={{ color: paletteFilter + "textFilter" }}
                  />
                }
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography
                  sx={{ color: paletteFilter + "textFilter", fontWeight: 700 }}
                >
                  {translationState.translation["Filter by"]}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FilterBy
                  selectedProvider={selectedProvider}
                  setSelectedProvider={setSelectedProvider}
                  setFilterChosenMobile={setFilterChosenMobile}
                  filterChosenMobile={filterChosenMobile}
                  counts={counts}
                  tabList={CATEGORIES}
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
              {filterChosenMobile.map((item, index) => {
                return (
                  <Button
                    key={index}
                    variant="outlined"
                    startIcon={
                      item.type === "searchType" ? <></> : <ClearIcon />
                    }
                    disabled={item.type === "searchType" ? true : false}
                    sx={{
                      color: paletteFilter + "categoryColor",
                      backgroundColor:
                        paletteFilter + "categorySelectedBgColor",
                      marginRight: 1,
                      marginBottom: filterChosenMobile.length > 1 ? 1 : 0,
                      "&.MuiButton-outlined": {
                        borderColor: paletteFilter + "borderColorFilterMobile",
                      },
                    }}
                    onClick={() => {
                      if (item.type === "provider") setSelectedProvider("");
                      clear();
                      setFilterChosenMobile((f) =>
                        f.filter((d) => d.type !== item.type)
                      );
                    }}
                    /* endIcon={
                      <Chip
                        size="small"
                        sx={{
                          maxWidth: "40px",
                          maxHeight: "20px",
                          ".MuiChip-label": {
                            overflow: "visible",
                            fontSize: "9px",
                          },
                        }}
                        label={item.count}
                      />
                    } */
                  >
                    {translationState.translation[item.text] ||
                      cutWithDots(item.text, 10)}
                  </Button>
                );
              })}
            </Box>
            <Box display={"flex"} alignItems={"center"} gap={1}>
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={() => setOpenDialog(true)}
                sx={{
                  color: paletteFilter + "categoryColor",
                  "&.MuiButton-outlined": {
                    borderColor: paletteFilter + "borderColorFilterMobile",
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
                    <Box
                      flexGrow={1}
                      sx={{ color: paletteFilter + "textFilter" }}
                    >
                      {translationState.translation["Filter by"]}
                    </Box>
                    <Box>
                      <IconButton onClick={() => setOpenDialog(false)}>
                        <ClearIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </DialogTitle>
                <DialogContent>
                  <FilterBy
                    selectedProvider={selectedProvider}
                    setSelectedProvider={setSelectedProvider}
                    setFilterChosenMobile={setFilterChosenMobile}
                    filterChosenMobile={filterChosenMobile}
                    counts={counts}
                    tabList={CATEGORIES}
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
                aria-label="filterListIcon"
                sx={{
                  border: 1,
                  borderColor: paletteFilter + "borderColorFilterMobile",
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
                <Typography
                  variant="subtitle2"
                  sx={{ color: paletteFilter + "categoryColor" }}
                >
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
                          {translationState.translation["Sort by"]}:
                        </Typography>
                      </InputAdornment>
                    }
                    fullWidth
                    sx={{
                      color: "black",
                      fontWeight: 600,
                      fontSize: "12px",
                      borderRadius: 0,
                      height: "35px",
                    }}
                  >
                    <MenuItem value="Recently updated">
                      {translationState.translation["Recently updated"]}
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
                color: "black",
                width: "100%",
                marginTop: 2,
              }}
              onClick={() => setShowMorePages((prev) => prev + 5)}
            >
              Show more
            </Button>
            <Pagination
              showMorePages={showMorePages}
              searchType={searchType}
              resultCount={resultCount}
              setPage={setPage}
              page={page}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
