/* global URLSearchParams */

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  fieldTitleFromName,
  searchAdvanced,
  useSearchParam,
} from "utilities/generalUtility";
import { dataServiceUrl } from "../../config/environment";
import {
  CATEGORIES,
  ITEMS_PER_PAGE,
  idFacets,
} from "../../portability/configuration";
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

export default function Results() {
  const [results, setResults] = useState([]);
  const [resultCount, setResultCount] = useState(0);
  const [counts, setCounts] = useState({});
  const [facets, setFacets] = useState([]);
  const [params] = useSearchParams();

  const [showMorePages, setShowMorePages] = useState(0);
  const [filterChosenMobile, setFilterChosenMobile] = useState([]);
  const [currentURI, setCurrentURI] = useState("");

  const [onlyVerified, setOnlyVerified] = useState(false);

  const navigate = useNavigate();
  const { searchType = "CreativeWork" } = useParams();
  const [searchText, setSearchText] = useSearchParam("search_text", "");
  const [region, setRegion] = useSearchParam("region", "global");
  const [facetQuery, setFacetQuery] = useSearchParam("facet_query");
  const [fq, setFq] = useSearchParam("fq");
  const [sort, setSort] = useSearchParam("sort");
  const [page, setPage] = useSearchParam("page", 0);
  const [isLoading, setIsLoading] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const translationState = useAppTranslation();

  useEffect(() => {
    const category = CATEGORIES.find((category) => category.id === searchType);

    setFilterChosenMobile([{ type: "searchType", text: category.text }]);
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

  useEffect(
    () => {
      /*  if (showMap) {
      mapSearch(mapBounds, page);
    } else { */
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
      debugger;
      const facetQueryAdvanced = destructuringSearchTextAdvanced(searchText);
      if (facetQueryAdvanced) {
        URI += [
          params.toString(),
          facetQuery,
          facetQueryAdvanced ? "fq=" + facetQueryAdvanced : "",
          sort ? "sort=" + sort : "",
        ]
          .filter((e) => e)
          .join("&");
      } else {
        if (searchText !== "") {
          params.append("search_text", searchText);
        }

        URI += [
          params.toString(),
          facetQuery,
          fq ? "fq=" + fq : "",
          sort ? "sort=" + sort : "",
        ]
          .filter((e) => e)
          .join("&");
      }

      setCurrentURI(URI);

      fetch(URI)
        .then((response) => response.json())
        .then((json) => {
          setResults(json.docs);
          const count = json.count;
          setResultCount(count);
          setCounts((prev) => ({ ...prev, [searchType]: count }));
          setFacets(json.facets.filter((facet) => facet.counts.length > 0));
          setIsLoading(false);
        });
    },
    /*  } */ [
      searchText,
      searchType,
      facetQuery,
      region,
      page,
      showMorePages,
      fq,
      sort,
    ]
  );

  const destructuringSearchTextAdvanced = (query) => {
    const trimmedQuery = query.replace(/"/g, "'").trim();
    const regex = /'([^']*)' (\S+) '([^']*)'/;
    if (trimmedQuery.startsWith("{{") && trimmedQuery.endsWith("}}")) {
      const cleanedQuery = trimmedQuery.slice(2, -2).trim();

      const subQueries = cleanedQuery
        .split(new RegExp("\\b" + "AND" + "\\b", "i"))
        .map((subQuery) => subQuery.trim());

      const parsedObject = {};

      subQueries.forEach((subQuery, index) => {
        if (subQuery.startsWith("(") && subQuery.endsWith(")")) {
          const cleanedSubQuery = subQuery.slice(1, -1).trim();

          if (new RegExp("\\b" + "OR" + "\\b", "i").test(cleanedSubQuery)) {
            const subQueriesOR = cleanedSubQuery
              .split(new RegExp("\\b" + "OR" + "\\b", "i"))
              .map((subQuery) => subQuery.trim());

            subQueriesOR.forEach((subQueryOR, index2) => {
              if (subQueryOR.startsWith("(") && subQueryOR.endsWith(")")) {
                const x = subQueryOR.slice(1, -1).trim();
                const matches = x.match(regex);

                if (matches && matches.length === 4) {
                  const [_, category, operator, value] = matches;
                  if (!parsedObject[index]) {
                    parsedObject[index] = [];
                  }

                  parsedObject[index].push({
                    id: index2,
                    category: category.trim(),
                    operator: operator.trim(),
                    textfield: value.replace(/'/g, ""),
                  });
                }
              }
            });
          } else {
            const matches = cleanedSubQuery.match(regex);

            if (matches && matches.length === 4) {
              const [_, category, operator, value] = matches;

              if (index === 0) {
                parsedObject[index] = {
                  category: category.trim(),
                  value: value.replace(/'/g, ""),
                  region: "Global",
                };
              } else {
                parsedObject[index] = [
                  {
                    id: 0,
                    category: category.trim(),
                    operator: operator.trim(),
                    textfield: value.replace(/'/g, ""),
                  },
                ];
              }
            }
          }
        }
      });

      const [searchQueryBuild, facetQuery] = searchAdvanced(parsedObject);
      return facetQuery;
    }
    return undefined;
  };

  const facetSearch = (name, value, checked) => {
    const clickedFacetQuery = new URLSearchParams({
      facetType: name,
      facetName: value,
    }).toString();

    if (checked) {
      setFacetQuery([facetQuery, clickedFacetQuery].filter((e) => e).join("&"));
    } else {
      const filteredQuery = facetQuery.replace(clickedFacetQuery, "");
      let cleanedQuery = filteredQuery.endsWith("&")
        ? filteredQuery.slice(0, -1)
        : filteredQuery;
      cleanedQuery = cleanedQuery.startsWith("&")
        ? cleanedQuery.slice(1)
        : cleanedQuery;
      cleanedQuery = cleanedQuery.replace("&&", "&");
      setFacetQuery(cleanedQuery);
    }
  };

  const facetSearchMobile = (query) => {
    setFacetQuery([facetQuery, query].filter((e) => e).join("&"));
  };

  const resetDefaultSearchUrl = (type) => {
    navigate(
      `/results/${type}?${new URLSearchParams({
        ...(searchText ? { search_text: searchText } : {}),
        ...(sort ? { sort: sort } : {}),
        ...(region.toUpperCase() !== "GLOBAL" ? { region } : {}),
      })}`
    );
  };

  const clearFacetQuery = () => {
    resetDefaultSearchUrl(searchType);
  };

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
                    setFilterChosenMobile={setFilterChosenMobile}
                    filterChosenMobile={filterChosenMobile}
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
                    setFilterChosenMobile={setFilterChosenMobile}
                    filterChosenMobile={filterChosenMobile}
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
                onChange={(e) => setSort(e.target.value)}
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
            {filterChosenMobile.map((item, index) => {
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
                    setFilterChosenMobile((f) =>
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
                          onChange={(e) => setSort(e.target.value)}
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
                    {results.map((result) => (
                      <ResultValue
                        result={result}
                        completeValue={100}
                        key={result["id"]}
                        onlyVerified={onlyVerified}
                      />
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
                </Box>
              </Fade>
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
}
