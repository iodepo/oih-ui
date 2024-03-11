import Box from "@mui/material/Box";
import React, { useCallback, useState, useEffect } from "react";
import Divider from "@mui/material/Divider";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import { useAppTranslation } from "context/context/AppTranslation";
import { fieldTitleFromName } from "utilities/generalUtility";
import GenericFacet from "./GenericFacet";

const formatter = Intl.NumberFormat([], { notation: "compact" });

const FilterBy = (props) => {
  const {
    tabList,
    counts,
    searchType,
    resetDefaultSearchUrl,
    clearFacetQuery,
    facets,
    facetSearch,
    setFilterChosenMobile,
    filterChosenMobile,
    facetQuery,
    clear,
    facetSearchMobile,
  } = props;

  const changeSearchType = (type) => {
    clearFacetQuery();
    resetDefaultSearchUrl(type);
  };

  const addQueryMobile = (name, value) => {
    const clickedFacetQuery = new URLSearchParams({
      facetType: name,
      facetName: value,
    }).toString();
    setQueryMobile([queryMobile, clickedFacetQuery].filter((e) => e).join("&"));
  };

  const drawFacets = (facet, i) => {
    const title = fieldTitleFromName(facet.name);
    if (title) {
      return (
        <GenericFacet
          setFilterChosenMobile={setFilterChosenMobile}
          filterChosenMobile={filterChosenMobile}
          facet={facet}
          i={i}
          title={title}
          facetSearch={facetSearch}
          clear={clear}
          isClearAll={isClearAll}
          setIsClearAll={setIsClearAll}
          facetQuery={facetQuery}
          addQueryMobile={addQueryMobile}
          selectedFacetsMobile={selectedFacetsMobile}
          setSelectedFacetsMobile={setSelectedFacetsMobile}
        />
      );
    }
  };

  const applyFiltersMobile = () => {
    setFilterChosenMobile([...filterChosenMobile, ...selectedFacetsMobile]);
    facetSearchMobile(queryMobile);
  };
  const translationState = useAppTranslation();
  const palette = "custom.resultPage.filters.";
  const [isClearAll, setIsClearAll] = useState(false);
  const [queryMobile, setQueryMobile] = useState("");

  const [selectedFacetsMobile, setSelectedFacetsMobile] = useState([]);

  useEffect(() => {
    if (filterChosenMobile.length > 0 && facetQuery) {
      const pairs = facetQuery.split("&");

      const extractedPairs = [];

      for (let i = 0; i < pairs.length; i += 2) {
        const facetType = pairs[i].split("=")[1];
        const facetName = decodeURIComponent(
          pairs[i + 1].split("=")[1].replaceAll("+", " ")
        );
        const find = filterChosenMobile.find(
          (f) => f.type === facetType && f.text === facetName
        );
        if (!find) extractedPairs.push({ type: facetType, text: facetName });
      }
      if (extractedPairs.length > 0)
        setFilterChosenMobile([...filterChosenMobile, ...extractedPairs]);
    }
  }, [filterChosenMobile]);

  return (
    <>
      {/* Start Topics */}
      <Toolbar
        disableGutters
        sx={{
          fontWeight: 700,
          color: palette + "categoryColor",
          justifyContent: "space-between",
        }}
      >
        {translationState.translation["Topic"]}
      </Toolbar>
      <Divider />

      <List>
        {tabList.map((tab, index) => {
          if (tab.id !== "SpatialData")
            return (
              <ListItem key={tab.id} disablePadding>
                <ListItemButton
                  selected={tab.id === searchType}
                  sx={{
                    justifyContent: "space-between",
                    height: "35px",
                    "&.Mui-selected": {
                      backgroundColor: palette + "categorySelectedBgColor",
                      borderLeft: 4,
                      borderColor: palette + "topicSelectedBorderColor",
                    },
                  }}
                  onClick={() => {
                    changeSearchType(tab.id);
                    const updatedItems = filterChosenMobile.map((f) => {
                      if (f.type === "searchType") {
                        return {
                          ...f,
                          text: tab.text,
                        };
                      }
                      return f;
                    });

                    setFilterChosenMobile(updatedItems);
                  }}
                >
                  <ListItemText
                    primaryTypographyProps={{
                      noWrap: true,
                      variant: "subtitle2",
                    }}
                    sx={{ marginRight: "10px" }}
                    primary={translationState.translation[tab.text]}
                  />
                  <Chip
                    sx={{
                      background: palette + "bgColorChip",
                      height: "20px",
                      fontSize: "12px",
                      borderRadius: "12px",
                      ".MuiChip-label": {
                        padding: "5px",
                        color: palette + "labelChipColor",
                      },
                    }}
                    label={formatter.format(counts[tab.id] || 0)}
                  />
                </ListItemButton>
              </ListItem>
            );
        })}
      </List>
      {/* End Topics */}
      {/* Start Facets */}
      {facets.length > 0 && (
        <>
          {facets
            .sort((a, b) =>
              a.name === "txt_provider" ? -1 : b.name === "txt_provider" ? 1 : 0
            )
            .map((facet, i) => {
              return <Box key={i}>{drawFacets(facet, i)}</Box>;
            })}
        </>
      )}

      {/* End Facets */}
      <Button
        variant="contained"
        fullWidth
        disableElevation
        onClick={() => applyFiltersMobile()}
        sx={{
          display: { xs: "block", lg: "none" },
          borderRadius: 1,
          fontWeight: 700,
          textTransform: "none",
          color: palette + "colorButtonMobile",
        }}
      >
        {translationState.translation["Apply"]}
      </Button>

      {facetQuery && (
        <Button
          variant="contained"
          fullWidth
          disableElevation
          sx={{
            display: { xs: "none", lg: "block" },
            borderRadius: 1,
            fontWeight: 700,
            textTransform: "none",
            marginTop: 1,
            backgroundColor: palette + "colorButtonDesktop",
          }}
          onClick={() => {
            clearFacetQuery();
            setIsClearAll(true);
          }}
        >
          {translationState.translation["Clear"]}
        </Button>
      )}
    </>
  );
};

export default FilterBy;
