/* global URLSearchParams */
import React, { useState, useCallback } from "react";
import {
  Link,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import useSearchParam from "../useSearchParam";

import { PROMOTED_REGIONS, randomSampleQueries } from "../constants";
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
  } = props;

  return (
    <Grid item container justifyContent={"space-between"} spacing={4}>
      <Grid item xs={12} lg={8}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: { xs: 1, lg: 0 },
          }}
        >
          <Box>
            <Grid container justifyContent={"space-between"}>
              <Grid item xs={6} lg={12}>
                <InputLabel disabled id="demo-simple-select-label"></InputLabel>
                <Select
                  startAdornment={<PublicIcon sx={{ marginRight: 1 }} />}
                  defaultValue={"Global"}
                  name="searchRegion"
                  onChange={(e) => setRegion(e.target.value)}
                  sx={{
                    backgroundColor: "#FFFFFF",
                    color: "black",
                    fontWeight: 600,
                    borderRadius: 0,
                    /* ".MuiOutlinedInput-notchedOutline": {
                              xs: { border: "none" },
                            }, */
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
              <Grid
                item
                xs={5}
                lg={0}
                justifyContent={"end"}
                display={{ xs: "flex", lg: "none" }}
              >
                <Select
                  defaultValue={
                    useCookies.getCookie("language")
                      ? useCookies.getCookie("language")
                      : SupportedLangugesEnum.En
                  }
                  name="languageChoice"
                  onChange={(e) => changeTranslation(e.target.value)}
                  sx={{
                    backgroundColor: "#FFFFFF",
                    color: "black",
                    fontWeight: 600,
                    borderRadius: 0,
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
          </Box>

          <TextField
            fullWidth
            sx={{
              backgroundColor: "#FFFFFF",
              "& .MuiFormLabel-root": {
                fontSize: { xs: "14px", lg: "20px" },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
              style: {
                borderRadius: 0,
              },
            }}
            placeholder={placeholder()}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            name="search"
          />
          <Button
            variant="contained"
            disableElevation
            sx={{
              borderRadius: { xs: 2, lg: 0 },
              width: { xs: "100%", lg: "auto" },
              backgroundColor: "#40AAD3",
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
        display={{ xs: "none", lg: "flex" }}
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
            backgroundColor: "#FFFFFF",
            color: "black",
            fontWeight: 600,
            borderRadius: 0,
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
  return (
    <>
      <Container
        maxWidth="lg"
        sx={{ background: { xs: "#1A2C54", lg: "none" } }}
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
                <Box>
                  <Grid container justifyContent={"space-between"}>
                    <Grid item xs={12} lg={12}>
                      <InputLabel disabled></InputLabel>
                      <Select
                        startAdornment={<PublicIcon sx={{ marginRight: 1 }} />}
                        defaultValue={"Global"}
                        fullWidth
                        sx={{
                          backgroundColor: { xs: "transparent", lg: "#e2e6e6" },
                          color: { xs: "white", lg: "black" },
                          fontWeight: 600,
                          borderRadius: 0,
                          ".MuiOutlinedInput-notchedOutline": {
                            xs: { border: "none" },
                          },
                          ".MuiSelect-icon": {
                            color: { xs: "white", lg: "black" },
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
                    backgroundColor: { xs: "#13213F", lg: "#e2e6e6" },
                    "& .MuiFormLabel-root": {
                      fontSize: { xs: "14px", lg: "20px" },
                      color: "#7B8FB7",
                    },
                    ".MuiOutlinedInput-notchedOutline": {
                      xs: { border: "none" },
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon
                          sx={{ color: { xs: "white", lg: " black" } }}
                        />
                      </InputAdornment>
                    ),
                    style: {
                      borderRadius: 0,
                    },
                  }}
                  label="Search across our Global partners"
                  placeholder={placeholder()}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  name="search"
                />
                <Typography
                  variant="body2"
                  alignItems={"start"}
                  display={{ xs: "flex", lg: "none" }}
                  sx={{ color: "#BDC7DB", my: 2 }}
                >
                  <LightbulbOutlinedIcon sx={{ color: "#F8BB27" }} />
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
                    backgroundColor: "#40AAD3",
                    textTransform: "none",
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
                    color: { xs: "white", lg: "#2B498C" },
                    marginLeft: 2,
                    textTransform: "none",
                  }}
                >
                  Advanced
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
              <ShareIcon sx={{ color: { xs: "white", lg: "black" } }} />
              <Box display={"flex"} alignItems={"center"} gap={2}>
                <Select
                  startAdornment={<FileDownloadIcon />}
                  defaultValue="Export"
                  sx={{
                    backgroundColor: { xs: "transparent", lg: "#FFFFFF" },
                    color: { xs: "white", lg: "black" },
                    fontWeight: 600,
                    borderRadius: 1,
                    ".MuiOutlinedInput-notchedOutline": {
                      xs: { borderColor: "white" },
                      lg: { borderColor: "#BDC7DB" },
                    },
                    ".MuiSelect-icon": {
                      color: { xs: "white", lg: "black" },
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
                    backgroundColor: { xs: "transparent", lg: "#FFFFFF" },
                    color: { xs: "white", lg: "black" },
                    fontWeight: 600,
                    borderRadius: 1,
                    ".MuiOutlinedInput-notchedOutline": {
                      xs: { borderColor: "white" },
                      lg: { borderColor: "#BDC7DB" },
                    },
                    ".MuiSelect-icon": {
                      color: { xs: "white", lg: "black" },
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
          <Grid item xs={12} lg={7}>
            <Typography
              variant="body2"
              alignItems={"start"}
              display={{ xs: "none", lg: "flex" }}
              sx={{ color: "#BDC7DB" }}
            >
              <LightbulbOutlinedIcon sx={{ color: "#F8BB27" }} />
              ProTip! Enhance your search precision with AND, OR, and XOR
              operators, and filter results using 'contains' and 'not contains.'
              Specify 'all' or 'any' to fine-tune your query.
            </Typography>
          </Grid>
          <Grid item lg={12} />
          <Grid
            item
            container
            columnGap={2}
            lg={6}
            display={{ xs: "none", lg: "flex" }}
          >
            <Select
              defaultValue="All"
              sx={{
                color: "black",
                fontWeight: 600,
                borderRadius: 1,
              }}
            >
              <MenuItem value="All">All</MenuItem>
            </Select>
            <Select
              defaultValue="Operator"
              sx={{
                color: "black",
                fontWeight: 600,
                borderRadius: 1,
              }}
            >
              <MenuItem value="Operator">Operator</MenuItem>
            </Select>
            <Select
              defaultValue="Booleans"
              sx={{
                color: "black",
                fontWeight: 600,
                borderRadius: 1,
              }}
            >
              <MenuItem value="Booleans">Booleans</MenuItem>
            </Select>
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
