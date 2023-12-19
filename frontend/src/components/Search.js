/* global URLSearchParams */
import React, { useState, useCallback } from "react";
import {
  Link,
  useNavigate,
  useLocation,
  useSearchParams,
  RouterLink,
} from "react-router-dom";
import useSearchParam from "../useSearchParam";

import {
  PROMOTED_REGIONS,
  randomSampleQueries,
} from "./configuration/constants";
import { SupportedLangugesEnum } from "ContextManagers/AppTranslationProvider";
import { useAppTranslation } from "ContextManagers/context/AppTranslation";
import useCookies from "ContextManagers/useCookies";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import PublicIcon from "@mui/icons-material/Public";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ShareIcon from "@mui/icons-material/Share";
import LinkMui from "@mui/material/Link";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import AdvancedSearch from "./ResultsComponents/AdvancedSearch";

// Set once, will change for every load, not every key click
const currentSampleQueries = randomSampleQueries(4);

export default function Search() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    params.has("search_text") ? params.get("search_text") : ""
  );
  const [region, setRegion] = useSearchParam("region", "global");
  const location = useLocation();
  const isResults = location.pathname.startsWith("/results");

  const translationState = useAppTranslation();

  const changeTranslation = (languageCode) => {
    translationState.updateTranslation(languageCode);
  };

  const [_, url, tabName = ""] = window.location.pathname.split("/");

  const hrefFor = (region, query) =>
    `/results/${tabName}?${new URLSearchParams({
      ...(query ? { search_text: query } : {}),
      ...(region && region.toUpperCase() !== "GLOBAL" ? { region } : {}),
    })}`;

  const handleSubmit = useCallback(
    () => navigate(hrefFor(region, searchQuery)),
    [navigate, region, searchQuery, tabName]
  );

  const getPromotedRegion = (region) => {
    if (region === "Oceania" || region === "Latin America and the Caribbean") {
      return translationState.translation[region];
    }
    return translationState.translation[PROMOTED_REGIONS[region]];
  };

  const placeholder = useCallback(
    () =>
      translationState.translation["Search across our"] +
      (getPromotedRegion(region) || translationState.translation["Global"]) +
      translationState.translation["Partners"],
    [region, useCookies.getCookie("language")]
  );
  const sendGoogleEvent = () => {
    let searchElements = document.getElementsByName("search");
    let search = searchElements[0];
    let regionElements = document.getElementsByName("searchRegion");
    let region = regionElements[0];
    //console.log(element.value);
    gtag("config", "G-MQDK6BB0YQ");
    gtag("event", "click_on_search", {
      oih_search_text: search.value,
      oih_search_region: region.value,
    });
  };

  return isResults ? (
    <SearchResult
      region={region}
      setRegion={setRegion}
      translationState={translationState}
      placeholder={placeholder}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      sendGoogleEvent={sendGoogleEvent}
      handleSubmit={handleSubmit}
      changeTranslation={changeTranslation}
      url={url}
    />
  ) : (
    <SearchHome
      region={region}
      setRegion={setRegion}
      translationState={translationState}
      placeholder={placeholder}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      sendGoogleEvent={sendGoogleEvent}
      handleSubmit={handleSubmit}
      changeTranslation={changeTranslation}
      hrefFor={hrefFor}
    />
  );
}

const SearchHome = (props) => {
  const {
    region,
    setRegion,
    translationState,
    placeholder,
    searchQuery,
    setSearchQuery,
    sendGoogleEvent,
    handleSubmit,
    changeTranslation,
    hrefFor,
  } = props;

  const palette = "custom.homepage.searchBar.";
  return (
    <Grid item container justifyContent={"space-between"} spacing={4}>
      <Grid item xs={12} lg={12}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: { xs: 1, lg: 2 },
          }}
        >
          <Box display="flex" width={"100%"}>
            <Box>
              <Grid container justifyContent={"space-between"}>
                <Grid item xs={6} lg={12}>
                  <InputLabel disabled></InputLabel>
                  <Select
                    startAdornment={
                      <PublicIcon
                        sx={{
                          marginRight: 1,
                          color: palette + "iconsColor",
                        }}
                      />
                    }
                    defaultValue={"Global"}
                    name="searchRegion"
                    onChange={(e) => setRegion(e.target.value)}
                    sx={{
                      backgroundColor: palette + "bgColor",
                      color: palette + "iconsColor",
                      fontWeight: 600,
                      borderBottomRightRadius: 0,
                      borderTopRightRadius: 0,
                      ".MuiOutlinedInput-notchedOutline": {
                        borderRight: "none",
                      },
                      ".MuiSelect-icon": {
                        color: palette + "iconsColor",
                      },
                    }}
                  >
                    {Object.entries(PROMOTED_REGIONS).map(([region, title]) => {
                      return (
                        <MenuItem key={region} value={region}>
                          {translationState.translation[region]}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </Grid>
              </Grid>
            </Box>

            <TextField
              fullWidth
              sx={{
                backgroundColor: palette + "bgColor",
                "& .MuiFormLabel-root": {
                  fontSize: { xs: "14px", lg: "20px" },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon sx={{ color: palette + "searchIcon" }} />
                  </InputAdornment>
                ),
                style: {
                  borderBottomLeftRadius: 0,
                  borderTopLeftRadius: 0,
                  borderBottomRightRadius: 4,
                  borderTopRightRadius: 4,
                },
              }}
              placeholder={placeholder()}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              name="search"
            />
          </Box>

          <Button
            variant="contained"
            disableElevation
            sx={{
              borderRadius: { xs: 2, lg: 1 },
              width: { xs: "100%", lg: "auto" },
              backgroundColor: palette + "bgColorButton",
              textTransform: "none",
            }}
            onClick={() => {
              sendGoogleEvent();
              handleSubmit();
            }}
          >
            {translationState.translation["Search"]}
          </Button>
        </Box>
      </Grid>
      <Grid
        item
        xs={10}
        lg={8}
        display="flex"
        sx={{ gap: 2 }}
        alignItems="center"
      >
        <Typography
          variant="h6"
          component="span"
          sx={{ color: "white", fontWeight: 700 }}
        >
          {translationState.translation["Try"]}:
        </Typography>
        {currentSampleQueries.map((query, ix) => (
          <LinkMui
            key={ix}
            sx={{
              color: palette + "colorLink",
              textDecorationColor: palette + "colorLink",
            }}
            // Touch up the internal state to match the navigation
            onClick={(e) => setSearchQuery(query)}
            // do the navigation
            to={hrefFor(region, query)}
            component={RouterLink} // Ensure you import RouterLink from react-router-dom
          >
            <Typography variant="subtitle1">
              {translationState.translation[query]}
            </Typography>
          </LinkMui>
        ))}
      </Grid>
      <Grid
        item
        display={{ xs: "flex", lg: "flex" }}
        justifyContent={"end"}
        lg={2}
      >
        <Select
          value={
            useCookies.getCookie("language")
              ? useCookies.getCookie("language")
              : SupportedLangugesEnum.En
          }
          name="languageChoice"
          onChange={(e) => changeTranslation(e.target.value)}
          sx={{
            backgroundColor: palette + "bgColor",
            color: palette + "iconsColor",
            fontWeight: 600,
            borderRadius: 0,
            height: "34px",
            ".MuiSelect-icon": {
              color: palette + "iconsColor",
            },
          }}
        >
          <MenuItem
            key={SupportedLangugesEnum.En}
            value={SupportedLangugesEnum.En}
          >
            {SupportedLangugesEnum.En}
          </MenuItem>
          <MenuItem
            key={SupportedLangugesEnum.Es}
            value={SupportedLangugesEnum.Es}
          >
            {SupportedLangugesEnum.Es}
          </MenuItem>
          <MenuItem
            key={SupportedLangugesEnum.Ru}
            value={SupportedLangugesEnum.Ru}
          >
            {SupportedLangugesEnum.Ru}
          </MenuItem>
          <MenuItem
            key={SupportedLangugesEnum.Fr}
            value={SupportedLangugesEnum.Fr}
          >
            {SupportedLangugesEnum.Fr}
          </MenuItem>
        </Select>
      </Grid>
    </Grid>
  );
};

const SearchResult = (props) => {
  const {
    region,
    setRegion,
    translationState,
    placeholder,
    searchQuery,
    setSearchQuery,
    sendGoogleEvent,
    handleSubmit,
    changeTranslation,
    url,
  } = props;
  const [openAdvancedSearch, setOpenAdvancedSearch] = useState(false);

  const palette = "custom.resultPage.searchBar.";
  return (
    <>
      <Container
        maxWidth="lg"
        sx={{
          backgroundColor: {
            xs: palette + "bgColorBoxMobile",
            lg: "transparent",
          },
        }}
      >
        <Grid container spacing={2} mt={6}>
          <Grid item container justifyContent={"space-between"} spacing={4}>
            <Grid item xs={12} lg={8}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", lg: "row" },
                  gap: { xs: 1, lg: 1 },
                }}
              >
                <Box
                  display="flex"
                  width={"100%"}
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", lg: "row" },
                    gap: { xs: 1, lg: 0 },
                  }}
                >
                  <Box>
                    <Grid container justifyContent={"space-between"}>
                      <Grid item xs={6} lg={12}>
                        <InputLabel disabled></InputLabel>
                        <Select
                          startAdornment={
                            <PublicIcon
                              sx={{
                                marginRight: 1,
                                color: {
                                  xs: palette + "iconsColorMobile",
                                  lg: palette + "iconsColorDesktop",
                                },
                              }}
                            />
                          }
                          defaultValue={"Global"}
                          fullWidth
                          sx={{
                            backgroundColor: {
                              xs: "transparent",
                              lg: palette + "bgColorSelectDesktop",
                            },
                            color: {
                              xs: palette + "iconsColorMobile",
                              lg: palette + "iconsColorDesktop",
                            },
                            fontWeight: 600,
                            borderBottomRightRadius: 0,
                            borderTopRightRadius: 0,
                            ".MuiOutlinedInput-notchedOutline": {
                              borderRight: { lg: "none" },
                            },
                            ".MuiSelect-icon": {
                              color: {
                                xs: palette + "iconsColorMobile",
                                lg: palette + "iconsColorDesktop",
                              },
                            },
                          }}
                          onChange={(e) => setRegion(e.target.value)}
                        >
                          {Object.entries(PROMOTED_REGIONS).map(
                            ([region, title]) => {
                              return (
                                <MenuItem key={region} value={region}>
                                  {translationState.translation[region]}
                                </MenuItem>
                              );
                            }
                          )}
                        </Select>
                      </Grid>
                    </Grid>
                  </Box>
                  <TextField
                    fullWidth
                    sx={{
                      backgroundColor: {
                        xs: palette + "bgColorTextfieldMobile",
                        lg: palette + "bgColorSelectDesktop",
                      },
                      "& .MuiFormLabel-root": {
                        fontSize: { xs: "14px", lg: "16px" },
                        color: {
                          xs: palette + "colorTextfieldMobile",
                          lg: palette + "colorTextfieldDesktop",
                        },
                      },
                      ".MuiOutlinedInput-notchedOutline": {
                        /*   xs: { border: "none" }, */
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <SearchIcon
                            sx={{
                              color: {
                                xs: palette + "iconsColorMobile",
                                lg: palette + "searchIconDesktop",
                              },
                            }}
                          />
                        </InputAdornment>
                      ),
                      style: {
                        borderBottomLeftRadius: 0,
                        borderTopLeftRadius: 0,
                        borderBottomRightRadius: 4,
                        borderTopRightRadius: 4,
                      },
                    }}
                    placeholder={placeholder()}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    name="search"
                  />
                </Box>

                <Typography
                  variant="body2"
                  alignItems={"start"}
                  display={{ xs: "flex", lg: "none" }}
                  sx={{ color: "#BDC7DB", my: 2 }}
                >
                  <LightbulbOutlinedIcon
                    sx={{ color: palette + "iconProtip" }}
                  />
                  ProTip! Enhance your search precision with AND, OR, and XOR
                  operators, and filter results using 'contains' and 'not
                  contains.' Specify 'all' or 'any' to fine-tune your query.
                </Typography>
                <Button
                  variant="contained"
                  disableElevation
                  sx={{
                    borderRadius: 2,
                    width: { xs: "100%", lg: "15%" },
                    backgroundColor: palette + "bgColorButton",
                    textTransform: "none",
                    height: "56px",
                  }}
                  onClick={() => {
                    sendGoogleEvent();
                    handleSubmit();
                  }}
                >
                  {translationState.translation["Search"]}
                </Button>
                <Button
                  variant="text"
                  disableElevation
                  sx={{
                    borderRadius: 2,
                    color: {
                      xs: palette + "colorTextfieldMobile",
                      lg: palette + "colorTextfieldDesktop",
                    },
                    marginLeft: 2,
                    textTransform: "none",
                    fontSize: "12px",
                    whiteSpace: "noWrap",
                    width: "20%",
                    padding: 0,
                  }}
                  onClick={() => setOpenAdvancedSearch(!openAdvancedSearch)}
                >
                  Show Advanced
                </Button>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              lg={2}
              display={"flex"}
              alignItems={"center"}
              justifyContent={{ xs: "space-between", lg: "end" }}
              sx={{ gap: 1 }}
            >
              <ShareIcon
                sx={{
                  color: {
                    xs: palette + "colorTextfieldMobile",
                    lg: palette + "colorTextfieldDesktop",
                  },
                }}
              />
              <Box display={"flex"} alignItems={"center"} gap={2}>
                <Select
                  startAdornment={<FileDownloadIcon />}
                  defaultValue="Export"
                  sx={{
                    backgroundColor: {
                      xs: "transparent",
                      lg: palette + "bgExportButtonDesktop",
                    },
                    color: {
                      xs: palette + "iconsColorMobile",
                      lg: palette + "iconsColorDesktop",
                    },
                    fontWeight: 700,
                    borderRadius: 1,
                    height: "34px",
                    ".MuiOutlinedInput-notchedOutline": {
                      xs: { borderColor: palette + "borderColorSelectMobile" },
                      lg: { borderColor: palette + "borderColorSelectDesktop" },
                    },
                    ".MuiSelect-icon": {
                      color: {
                        xs: palette + "iconsColorMobile",
                        lg: palette + "iconsColorDesktop",
                      },
                    },
                    marginLeft: { xs: "120px", lg: "90px" },
                  }}
                >
                  <MenuItem value="Export">Export</MenuItem>
                </Select>
                <Select
                  defaultValue={"EN"}
                  value={
                    useCookies.getCookie("language")
                      ? useCookies.getCookie("language")
                      : SupportedLangugesEnum.En
                  }
                  name="languageChoice"
                  onChange={(e) => changeTranslation(e.target.value)}
                  sx={{
                    backgroundColor: {
                      xs: "transparent",
                      lg: palette + "bgColorSelectDesktop",
                    },
                    color: {
                      xs: palette + "iconsColorMobile",
                      lg: palette + "iconsColorDesktop",
                    },
                    fontWeight: 600,
                    borderRadius: 1,
                    height: "34px",
                    ".MuiOutlinedInput-notchedOutline": {
                      xs: { borderColor: palette + "borderColorSelectMobile" },
                      lg: { borderColor: palette + "borderColorSelectDesktop" },
                    },
                    ".MuiSelect-icon": {
                      color: {
                        xs: palette + "iconsColorMobile",
                        lg: palette + "iconsColorDesktop",
                      },
                    },
                  }}
                >
                  <MenuItem
                    key={SupportedLangugesEnum.En}
                    value={SupportedLangugesEnum.En}
                  >
                    {SupportedLangugesEnum.En}
                  </MenuItem>
                  <MenuItem
                    key={SupportedLangugesEnum.Es}
                    value={SupportedLangugesEnum.Es}
                  >
                    {SupportedLangugesEnum.Es}
                  </MenuItem>
                  <MenuItem
                    key={SupportedLangugesEnum.Ru}
                    value={SupportedLangugesEnum.Ru}
                  >
                    {SupportedLangugesEnum.Ru}
                  </MenuItem>
                  <MenuItem
                    key={SupportedLangugesEnum.Fr}
                    value={SupportedLangugesEnum.Fr}
                  >
                    {SupportedLangugesEnum.Fr}
                  </MenuItem>
                </Select>
              </Box>
            </Grid>
          </Grid>
          <Grid item lg={12}>
            <Accordion
              expanded={openAdvancedSearch}
              onChange={(e) => e.preventDefault}
              elevation={0}
            >
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
                sx={{ display: "none" }}
              ></AccordionSummary>
              <AccordionDetails>
                <AdvancedSearch
                  setSearchQuery={setSearchQuery}
                  searchQuery={searchQuery}
                />
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

/* Old Version */
{
  /* <div
        className={
          "search__container " + (url === " results" ? " searchbg-alt" : "")
        }
      >
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-2 col-sm-12 me-4 mb-4"></div>
            <div className="col-12 col-md-9 col-sm-11">
              <form
                id="searchBarForm"
                className={
                  "d-flex flex-justify-start align-self pt-2" +
                  (url == "results" ? "result-search" : "")
                }
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <select
                  className="form-select w-50 rounded-0"
                  value={region}
                  name="searchRegion"
                  onChange={(e) => setRegion(e.target.value)}
                >
                  {Object.entries(PROMOTED_REGIONS).map(([region, title]) => {
                    return (
                      <option key={region} value={region}>
                        {translationState.translation[region]}
                      </option>
                    );
                  })}
                </select>
                <input
                  className="flex-fill form-control rounded-0"
                  type="text"
                  placeholder={placeholder()}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  name="search"
                />
                <Button
                  className="btn-lg btn-info rounded-0 text-dark"
                  type="submit"
                  onClick={sendGoogleEvent}
                >
                  <span className="h6">
                    {translationState.translation["Search"]}
                  </span>
                </Button>
              </form>
               {!isResults && (
              <div className="text-light text-start mt-3">
                <span className="p-2 h5">
                  {translationState.translation["Try"]}:
                </span>
                {currentSampleQueries.map((query, ix) => (
                  <Link
                    key={ix}
                    // Touch up the internal state to match the navigation
                    onClick={(e) => setSearchQuery(query)}
                    // do the navigation
                    to={hrefFor(region, query)}
                    className="text-info text-light h6 p-2"
                  >
                    {translationState.translation[query]}
                  </Link>
                ))}
              </div>
            )}
            {!isResults && (
              <div className="text-light text-end ">
                <a href="#bbc" className="text-light">
                  {translationState.translation["Browse"]}
                </a>
              </div>
            )} 
            </div>
          </div>
        </div>
      </div> 
  */
}
