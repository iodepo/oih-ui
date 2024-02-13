import Box from "@mui/material/Box";
import React, { useCallback, useState } from "react";
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
    facetValues,
    setFacetFacetValues,
    isMobile,
    setFilterChosenMobile,
    filterChosenMobile,
    selectedProvider,
    setSelectedProvider,
    facetQuery,
  } = props;

  const changeSearchType = (type) => {
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
      /* Old version PROVIDER */
      /*  switch (title) {
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
                {translationState.translation[title] || title}
                <FilterListIcon />
              </Toolbar>
              <List>
                {facet.counts.slice(0, numberToShow).map((facetCount) => (
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
                            setFilterChosenMobile((f) =>
                              f.filter((d) => d.type !== "provider")
                            );
                          } else {
                            setValue(i, facetCount.name);
                            facetSearch(facet.name, facetCount.name);
                            setSelectedProvider(facetCount.name);
                            const isProviderFilterSet = filterChosenMobile.find(
                              (f) => f.type === "provider"
                            );
                            if (isProviderFilterSet ?? true)
                              setFilterChosenMobile((prev) => [
                                ...prev,
                                { type: "provider", text: facetCount.name },
                              ]);
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
              {facet.counts.length > 5 && (
                <Toolbar
                  disableGutters
                  sx={{
                    gap: 1,
                  }}
                >
                  <IconButton onClick={handleShowMoreClick}>
                    <AddCircleOutlineOutlinedIcon
                      sx={{
                        color: palette + "categoryColor",
                      }}
                    />
                  </IconButton>
                  {translationState.translation["Add more"]}
                </Toolbar>
              )}
            </>
          );

        default:
          return (
            <GenericFacet
              setFilterChosenMobile={setFilterChosenMobile}
              filterChosenMobile={filterChosenMobile}
              facet={facet}
              i={i}
              title={title}
              setValue={setValue}
              facetSearch={facetSearch}
              clear={clear}
              isClearAll={isClearAll}
              setIsClearAll={setIsClearAll}
            />
          );
      } */
      return (
        <GenericFacet
          setFilterChosenMobile={setFilterChosenMobile}
          filterChosenMobile={filterChosenMobile}
          facet={facet}
          i={i}
          title={title}
          setValue={setValue}
          facetSearch={facetSearch}
          clear={clear}
          isClearAll={isClearAll}
          setIsClearAll={setIsClearAll}
          facetQuery={facetQuery}
        />
      );
    }
  };

  const translationState = useAppTranslation();
  const palette = "custom.resultPage.filters.";
  const [isClearAll, setIsClearAll] = useState(false);

  const [numberToShow, setNumberToShow] = useState(5);
  const handleShowMoreClick = () => {
    setNumberToShow((prev) => prev + 5);
  };
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
          if (tab.id !== "")
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
              return (
                <Box sx={{ minHeight: "450px" }} key={i}>
                  {drawFacets(facet, i)}
                </Box>
              );
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
        {translationState.translation["Apply"]}
      </Button>

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
          setSelectedProvider("");
          setIsClearAll(true);
        }}
      >
        {translationState.translation["Clear"]}
      </Button>
    </>
  );
};

export default FilterBy;
