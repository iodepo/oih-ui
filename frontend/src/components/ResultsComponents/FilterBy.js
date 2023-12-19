import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import React, { useCallback, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import Checkbox from "@mui/material/Checkbox";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import Divider from "@mui/material/Divider";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import ListItemIcon from "@mui/material/ListItemIcon";
import Button from "@mui/material/Button";
import { useAppTranslation } from "ContextManagers/context/AppTranslation";
import { fieldTitleFromName } from "../configuration/constants";
import GenericFacet from "./GenericFacet";
import Tooltip from "@mui/material/Tooltip";

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
    facetValues, //Look FacetsFullWidth
    setFacetFacetValues,
    isMobile,
  } = props;

  const changeSearchType = (type) => (event) => {
    clearFacetQuery();
    resetDefaultSearchUrl(type);
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

  const drawFacets = (facet, i) => {
    const title = fieldTitleFromName(facet.name);
    if (title) {
      switch (title) {
        case "Provider":
          return (
            <>
              <Toolbar
                disableGutters
                sx={{
                  fontWeight: 700,
                  color: palette + "categoryColor",
                  justifyContent: "space-between",
                }}
              >
                {title}
                <FilterListIcon />
              </Toolbar>
              <List>
                {facet.counts.map((facetCount) => (
                  <ListItem key={facetCount.name} disablePadding>
                    <Tooltip
                      title={facetCount.name}
                      sx={{
                        display: facetCount.name.length < 15 ? "none" : "flex",
                      }}
                      placement="right"
                      arrow
                    >
                      <ListItemButton
                        selected={selectedProvider === facetCount.name}
                        sx={{
                          justifyContent: "space-between",
                          height: "35px",
                          "&.Mui-selected": {
                            backgroundColor:
                              palette + "categorySelectedBgColor",
                            borderLeft: 4,
                            borderColor:
                              palette + "providerSelectedBorderColor",
                          },
                        }}
                        //value={facetCount.value || facetCount.name}
                        onClick={() => {
                          if (selectedProvider === facetCount.name) {
                            clear();
                            setSelectedProvider("");
                          } else {
                            setValue(i, facetCount.name);
                            facetSearch(facet.name, facetCount.name);
                            setSelectedProvider(facetCount.name);
                          }
                        }}
                      >
                        <ListItemText
                          primaryTypographyProps={{
                            noWrap: true,
                            variant: "subtitle2",
                          }}
                          sx={{ marginRight: "10px" }}
                          className={facet.name}
                          primary={facetCount.name}
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
                          label={facetCount.count}
                        />
                      </ListItemButton>
                    </Tooltip>
                  </ListItem>
                ))}
              </List>
            </>
          );

        default:
          return (
            <GenericFacet
              facet={facet}
              i={i}
              title={title}
              setValue={setValue}
              facetSearch={facetSearch}
              clear={clear}
            />
          );
      }
    }
  };

  const [selectedProvider, setSelectedProvider] = useState("");
  const translationState = useAppTranslation();

  const palette = "custom.resultPage.filters.";
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
        Topic
        <FilterListIcon />
      </Toolbar>
      <Divider />

      <List>
        {tabList.map((tab, index) => (
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
              onClick={changeSearchType(tab.id)}
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
        ))}
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
        sx={{
          display: { xs: "block", lg: "none" },
          borderRadius: 1,
          fontWeight: 700,
          textTransform: "none",
          color: palette + "colorButtonMobile",
        }}
      >
        Apply
      </Button>
    </>
  );
};

export default FilterBy;
