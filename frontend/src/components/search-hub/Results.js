/* global URLSearchParams */

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSearchParam } from "utilities/generalUtility";
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

export default function Results() {
  const [results, setResults] = useState([]);
  const [resultCount, setResultCount] = useState(0);
  const [counts, setCounts] = useState({});
  const [facets, setFacets] = useState([]);

  const [showMorePages, setShowMorePages] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth >= 768);
  const [filterChosenMobile, setFilterChosenMobile] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [currentURI, setCurrentURI] = useState("");

  const navigate = useNavigate();
  const { searchType = "CreativeWork" } = useParams();
  const [searchText, setSearchText] = useSearchParam("search_text", "");
  const [region, setRegion] = useSearchParam("region", "global");
  const [facetQuery, setFacetQuery] = useSearchParam("facet_query");
  const [fq, setFq] = useSearchParam("fq");
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

  useEffect(
    () => {
      /*  if (showMap) {
      mapSearch(mapBounds, page);
    } else { */
      debugger;
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
      URI += [params.toString(), facetQuery, fq ? "fq=" + fq : ""]
        .filter((e) => e)
        .join("&");
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
    },
    /*  } */ [
      searchText,
      searchType,
      facetQuery,
      region,
      page,
      showMorePages,
      fq,
    ]
  );

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
                  facetQuery={facetQuery}
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
                    facetQuery={facetQuery}
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
            </Box>
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
                    if (item.type === "provider") setSelectedProvider("");
                    clear();
                    setFilterChosenMobile((f) =>
                      f.filter((d) => d.type !== item.type)
                    );
                  }}
                >
                  {translationState.translation[item.text] ||
                    cutWithDots(item.text, 10)}
                </Button>
              );
            })}
          </Box>
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
