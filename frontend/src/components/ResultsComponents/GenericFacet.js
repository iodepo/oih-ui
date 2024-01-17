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
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import { useAppTranslation } from "ContextManagers/context/AppTranslation";

const GenericFacet = (props) => {
  const {
    facet,
    i,
    title,
    setValue,
    facetSearch,
    clear,
    setFilterChosenMobile,
    filterChosenMobile,
  } = props;
  const [searchInput, setSearchInput] = useState("");
  const [filteredFaces, setFilteredFaces] = useState([]);
  const [numberToShow, setNumberToShow] = useState(5);

  const handleInputChange = (value, facetLists) => {
    const input = value;
    setSearchInput(input);

    const filtered = facetLists.filter((list) =>
      list.name.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredFaces(filtered);
  };

  const handleShowMoreClick = () => {
    setNumberToShow((prev) => prev + 5);
  };

  const translationState = useAppTranslation();
  const palette = "custom.resultPage.filters.";
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
      <Box>
        <TextField
          fullWidth
          size="small"
          sx={{
            backgroundColor: "#ffffff",
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
        {(searchInput !== "" ? filteredFaces : facet.counts)
          .slice(0, numberToShow)
          .map((facetCount) => {
            const labelId = `checkbox-list-label-${facetCount.name}`;

            return (
              <ListItem key={facetCount.name} disablePadding>
                <Tooltip
                  arrow
                  placement="right"
                  title={facetCount.name}
                  sx={{
                    display: facetCount.name.length < 15 ? "none" : "flex",
                  }}
                >
                  <ListItemButton sx={{ display: "flex" }} dense>
                    <ListItemIcon sx={{ minWidth: 0 }}>
                      <Checkbox
                        edge="start"
                        tabIndex={-1}
                        onChange={(e) => {
                          if (!e.target.checked) {
                            clear();
                            setFilterChosenMobile((f) =>
                              f.filter((d) => d.type !== title.toLowerCase())
                            );
                          } else {
                            setValue(i, facetCount.name);
                            facetSearch(facet.name, facetCount.name);
                            const isGenericFilterSet = filterChosenMobile.find(
                              (f) => f.type === facetCount.name
                            );
                            if (isGenericFilterSet ?? true)
                              setFilterChosenMobile((prev) => [
                                ...prev,
                                {
                                  type: facetCount.name,
                                  text: facetCount.name,
                                },
                              ]);
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
      {searchInput === "" && (
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
};

export default GenericFacet;
