import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useAppTranslation } from "context/context/AppTranslation";
import Alert from "@mui/material/Alert";
import { CATEGORIES, PROMOTED_REGIONS } from "portability/configuration";
import {
  fieldTitleFromName,
  searchAdvanced,
  useSearchParam,
} from "utilities/generalUtility";
import { dataServiceUrl } from "config/environment";
import { useNavigate } from "react-router-dom";
import PublicIcon from "@mui/icons-material/Public";
import MobileAS from "./MobileAS";
import DesktopAS from "./DesktopAS";

const initialState = {
  0: {
    category: "Topic",
    value: "Documents",
    region: "Global",
  },
  1: [
    {
      id: 0,
      category: "Provider",
      operator: "Contains",
      textfield: "",
    },
  ],
};

const AdvancedSearch = (props) => {
  const { setSearchQuery, searchQuery, facets } = props;
  const palette = "custom.resultPage.searchBar.advancedSearch.";
  const translationState = useAppTranslation();
  const [facetsToShow, setFacetsToShow] = useState(facets);
  const [alertMessage, setAlertMessage] = useState("");
  const [sort, setSort] = useSearchParam("sort");
  const [isClear, setIsClear] = useState(false);
  const [searchAdvancedQuery, setSearchAdvancedQuery] = useState(initialState);
  const navigate = useNavigate();
  const [region, setRegion] = useSearchParam("region", "global");

  useEffect(() => {
    if (isClear) {
      setSearchAdvancedQuery(initialState);
      setIsClear(false);
    }
  }, [isClear]);

  const changeTopic = (topic) => {
    const idTopic = CATEGORIES.find((c) => c.text === topic).id;
    let URI = `${dataServiceUrl}/search?`;
    URI += "document_type=" + idTopic + "&";
    URI += "&start=0&rows=10";
    fetch(URI)
      .then((response) => response.json())
      .then((json) => {
        setFacetsToShow(json.facets.filter((facet) => facet.counts.length > 0));
      });
  };

  function checkTextfieldsValidity(data) {
    for (const key in data) {
      if (Array.isArray(data[key])) {
        for (const item of data[key]) {
          if (item.textfield === "") {
            return false;
          }
        }
      } else if (typeof data[key] === "object" && data[key] !== null) {
        if (!checkTextfieldsValidity(data[key])) {
          return false;
        }
      }
    }
    return true;
  }

  const showCorrectSubFacets = (category) => {
    const correctFacet = facetsToShow.filter((f) => {
      const title = fieldTitleFromName(f.name);
      if (category === title) {
        return f;
      }
    });

    return correctFacet[0].counts.map((c) => {
      return {
        label: c.name,
        value: c.name,
      };
    });
  };

  useEffect(() => {
    changeTopic("Documents");
  }, []);

  const createSearchQuery = () => {
    const isValid = checkTextfieldsValidity(searchAdvancedQuery);

    if (isValid) {
      setAlertMessage("");
      const [searchQueryBuild, facetQuery] =
        searchAdvanced(searchAdvancedQuery);
      console.log(facetQuery);
      const idTabName = CATEGORIES.find(
        (c) => c.text === searchAdvancedQuery[0].value
      ).id;

      const regionValue = searchAdvancedQuery[0].region;

      setSearchQuery(searchQueryBuild);
      console.log(searchAdvancedQuery);
      const hrefFor = (region, query) =>
        `/results/${idTabName}?${new URLSearchParams({
          ...(query ? { fq: query } : {}),
          ...(sort ? { sort: sort } : {}),
          ...(region && region.toUpperCase() !== "GLOBAL" ? { region } : {}),
        })}&advancedSearch=true`;
      localStorage.setItem(
        "lastOperationUser",
        localStorage.getItem("operationUser")
          ? localStorage.getItem("operationUser")
          : ""
      );
      localStorage.setItem("operationUser", "advancedSearch");
      navigate(hrefFor(regionValue, facetQuery));
    } else {
      setAlertMessage("Please fill all field before starting a search");
    }
  };

  return (
    <>
      <Grid item container gap={1} sx={{ mt: 2 }}>
        <Grid item xs={12} lg={8}>
          <Box sx={{ backgroundColor: palette + "bgBox", padding: "10px" }}>
            <Typography
              variant="body1"
              alignItems={"start"}
              sx={{
                color: palette + "colorTextProTip",
                fontWeight: 700,
                fontSize: "14px",
              }}
            >
              {translationState.translation["AndOR"]}
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          lg={12}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: 1,
            flexWrap: "wrap",
          }}
        >
          <Typography
            variant="body1"
            alignItems={"start"}
            sx={{
              color: palette + "colorTypography",
              fontWeight: 700,
              fontSize: "16px",
            }}
          >
            Search for:
          </Typography>
          <Box sx={{ display: "flex", gap: "20px" }}>
            <Select
              defaultValue="Documents"
              sx={{
                color: palette + "colorTypography",
                fontWeight: 600,
                borderRadius: 1,
                height: "30px",
                maxWidth: "9.5rem",
                minWidth: "9.5rem",
              }}
              onChange={(e) => {
                const resetObj = {
                  0: {
                    category: "Topic",
                    value: e.target.value,
                  },
                  1: [
                    {
                      id: 0,
                      category: "Provider",
                      operator: "Contains",
                      textfield: "",
                    },
                  ],
                };
                changeTopic(e.target.value);
                setSearchAdvancedQuery(resetObj);
              }}
            >
              {CATEGORIES.map(
                (c, index) =>
                  c.text !== "Spatial Search" && (
                    <MenuItem key={index} value={c.text}>
                      {translationState.translation[c.text]}
                    </MenuItem>
                  )
              )}
            </Select>
            <Select
              startAdornment={
                <PublicIcon
                  sx={{
                    marginRight: 1,
                    fontSize: "14px",
                  }}
                />
              }
              defaultValue={region.charAt(0).toUpperCase() + region.slice(1)}
              name="searchRegion"
              onChange={(e) => {
                const updatedSearchAdvancedQuery = {
                  ...searchAdvancedQuery,
                  0: {
                    ...searchAdvancedQuery[0],
                    region: e.target.value,
                  },
                };
                setSearchAdvancedQuery(updatedSearchAdvancedQuery);
              }}
              sx={{
                color: palette + "colorTypography",
                fontWeight: 600,
                borderRadius: 1,
                height: "30px",
                maxWidth: "9.5rem",
                minWidth: "9.5rem",
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
          </Box>
        </Grid>
        <Grid
          item
          container
          columnGap={1}
          rowGap={1}
          lg={8}
          display={{ xs: "flex", lg: "flex" }}
          alignItems={"center"}
        >
          {Object.keys(searchAdvancedQuery).map((id, index) => {
            if (id !== "0") {
              return (
                <Grid key={index} item xs={12} lg={12}>
                  <MobileAS
                    index={index}
                    searchAdvancedQuery={searchAdvancedQuery}
                    id={id}
                    setSearchAdvancedQuery={setSearchAdvancedQuery}
                    facetsToShow={facetsToShow}
                    showCorrectSubFacets={showCorrectSubFacets}
                  />
                  <DesktopAS
                    index={index}
                    searchAdvancedQuery={searchAdvancedQuery}
                    id={id}
                    setSearchAdvancedQuery={setSearchAdvancedQuery}
                    facetsToShow={facetsToShow}
                    showCorrectSubFacets={showCorrectSubFacets}
                  />
                </Grid>
              );
            }
          })}
          {alertMessage && (
            <Grid item xs={12}>
              <Alert severity="error">{alertMessage}</Alert>
            </Grid>
          )}
          <Grid
            item
            xs={12}
            display={"flex"}
            flexDirection={{ xs: "column", lg: "row" }}
            sx={{ width: "100%", mb: { xs: 2, lg: "unset" }, mt: 2 }}
          >
            <Button
              variant="contained"
              disableElevation
              onClick={createSearchQuery}
              sx={{
                borderRadius: 2,
                backgroundColor: palette + "buttonBgColor",
                textTransform: "none",
              }}
            >
              {translationState.translation["Search"]}
            </Button>
            <Button
              variant="text"
              disableElevation
              onClick={() => setIsClear(true)}
              sx={{
                color: palette + "clearButtonColor",
                textTransform: "none",
                fontSize: "14px",
                padding: 0,
              }}
            >
              {translationState.translation["Clear"]}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default AdvancedSearch;
