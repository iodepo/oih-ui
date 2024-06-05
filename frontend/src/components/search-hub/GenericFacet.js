import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useAppTranslation } from "context/context/AppTranslation";
import { fieldTitleFromName } from "utilities/generalUtility";
import { useMediaQuery, useTheme } from "@mui/material";

const GenericFacet = (props) => {
  const {
    facet,
    i,
    title,
    facetSearch,
    clear,
    setMobileAppliedFilters,
    mobileAppliedFilters,
    isClearAll,
    setIsClearAll,
    facetQuery,
    addQueryMobile,
    setMobileSelectedFiltersTemp,
  } = props;
  const [searchInput, setSearchInput] = useState("");
  const [filteredFacet, setFilteredFacet] = useState(facet.counts);
  const [numberToShow, setNumberToShow] = useState(5);
  const [selectedFacets, setSelectedFacets] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState("Counts DESC");

  const handleSelectedOrder = (order, facets) => {
    switch (order) {
      case "Counts DESC":
        setFilteredFacet(facets.sort((a, b) => b.count - a.count));
        setSelectedOrder("Counts DESC");
        break;
      case "Counts ASC":
        setFilteredFacet(facets.sort((a, b) => a.count - b.count));
        setSelectedOrder("Counts ASC");
        break;
      case "Name ASC":
        setFilteredFacet(
          facets.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
          })
        );
        setSelectedOrder("Name ASC");
        break;
      case "Name DESC":
        setFilteredFacet(
          facets.sort((a, b) => {
            if (a.name > b.name) return -1;
            if (a.name < b.name) return 1;
            return 0;
          })
        );
        setSelectedOrder("Name DESC");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (facet.counts) handleSelectedOrder(selectedOrder, facet.counts);
  }, [facet.counts]);

  const handleInputChange = (value, facetLists) => {
    const input = value;
    setSearchInput(input);

    const filtered = facetLists.filter((list) =>
      list.name.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredFacet(filtered);
  };

  const handleShowMoreClick = () => {
    setNumberToShow((prev) => prev + 5);
  };

  const isChecked = (name) => {
    if (selectedFacets.length > 0) {
      return selectedFacets.includes(name);
    }
    return false;
  };

  useEffect(() => {
    if (isClearAll) {
      setSelectedFacets([]);
      setSearchInput("");
      setFilteredFacet(facet.counts);
      setIsClearAll(false);
    }
  }, [isClearAll]);

  useEffect(() => {
    setSelectedFacets([]);

    if (facetQuery) {
      const pairs = facetQuery.split(" AND ");
      const extractedPairs = [];

      pairs.forEach((p) => {
        const temp = p.replace(/^\(|\)$/g, "");
        const tempPairs = temp.split(" OR ");
        tempPairs.forEach((t) => {
          const splitted = t.split(":");
          const facetType = splitted[0];
          if (fieldTitleFromName(facetType) === title) {
            const facetName = splitted[1].replace(/"/g, "");
            extractedPairs.push(facetName);
          }
        });
      });

      setSelectedFacets(extractedPairs);
    }
  }, [facetQuery, title]);
  const translationState = useAppTranslation();
  const palette = "custom.resultPage.filters.";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <>
      <Toolbar
        disableGutters
        sx={{
          fontWeight: 700,
          color: palette + "categoryColor",
          justifyContent: "space-between",
          gap: "28px",
        }}
      >
        {translationState.translation[title] || title}

        <Select
          startAdornment={
            <FilterListIcon
              sx={{
                marginRight: 1,
                color: palette + "iconsColor",
                fontSize: "12px",
              }}
            />
          }
          sx={{ fontSize: "12px", height: "25px" }}
          value={selectedOrder}
          onChange={(e) => handleSelectedOrder(e.target.value, filteredFacet)}
        >
          <MenuItem value={"Name DESC"}>Name ↓</MenuItem>
          <MenuItem value={"Name ASC"}>Name ↑</MenuItem>
          <MenuItem value={"Counts ASC"}>Counts ↑</MenuItem>
          <MenuItem value={"Counts DESC"}>Counts ↓</MenuItem>
        </Select>
      </Toolbar>
      <Box>
        <TextField
          fullWidth
          size="small"
          value={searchInput}
          sx={{
            backgroundColor: palette + "bgTextfield",
            "& .MuiFormLabel-root": {
              fontSize: "12px",
              color: palette + "categoryColor",
            },
            borderRadius: 1,
          }}
          onChange={(e) => handleInputChange(e.target.value, facet.counts)}
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
          label={translationState.translation["Search"] + "..."}
        />
      </Box>
      <List>
        {filteredFacet.slice(0, numberToShow).map((facetCount) => {
          const value = facetCount.value || facetCount.name;
          const labelId = `checkbox-list-label-${value}`;
          return (
            <ListItem key={value} disablePadding>
              <Tooltip
                arrow
                placement="right"
                title={value}
                sx={{
                  display: value.length < 15 ? "none" : "flex",
                }}
              >
                <ListItemButton sx={{ display: "flex" }} dense>
                  <ListItemIcon sx={{ minWidth: 0 }}>
                    <Checkbox
                      edge="start"
                      tabIndex={-1}
                      checked={isChecked(value)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const updatedCheckedItems = e.target.checked
                          ? [...selectedFacets, value]
                          : selectedFacets.filter((item) => item !== value);

                        setSelectedFacets(updatedCheckedItems);
                        !isMobile && facetSearch(facet.name, value, checked);
                        if (!checked) {
                          setMobileAppliedFilters((f) =>
                            f.filter((d) => d.type !== title.toLowerCase())
                          );
                        } else {
                          if (isMobile) {
                            addQueryMobile(facet.name, value);
                            setMobileSelectedFiltersTemp((prev) => [
                              ...prev,
                              {
                                type: facet.name,
                                text: value,
                              },
                            ]);
                          } else {
                            const isGenericFilterSet =
                              mobileAppliedFilters.find(
                                (f) => f.type === value
                              );
                            if (isGenericFilterSet ?? true)
                              setMobileAppliedFilters((prev) => [
                                ...prev,
                                {
                                  type: facet.name,
                                  text: value,
                                },
                              ]);
                          }
                        }
                      }}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      noWrap: true,
                      variant: "subtitle2",
                    }}
                    id={labelId}
                    className={facet.name}
                    sx={{ fontSize: "12px", marginRight: "10px" }}
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
          );
        })}
      </List>
      {searchInput === "" && filteredFacet.length > 5 && (
        <Toolbar
          disableGutters
          sx={{
            gap: 1,
          }}
        >
          <IconButton onClick={handleShowMoreClick}>
            <ArrowCircleDownIcon
              sx={{
                color: palette + "categoryColor",
              }}
            />
          </IconButton>
          {translationState.translation["Show more"]}
        </Toolbar>
      )}
    </>
  );
};

export default GenericFacet;
