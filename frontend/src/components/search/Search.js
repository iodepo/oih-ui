/* global URLSearchParams */
import React, { useState, useCallback, useEffect } from "react";
import {
  useNavigate,
  useLocation,
  useSearchParams,
  /* RouterLink, */
} from "react-router-dom";
import { useSearchParam } from "utilities/generalUtility";
import { PROMOTED_REGIONS } from "../../portability/configuration";
import { randomSampleQueries } from "utilities/generalUtility";
import { SupportedLangugesEnum } from "context/AppTranslationProvider";
import { useAppTranslation } from "context/context/AppTranslation";
import useCookies from "context/useCookies";
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
import ShareIcon from "@mui/icons-material/Share";
import LinkMui from "@mui/material/Link";
import Accordion from "@mui/material/Accordion";
import IconButton from "@mui/material/IconButton";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import AdvancedSearch from "./advancedSearch/AdvancedSearch";
import { Export } from "../search-hub/Export";
import Avatar from "@mui/material/Avatar";
import FrenchFlag from "../../resources/svg/FrenchFlag.svg";
import RussianFlag from "../../resources/svg/RussianFlag.svg";
import EnglishFlag from "../../resources/svg/EnglishFlag.svg";
import SpanishFlag from "../../resources/svg/SpanishFlag.svg";
import Tooltip from "@mui/material/Tooltip";
import { trackingMatomoSearch } from "utilities/trackingUtility";

// Set once, will change for every load, not every key click
const currentSampleQueries = randomSampleQueries(4);

export default function Search(props) {
  const { uri, searchType, resultCount, facets } = props;

  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    params.has("search_text") ? params.get("search_text") : ""
  );
  const [region, setRegion] = useSearchParam("region", "global");
  const location = useLocation();
  const isResults = location.pathname.startsWith("/results");
  const [sort, setSort] = useSearchParam("sort");

  const translationState = useAppTranslation();

  const changeTranslation = (languageCode) => {
    translationState.updateTranslation(languageCode);
    changeLanguageIcon(languageCode);
  };

  const [_, url, tabName = ""] = window.location.pathname.split("/");

  const hrefFor = (region, query) =>
    `/results/${tabName}?${new URLSearchParams({
      ...(query ? { search_text: query } : {}),
      ...(sort ? { sort: sort } : {}),
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
  const sendMatomoEvent = (regionValue) => {
    /*let searchElements = document.getElementsByName("search");
    let search = searchElements[0];
    let regionElements = document.getElementsByName("searchRegion");
    let region = regionElements[0];*/

    //console.log(element.value);
    /*gtag("config", "G-MQDK6BB0YQ");
    gtag("event", "click_on_search", {
      oih_search_text: search.value,
      oih_search_region: region.value,
    });*/
    trackingMatomoSearch(searchQuery, regionValue, resultCount);
  };
  const searchAdvancedSearch = (type) => {
    navigate(
      `/results/${type}?${region ? "region=" + region : ""}&accordionOpen=true`
    );
  };

  const [languageIcon, setLanguageIcon] = useState(EnglishFlag);

  useEffect(() => {
    changeLanguageIcon(translationState.getTranslationKey());
  }, []);
  const changeLanguageIcon = (languageCode) => {
    switch (languageCode) {
      case SupportedLangugesEnum.En:
        setLanguageIcon(EnglishFlag);
        break;
      case SupportedLangugesEnum.Fr:
        setLanguageIcon(FrenchFlag);
        break;
      case SupportedLangugesEnum.Es:
        setLanguageIcon(SpanishFlag);
        break;
      case SupportedLangugesEnum.Ru:
        setLanguageIcon(RussianFlag);
        break;
    }
  };
  return isResults ? (
    <SearchResult
      region={region}
      setRegion={setRegion}
      translationState={translationState}
      placeholder={placeholder}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      sendMatomoEvent={sendMatomoEvent}
      handleSubmit={handleSubmit}
      changeTranslation={changeTranslation}
      url={url}
      uri={uri}
      searchType={searchType}
      resultCount={resultCount}
      facets={facets}
      languageIcon={languageIcon}
    />
  ) : (
    <SearchHome
      region={region}
      setRegion={setRegion}
      translationState={translationState}
      placeholder={placeholder}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      sendMatomoEvent={sendMatomoEvent}
      handleSubmit={handleSubmit}
      changeTranslation={changeTranslation}
      hrefFor={hrefFor}
      searchAdvancedSearch={searchAdvancedSearch}
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
    sendMatomoEvent,
    handleSubmit,
    changeTranslation,
    hrefFor,
    searchAdvancedSearch,
  } = props;

  const palette = "custom.homepage.searchBar.";
  return (
    <Grid item container justifyContent={"space-between"} spacing={2}>
      <Grid item xs={12} lg={12}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: { xs: 1, lg: 2 },
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
              <Grid
                container
                justifyContent={{ xs: "unset", lg: "space-between" }}
              >
                <Grid item xs={12} lg={12}>
                  <InputLabel disabled></InputLabel>
                  <Select
                    startAdornment={
                      <PublicIcon
                        sx={{
                          marginRight: 1,
                          color: {
                            xs: palette + "bgColorSelectMobile",
                            lg: palette + "iconsColor",
                          },
                        }}
                      />
                    }
                    defaultValue={
                      region.charAt(0).toUpperCase() + region.slice(1)
                    }
                    name="searchRegion"
                    onChange={(e) => setRegion(e.target.value)}
                    sx={{
                      backgroundColor: {
                        xs: "transparent",
                        lg: palette + "bgColor",
                      },
                      color: {
                        xs: palette + "bgColorSelectMobile",
                        lg: palette + "iconsColor",
                      },
                      fontWeight: 600,
                      borderBottomRightRadius: 0,
                      borderTopRightRadius: 0,
                      width: { xs: "100%", lg: "132px" },
                      ".MuiOutlinedInput-notchedOutline": {
                        borderRight: { lg: "none" },
                        borderWidth: { xs: 0, lg: "1px" },
                      },
                      ".MuiSelect-icon": {
                        color: { xs: "#FFFFFF", lg: palette + "iconsColor" },
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
                backgroundColor: { xs: "#DFE1E71A", lg: palette + "bgColor" },
                "& .MuiFormLabel-root": {
                  fontSize: { xs: "14px", lg: "20px" },
                },
                "& .MuiOutlinedInput-root": {
                  borderBottomLeftRadius: { xs: 4, lg: 0 },
                  borderTopLeftRadius: { xs: 4, lg: 0 },
                  borderBottomRightRadius: 4,
                  borderTopRightRadius: 4,
                  color: { xs: "#7B8FB7", lg: "unset" },
                },
                borderBottomRightRadius: 4,
                borderTopRightRadius: 4,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon
                      sx={{
                        color: palette + "searchIcon",
                      }}
                    />
                  </InputAdornment>
                ),
                style: {},
              }}
              placeholder={placeholder()}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              name="search"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  sendMatomoEvent(region);
                  handleSubmit();
                }
              }}
            />
          </Box>

          <Button
            variant="contained"
            disableElevation
            sx={{
              display: { xs: "none", lg: "flex" },
              borderRadius: { xs: 2, lg: 1 },
              width: { xs: "100%", lg: "auto" },
              backgroundColor: palette + "bgColorButton",
              textTransform: "none",
            }}
            onClick={() => {
              sendMatomoEvent(region);
              handleSubmit();
            }}
          >
            {translationState.translation["Search"]}
          </Button>
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        lg={8}
        display="flex"
        sx={{
          gap: 2,
          maxWidth: "unset",
          overflowX: { xs: "auto", md: "visible" },
          flexBasis: "100%",
          height: "70px",
        }}
        alignItems="center"
      >
        <Typography component="span" sx={{ color: "white", fontWeight: 700 }}>
          {translationState.translation["Try"]}:
        </Typography>
        {currentSampleQueries.map((query, ix) => (
          <LinkMui
            key={ix}
            sx={{
              color: palette + "colorLink",
              textDecorationColor: "#FFFFFF",
              cursor: "pointer",
              fontSize: "14px",
              whiteSpace: "noWrap",
              "&:hover": {
                color: palette + "bgColorButton",
                textDecorationColor: palette + "bgColorButton",
              },
            }}
            // Touch up the internal state to match the navigation
            onClick={(e) => setSearchQuery(query)}
            // do the navigation
            to={hrefFor(region, query)}
            /* component={RouterLink} */ // Ensure you import RouterLink from react-router-dom
          >
            {translationState.translation[query]}
          </LinkMui>
        ))}
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          display: { xs: "flex", lg: "none" },
        }}
      >
        <Typography
          variant="body2"
          alignItems={"start"}
          display={{ xs: "flex", lg: "none" }}
          sx={{ color: "#BDC7DB", my: 2 }}
        >
          <LightbulbOutlinedIcon sx={{ color: "#F8BB27" }} />
          {translationState.translation["Pro Tip"]}
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        lg={8}
        sx={{
          display: { xs: "flex", lg: "none" },
        }}
        alignItems="center"
      >
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
            sendMatomoEvent(region);
            handleSubmit();
          }}
        >
          {translationState.translation["Search"]}
        </Button>
      </Grid>
      <Grid
        item
        display={{ xs: "flex", lg: "flex" }}
        justifyContent={{ xs: "center", lg: "end" }}
        xs={12}
        lg={2}
      >
        <LinkMui
          sx={{
            color: palette + "bgColorButton",
            textDecoration: "none",
            cursor: "pointer",
            transition: "transform 0.3s",
            "&:hover": {
              transform: "scale(1.1)",
            },
          }}
          onClick={() => searchAdvancedSearch("CreativeWork")}
          /* component={RouterLink} */
        >
          <Typography variant="subtitle1" noWrap>
            Advanced
          </Typography>
        </LinkMui>
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
    sendMatomoEvent,
    handleSubmit,
    changeTranslation,
    url,
    uri,
    searchType,
    resultCount,
    facets,
    languageIcon,
  } = props;
  const [openAdvancedSearch, setOpenAdvancedSearch] = useState(false);
  const [openTooltip, setOpenTooltip] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const palette = "custom.resultPage.searchBar.";

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const accordionOpenParam = searchParams.get("accordionOpen");

    setOpenAdvancedSearch(accordionOpenParam === "true");

    searchParams.delete("accordionOpen");
  }, [location.search, navigate]);
  const handleCopyToClipboard = async () => {
    var currentUrl = window.location.href;
    await navigator.clipboard.writeText(currentUrl);
    setOpenTooltip(true);
    setTimeout(() => {
      setOpenTooltip(false);
    }, 2000);
  };

  return (
    <>
      <Container
        maxWidth="lg"
        sx={{
          backgroundColor: "transparent",
        }}
      >
        {openAdvancedSearch && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              zIndex: 1,
            }}
          ></Box>
        )}
        <Grid container mt={6} sx={{ position: "relative", zIndex: 2 }}>
          <Grid item container>
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
                    <Grid container>
                      <Grid item xs={12} lg={12}>
                        <InputLabel disabled></InputLabel>
                        <Select
                          startAdornment={
                            <PublicIcon
                              sx={{
                                marginRight: 1,
                                color: openAdvancedSearch
                                  ? "rgba(0, 0, 0, 0.3)"
                                  : palette + "iconsColor",
                              }}
                            />
                          }
                          disabled={openAdvancedSearch}
                          defaultValue={
                            region.charAt(0).toUpperCase() + region.slice(1)
                          }
                          fullWidth
                          sx={{
                            backgroundColor: {
                              xs: "transparent",
                              lg: palette + "bgColorSelectDesktop",
                            },
                            color: palette + "iconsColor",
                            fontWeight: 600,
                            borderBottomRightRadius: 0,
                            borderTopRightRadius: 0,
                            ".MuiOutlinedInput-notchedOutline": {
                              borderRight: { lg: "none" },
                              borderWidth: { xs: 0, lg: "1px" },
                            },
                            ".MuiSelect-icon": {
                              color: palette + "iconsColor",
                            },
                            "&.Mui-disabled": {
                              backgroundColor: "rgba(0, 0, 0, 0.12)",
                            },
                            width: { xs: "100%", lg: "132px" },
                          }}
                          onChange={(e) => {
                            setRegion(e.target.value);
                            sendMatomoEvent(e.target.value);
                          }}
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
                    disabled={openAdvancedSearch}
                    sx={{
                      backgroundColor: {
                        xs: openAdvancedSearch
                          ? "rgba(0, 0, 0, 0.12)"
                          : palette + "bgColorTextfieldMobile",
                        lg: openAdvancedSearch
                          ? "rgba(0, 0, 0, 0.12)"
                          : palette + "bgColorSelectDesktop",
                      },
                      "& .MuiFormLabel-root": {
                        fontSize: { xs: "14px", lg: "16px" },
                        color: palette + "colorTextfield",
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
                              color: openAdvancedSearch
                                ? "rgba(0, 0, 0, 0.3)"
                                : palette + "searchIcon",
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
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        sendMatomoEvent(region);
                        handleSubmit();
                      }
                    }}
                  />
                </Box>

                {/* <Typography
                  variant="body2"
                  alignItems={"start"}
                  display={{ xs: "flex", lg: "none" }}
                  sx={{ color: palette + "colorTextProTip", my: 2 }}
                >
                  <LightbulbOutlinedIcon
                    sx={{ color: palette + "iconProtip" }}
                  />
                  {translationState.translation["Pro Tip"]}
                </Typography> */}
                <Button
                  variant="contained"
                  disableElevation
                  disabled={openAdvancedSearch}
                  sx={{
                    borderRadius: 2,
                    width: { xs: "100%", lg: "15%" },
                    backgroundColor: palette + "bgColorButton",
                    textTransform: "none",
                    height: { xs: "40px", lg: "56px" },
                  }}
                  onClick={() => {
                    sendMatomoEvent(region);
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
                    color: palette + "colorTextfield",
                    marginLeft: 3,
                    textTransform: "none",
                    fontSize: "12px",
                    whiteSpace: "noWrap",
                    fontWeight: 600,
                    margin: "0 auto",
                    lineHeight: "18px",
                    whiteSpace: "normal",

                    width: { xs: "100%", lg: "20%" },
                    marginBottom: { xs: "10px", lg: 0 },
                    padding: 0,
                  }}
                  onClick={() => setOpenAdvancedSearch(!openAdvancedSearch)}
                >
                  {!openAdvancedSearch
                    ? translationState.translation["Show advanced"]
                    : translationState.translation["Hide advanced"]}
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} lg={0} display={{ xs: "block", lg: "none" }}>
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
                <AccordionDetails sx={{ padding: 0 }}>
                  <AdvancedSearch
                    setSearchQuery={setSearchQuery}
                    searchQuery={searchQuery}
                    facets={facets && facets}
                  />
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid
              item
              xs={12}
              lg={4}
              display={"flex"}
              alignItems={"center"}
              justifyContent={{ xs: "space-between", lg: "flex-end" }}
              sx={{ gap: 1 }}
            >
              <Tooltip
                PopperProps={{
                  disablePortal: true,
                }}
                open={openTooltip}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                title="The URL has been copied to the clipboard"
              >
                <IconButton
                  aria-label="share"
                  onClick={() => handleCopyToClipboard()}
                >
                  <ShareIcon
                    sx={{
                      color: palette + "colorTextfield",
                    }}
                  />
                </IconButton>
              </Tooltip>

              <Box display={"flex"} alignItems={"center"} gap={2}>
                <Export
                  palette={palette}
                  uri={uri}
                  searchType={searchType}
                  resultCount={resultCount}
                />
                <Box sx={{ width: "100px", display: "flex" }}>
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
                      color: palette + "iconsColor",
                      fontWeight: 600,
                      borderRadius: 1,
                      height: "34px",
                      width: "70px",
                      ".MuiSelect-outlined": {
                        overflow: "unset",
                      },
                      ".MuiOutlinedInput-notchedOutline": {
                        borderColor: palette + "borderColorSelect",
                        borderRight: 0,
                      },
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
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
                  <Box
                    sx={{
                      width: "30px",
                      border: "1px solid",
                      borderColor: palette + "borderColorSelect",
                      borderTopRightRadius: 3,
                      borderBottomRightRadius: 3,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Avatar src={languageIcon} sx={{ width: 20, height: 20 }} />
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
          {/* <Grid item xs={0} lg={7} display={{ xs: "none", lg: "block" }}>
            <Typography
              variant="body2"
              alignItems={"start"}
              display={{ xs: "none", lg: "flex" }}
              sx={{ color: palette + "colorTextProTip", mt: 1 }}
            >
              <LightbulbOutlinedIcon sx={{ color: palette + "iconProtip" }} />
              {translationState.translation["Pro Tip"]}
            </Typography>
          </Grid> */}
          <Grid item xs={0} lg={12} display={{ xs: "none", lg: "block" }}>
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
                  facets={facets && facets}
                />
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};
