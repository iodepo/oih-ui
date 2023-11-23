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
import { fieldTitleFromName } from "../../constants";
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
                  color: "#7B8FB7",
                  justifyContent: "space-between",
                }}
              >
                {title}
                <FilterListIcon />
              </Toolbar>
              <List>
                {facet.counts.map((facetCount) => (
                  <ListItem key={facetCount.name} disablePadding>
                    <ListItemButton
                      selected={selectedProvider === facetCount.name}
                      sx={{
                        justifyContent: "space-between",
                        "&.Mui-selected": {
                          backgroundColor: "#F6F8FA",
                          borderLeft: 4,
                          borderColor: "#40AAD3",
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
                        className={facet.name}
                        primary={facetCount.name}
                      />
                      <Chip
                        sx={{ minWidth: "60px", fontSize: "12px" }}
                        label={facetCount.count}
                      />
                    </ListItemButton>
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

  return (
    <>
      {/* Start Topics */}
      <Toolbar
        disableGutters
        sx={{
          fontWeight: 700,
          color: "#7B8FB7",
          justifyContent: "space-between",
        }}
      >
        Topic
        <FilterListIcon />
      </Toolbar>
      <Divider />

      <List>
        {tabList.map((tab, index) => (
          <ListItem key={tab.title} disablePadding>
            <ListItemButton
              selected={tab.title === searchType}
              sx={{
                justifyContent: "space-between",
                "&.Mui-selected": {
                  backgroundColor: "#F6F8FA",
                  borderLeft: 4,
                  borderColor: "#2B498C",
                },
              }}
              onClick={changeSearchType(tab.title)}
            >
              <ListItemText
                primaryTypographyProps={{
                  noWrap: true,
                  variant: "subtitle2",
                }}
                primary={translationState.translation[tab.tab_name]}
              />
              <Chip
                sx={{ minWidth: "50px" }}
                label={formatter.format(counts[tab.title] || 0)}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {/* End Topics */}
      {/* Start Facets */}
      {facets.length > 0 && (
        <>
          {facets.map((facet, i) => {
            return drawFacets(facet, i);
          })}
          {/* <Toolbar
            disableGutters
            sx={{
              fontWeight: 700,
              color: "#7B8FB7",
              justifyContent: "space-between",
            }}
          >
            Provider
            <FilterListIcon />
          </Toolbar>
          <List>
            {[
              "AcquaDocs",
              "Ocean Best Practices",
              "Better Biomolecular Organization",
            ].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton
                  selected={selectedProvider === text ? true : false}
                  sx={{
                    justifyContent: "space-between",
                    "&.Mui-selected": {
                      backgroundColor: "#F6F8FA",
                      borderLeft: 4,
                      borderColor: "#40AAD3",
                    },
                  }}
                  onClick={() => setSelectedProvider(text)}
                >
                  <ListItemText
                    primaryTypographyProps={{
                      noWrap: true,
                      variant: "subtitle2",
                    }}
                    primary={text}
                  />
                  <Chip sx={{ minWidth: "60px" }} label={"4184"} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Toolbar
            disableGutters
            sx={{
              fontWeight: 700,
              color: "#7B8FB7",
              justifyContent: "space-between",
            }}
          >
            Keywords
            <FilterListIcon />
          </Toolbar>
          <Box p={1}>
            <TextField
              sx={{
                backgroundColor: "#ffffff",
                "& .MuiFormLabel-root": {
                  fontSize: "12px",
                  color: "#7B8FB7",
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
              label="Search..."
            />
          </Box>
          <List>
            {["Iran", "Biology", "Fisheries", "Aquaculture"].map((value) => {
              const labelId = `checkbox-list-label-${value}`;

              return (
                <ListItem key={value} disablePadding>
                  <ListItemButton role={undefined} dense>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={value} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
          <Toolbar
            disableGutters
            sx={{
              gap: 1,
            }}
          >
            <AddCircleOutlineOutlinedIcon
              sx={{
                color: "#7B8FB7",
              }}
            />{" "}
            More Keywords
          </Toolbar>
          <Toolbar
            disableGutters
            sx={{
              fontWeight: 700,
              color: "#7B8FB7",
              justifyContent: "space-between",
            }}
          >
            Contributor
            <FilterListIcon />
          </Toolbar>
          <Box p={1}>
            <TextField
              sx={{
                backgroundColor: "#ffffff",
                "& .MuiFormLabel-root": {
                  fontSize: "12px",
                  color: "#7B8FB7",
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
              label="Search..."
            />
          </Box>
          <List>
            {["Iran", "Biology", "Fisheries", "Aquaculture"].map((value) => {
              const labelId = `checkbox-list-label-${value}`;

              return (
                <ListItem key={value} disablePadding>
                  <ListItemButton role={undefined} dense>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={value} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
          <Toolbar
            disableGutters
            sx={{
              gap: 1,
            }}
          >
            <AddCircleOutlineOutlinedIcon
              sx={{
                color: "#7B8FB7",
              }}
            />
            More Contributor
          </Toolbar> */}
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
          color: "#ffffff",
        }}
      >
        Apply
      </Button>
    </>
  );
};

export default FilterBy;
