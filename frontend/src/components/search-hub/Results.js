/* global URLSearchParams */

import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import {
  fieldTitleFromName,
  searchAdvanced,
  useSearchParam,
} from "utilities/generalUtility";
import { dataServiceUrl } from "../../config/environment";
import { CATEGORIES, ITEMS_PER_PAGE } from "../../portability/configuration";
import Pagination from "./Pagination";
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
import ResultValue from "./ResultValue";
import { cutWithDots } from "components/results/ResultDetails";
import Support from "./Support";
import Chip from "@mui/material/Chip";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Fade from "@mui/material/Fade";
import CircularProgress from "@mui/material/CircularProgress";
import { trackingMatomo } from "utilities/trackingUtility";

export default function Results() {
  const [results, setResults] = useState([]);
  const [resultCount, setResultCount] = useState(0);
  const [counts, setCounts] = useState({});
  const [facets, setFacets] = useState([]);
  const [params] = useSearchParams();

  const [showMorePages, setShowMorePages] = useState(0);
  const [mobileAppliedFilters, setMobileAppliedFilters] = useState([]);
  const [currentURI, setCurrentURI] = useState("");
  const [queryString, setQueryString] = useState("");
  const location = useLocation();
  const [onlyVerified, setOnlyVerified] = useState(false);

  const navigate = useNavigate();
  const { searchType = "CreativeWork" } = useParams();
  const [searchText, setSearchText] = useSearchParam("search_text", "");
  const [region, setRegion] = useSearchParam("region", "global");
  const [facetQuery, setFacetQuery] = useSearchParam("fq");
  /* const [fq, setFq] = useSearchParam("fq"); */
  const [sort, setSort] = useSearchParam("sort");
  const [page, setPage] = useSearchParam("page", 0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchEnd, setIsSearchEnd] = useState(false);
  const [previousParams, setPreviousParams] = useState({
    sort: "",
    facets: "",
    page: "",
    oldTypeOfSearch: "simple",
    region: "global",
  });

  const [openDialog, setOpenDialog] = useState(false);
  const translationState = useAppTranslation();

  let counterResult = 0;

  useEffect(() => {
    const category = CATEGORIES.find((category) => category.id === searchType);

    setMobileAppliedFilters([{ type: "searchType", text: category.text }]);
  }, []);

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

  const getDefaultFacets = useCallback(
    (searchType) => {
      let URI = `${dataServiceUrl}/search?`;
      const params = new URLSearchParams({
        document_type: searchType,
        start: page * (ITEMS_PER_PAGE + showMorePages),
        rows: ITEMS_PER_PAGE + showMorePages,
      });

      if (region.toUpperCase() !== "GLOBAL") {
        params.append("region", region);
      }

      URI += [params.toString()].filter((e) => e).join("&");

      fetch(URI)
        .then((response) => response.json())
        .then((json) => {
          setFacets(json.facets.filter((facet) => facet.counts.length > 0));
        });
    },
    [page, region, showMorePages]
  );

  useEffect(() => {
    getDefaultFacets(searchType);
  }, [searchType, getDefaultFacets]);

  useEffect(() => {
    console.log(
      searchText,
      searchType,
      facetQuery,
      region,
      page,
      showMorePages,
      sort
    );
    setIsLoading(true);
    let URI = `${dataServiceUrl}/search?`;
    const params = new URLSearchParams({
      document_type: searchType,
      start: page * (ITEMS_PER_PAGE + showMorePages),
      rows: ITEMS_PER_PAGE + showMorePages,
    });

    if (region.toUpperCase() !== "GLOBAL") {
      params.append("region", region);
    }

    if (searchText !== "") {
      params.append("search_text", searchText);
    }

    URI += [
      params.toString(),
      facetQuery ? "fq=" + facetQuery : "",
      sort ? "sort=" + sort : "",
    ]
      .filter((e) => e)
      .join("&");

    setCurrentURI(URI);
    let string = "";
    string += [
      params.toString(),
      facetQuery ? "fq=" + facetQuery : "",
      sort ? "sort=" + sort : "",
    ]
      .filter((e) => e)
      .join("&");
    setQueryString(string);

    fetch(URI)
      .then((response) => response.json())
      .then((json) => {
        setResults(json.docs);
        const count = json.count;
        setResultCount(count);
        setCounts((prev) => ({ ...prev, [searchType]: count }));
        setIsLoading(false);
        setIsSearchEnd(true);
      });
  }, [searchText, searchType, facetQuery, region, page, showMorePages, sort]);

  const manageMatomoEvent = useCallback(() => {
    if (results.length > 0 && !isLoading) {
      const url = window.location.toString();
      let matomoParams = `${checkVariable(searchText)}|${checkVariable(
        region
      )}|`;
      const oldUrl = localStorage.getItem("oldUrl");
      if (oldUrl && oldUrl === url) {
        //refresh event
        trackingMatomo("page_refresh", "misc", url);
      } else {
        localStorage.setItem("oldUrl", url);
        const searchParams = new URLSearchParams(location.search);
        const isExternalLink = searchParams.get("externalLink");
        if (isExternalLink === "true") {
          searchParams.delete("externalLink");
          const newUrl = `${location.pathname}?${searchParams.toString()}${
            location.hash
          }`;

          window.history.replaceState(null, "", newUrl);

          //referrer event
          matomoParams += `${checkVariable(facetQuery)}`;
          trackingMatomo("landing_on_results", "search", matomoParams);
        } else {
          const lastOperationUser = localStorage.getItem("lastOperationUser");
          const isFromAdvancedSearch =
            searchParams.get("advancedSearch") === "true";
          if (isFromAdvancedSearch) {
            searchParams.delete("advancedSearch");
            const newUrl = `${location.pathname}?${searchParams.toString()}${
              location.hash
            }`;

            window.history.replaceState(null, "", newUrl);
          }

          switch (lastOperationUser) {
            case "simpleSearch":
              trackingMatomo("simple_search", "search", matomoParams);
              break;
            case "topic":
              trackingMatomo("search_by_topic", "search", searchType);
              break;
            case "sort":
              matomoParams += `${checkVariable(
                previousParams.oldTypeOfSearch
              )}|${checkVariable(previousParams.sort)}|${checkVariable(
                sort
              )}|${checkVariable(facetQuery)}`;
              trackingMatomo("sorted_search", "search", matomoParams);
              break;
            case "advancedSearch":
              matomoParams += `${checkVariable(facetQuery)}`;
              trackingMatomo("advanced_search", "search", matomoParams);
              break;
            case "changePage":
              matomoParams += `${checkVariable(
                previousParams.oldTypeOfSearch
              )}|${checkVariable(previousParams.page)}|${checkVariable(
                page
              )}|${checkVariable(facetQuery)}`;
              trackingMatomo(
                "change_result_page",
                "search",
                searchText,
                region
              );
              break;
            case "refinedSearch":
              matomoParams += `${checkVariable(
                previousParams.oldTypeOfSearch
              )}|${checkVariable(previousParams.facets)}|${checkVariable(
                facetQuery
              )}`;
              trackingMatomo("refined_search", "search", matomoParams);
              break;
            case "region":
              matomoParams = `${previousParams.region}|${region}`;
              trackingMatomo("change_region", "search", matomoParams);
              break;
            default:
              break;
          }

          if (isFromAdvancedSearch) {
            setPreviousParams({
              ...previousParams,
              oldTypeOfSearch: "advanced",
            });
          } else if (!facetQuery) {
            setPreviousParams({
              ...previousParams,
              oldTypeOfSearch: "simple",
            });
          } else {
            setPreviousParams({
              ...previousParams,
              oldTypeOfSearch: "refined",
            });
          }
        }
      }
    }
  }, [
    previousParams,
    facetQuery,
    region,
    searchText,
    page,
    sort,
    location.hash,
    location.pathname,
    location.search,
    searchType,
    results,
    isLoading,
  ]);

  const checkVariable = (value) => {
    if (!value || value === "") return "(none)";

    return value;
  };
  useEffect(() => {
    if (results.length > 0 && isSearchEnd) {
      manageMatomoEvent();
      setIsSearchEnd(false);
    }
  }, [results, isSearchEnd, manageMatomoEvent]);

  const facetSearch = (name, value, checked) => {
    let facet = name + ":" + '"' + value + '"';
    let isKeyContained = false;
    let queryResult = "";

    if (checked) {
      if (facetQuery) {
        const pairs = facetQuery.split(" AND ");
        pairs.forEach((p) => {
          if (p.includes(name)) {
            isKeyContained = true;
            let temp =
              "(" +
              [p.replace(/^\(|\)$/g, ""), facet].filter((e) => e).join(" OR ") +
              ")";
            queryResult = [queryResult, temp].filter((e) => e).join(" AND ");
          } else {
            queryResult = [queryResult, p].filter((e) => e).join(" AND ");
          }
        });
        if (!isKeyContained)
          queryResult = [queryResult, "(" + facet + ")"]
            .filter((e) => e)
            .join(" AND ");
      } else {
        queryResult =
          "(" + [queryResult, facet].filter((e) => e).join(" OR ") + ")";
      }
    } else {
      const pairs = facetQuery.split(" AND ");
      pairs.forEach((p) => {
        if (p.includes(name)) {
          const temp = p
            .replace(/^\(|\)$/g, "")
            .split(" OR ")
            .filter((f) => f !== facet)
            .join(" OR ");

          queryResult = [queryResult, temp === "" ? temp : "(" + temp + ")"]
            .filter((e) => e)
            .join(" AND ");
        } else {
          queryResult = [queryResult, p].filter((e) => e).join(" AND ");
        }
      });
    }
    setPreviousParams({ ...previousParams, facets: facetQuery });
    setFacetQuery(queryResult);
    localStorage.setItem("lastOperationUser", "refinedSearch");
  };

  const facetSearchMobile = (query) => {
    setPreviousParams({ ...previousParams, facets: facetQuery });
    setFacetQuery(query);
    localStorage.setItem("lastOperationUser", "refinedSearch");
  };

  const resetDefaultSearchUrl = useCallback(
    (type) => {
      navigate(
        `/results/${type}?${new URLSearchParams({
          ...(searchText ? { search_text: searchText } : {}),
          ...(sort ? { sort: sort } : {}),
          ...(region.toUpperCase() !== "GLOBAL" ? { region } : {}),
        })}`
      );
    },
    [navigate, region, searchText, sort]
  );

  const clearFacetQuery = useCallback(() => {
    resetDefaultSearchUrl(searchType);
  }, [resetDefaultSearchUrl, searchType]);

  const clear = useCallback(
    (e) => {
      clearFacetQuery();
    },
    [clearFacetQuery]
  );

  const paletteFilter = "custom.resultPage.filters.";

  return (
    <>
      <Search
        uri={currentURI}
        searchType={searchType}
        resultCount={resultCount}
        facets={facets}
        setPreviousParams={setPreviousParams}
      />
      <Divider
        sx={{
          marginTop: 2,
          marginBottom: 2,
          display: { xs: "none", lg: "block" },
        }}
      />
      <Container maxWidth="lg" sx={{ marginBottom: { xs: 5, lg: 0 } }}>
        <Support />
        <Grid container mt={{ xs: 4, lg: 0 }} gap={{ xs: 1, lg: 0 }}>
          <Grid item lg={3} display={{ xs: "none", lg: "block" }}>
            <Fade
              in={facets.length >= 0}
              timeout={1000}
              mountOnEnter
              unmountOnExit
            >
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
                  sx={{ paddingLeft: 0 }}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography
                    sx={{
                      color: paletteFilter + "textFilter",
                      fontWeight: 700,
                    }}
                  >
                    {translationState.translation["Filter by"]}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ paddingLeft: 0 }}>
                  <FilterBy
                    setMobileAppliedFilters={setMobileAppliedFilters}
                    mobileAppliedFilters={mobileAppliedFilters}
                    counts={counts}
                    tabList={CATEGORIES}
                    searchType={searchType}
                    resetDefaultSearchUrl={resetDefaultSearchUrl}
                    clearFacetQuery={clearFacetQuery}
                    facetSearch={facetSearch}
                    facets={facets}
                    facetQuery={facetQuery}
                    clear={clear}
                    facetSearchMobile={facetSearchMobile}
                  />
                </AccordionDetails>
              </Accordion>
            </Fade>
          </Grid>
          <Grid
            item
            xs={12}
            display={{ xs: "flex", lg: "none" }}
            justifyContent={"space-between"}
            gap={2}
          >
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
                    setMobileAppliedFilters={setMobileAppliedFilters}
                    mobileAppliedFilters={mobileAppliedFilters}
                    counts={counts}
                    tabList={CATEGORIES}
                    searchType={searchType}
                    resetDefaultSearchUrl={resetDefaultSearchUrl}
                    clearFacetQuery={clearFacetQuery}
                    facetSearch={facetSearch}
                    facets={facets}
                    facetQuery={facetQuery}
                    facetSearchMobile={facetSearchMobile}
                  />
                </DialogContent>
              </Dialog>
            </Box>
            <Box display="flex" sx={{ gap: 2 }}>
              <Chip
                avatar={<CheckCircleOutlineIcon sx={{ color: "#1A2C54" }} />}
                label="Verified"
                variant="outlined"
                onClick={() => setOnlyVerified(!onlyVerified)}
                sx={{
                  borderRadius: "8px",
                  color: "#1A2C54",
                  height: "35px",
                  ".MuiChip-avatar": {
                    color: "#1A2C54",
                  },
                  backgroundColor: onlyVerified && "#DEE2ED",
                }}
              />
              <Select
                defaultValue={sort ? sort : "indexed_ts desc"}
                startAdornment={
                  <InputAdornment position="start">
                    <Typography
                      variant="subtitle2"
                      sx={{ color: paletteFilter + "categoryColor" }}
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
                  borderRadius: 2,
                  height: "35px",
                  width: { xs: "135px", md: "unset" },
                }}
                onChange={(e) => {
                  setPreviousParams({ ...previousParams, sort: sort });
                  setSort(e.target.value);
                  localStorage.setItem("lastOperationUser", "sort");
                }}
              >
                <MenuItem value="indexed_ts desc">
                  {translationState.translation["Recently updated"]}
                </MenuItem>
                <MenuItem value="indexed_ts asc">Last updated</MenuItem>

                {facets.map((f) => {
                  const title = fieldTitleFromName(f.name);
                  return [
                    <MenuItem key={`${f.name}-asc`} value={`${f.name} asc`}>
                      {title} ↑
                    </MenuItem>,
                    <MenuItem key={`${f.name}-desc`} value={`${f.name} desc`}>
                      {title} ↓
                    </MenuItem>,
                  ];
                })}
              </Select>
            </Box>
          </Grid>
          <Box
            sx={{
              display: { xs: "flex", lg: "none" },
              overflowX: "auto",
              gap: 1,
            }}
          >
            {mobileAppliedFilters.map((item, index) => {
              return (
                <Button
                  key={index}
                  variant="outlined"
                  startIcon={item.type === "searchType" ? <></> : <ClearIcon />}
                  disabled={item.type === "searchType" ? true : false}
                  sx={{
                    color: paletteFilter + "categoryColor",
                    backgroundColor: paletteFilter + "categorySelectedBgColor",
                    "&.MuiButton-outlined": {
                      borderColor: paletteFilter + "borderColorFilterMobile",
                    },
                    flex: "0 0 auto",
                    minWidth: 0,
                  }}
                  onClick={() => {
                    clear();
                    setMobileAppliedFilters((f) =>
                      f.filter(
                        (d) => d.type !== item.type && d.text !== item.text
                      )
                    );
                  }}
                >
                  {translationState.translation[item.text] ||
                    cutWithDots(item.text, 10)}
                </Button>
              );
            })}
          </Box>
          {isLoading ? (
            <Grid item lg={9} xs={12}>
              <CircularProgress sx={{ display: "flex", margin: "0 auto" }} />
            </Grid>
          ) : (
            <Grid item lg={9} xs={12}>
              <Fade
                in={results.length >= 0}
                timeout={1000}
                mountOnEnter
                unmountOnExit
              >
                <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
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
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Chip
                          avatar={
                            <CheckCircleOutlineIcon sx={{ color: "#1A2C54" }} />
                          }
                          label="Verified"
                          onClick={() => setOnlyVerified(!onlyVerified)}
                          variant="outlined"
                          disabled={results.length === 0}
                          sx={{
                            borderRadius: "8px",
                            color: "#1A2C54",
                            height: "35px",
                            ".MuiChip-avatar": {
                              color: "#1A2C54",
                            },
                            backgroundColor: onlyVerified && "#DEE2ED",
                          }}
                        />
                        <Select
                          defaultValue={sort ? sort : "indexed_ts desc"}
                          disabled={results.length === 0}
                          startAdornment={
                            <InputAdornment position="start">
                              <Typography
                                variant="subtitle2"
                                sx={{ color: paletteFilter + "categoryColor" }}
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
                            borderRadius: 2,
                            height: "35px",
                          }}
                          onChange={(e) => {
                            setPreviousParams({
                              ...previousParams,
                              sort: sort,
                            });
                            setSort(e.target.value);
                            localStorage.setItem("lastOperationUser", "sort");
                          }}
                        >
                          <MenuItem value="indexed_ts desc">
                            {translationState.translation["Recently updated"]}
                          </MenuItem>
                          <MenuItem value="indexed_ts asc">
                            Last updated
                          </MenuItem>

                          {facets.map((f) => {
                            const title = fieldTitleFromName(f.name);
                            return [
                              <MenuItem
                                key={`${f.name}-asc`}
                                value={`${f.name} asc`}
                              >
                                {title} ↑
                              </MenuItem>,
                              <MenuItem
                                key={`${f.name}-desc`}
                                value={`${f.name} desc`}
                              >
                                {title} ↓
                              </MenuItem>,
                            ];
                          })}
                        </Select>
                      </Box>
                    </Box>
                    {results.map((result) => {
                      counterResult =
                        counterResult > 10 ? 1 : counterResult + 1;
                      return (
                        <ResultValue
                          totalPageNumber={Math.ceil(
                            resultCount / (ITEMS_PER_PAGE + showMorePages)
                          )}
                          counterResult={counterResult}
                          page={page}
                          queryString={queryString}
                          result={result}
                          completeValue={100}
                          key={result["id"]}
                          onlyVerified={onlyVerified}
                        />
                      );
                    })}
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
                    setPreviousParams={setPreviousParams}
                  />
                </Box>
              </Fade>
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
}
