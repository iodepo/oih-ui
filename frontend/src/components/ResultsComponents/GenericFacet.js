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

const GenericFacet = (props) => {
  const { facet, i, title, setValue, facetSearch, clear } = props;
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
      <Box>
        <TextField
          fullWidth
          sx={{
            backgroundColor: "#ffffff",
            "& .MuiFormLabel-root": {
              fontSize: "12px",
              color: "#7B8FB7",
            },
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
          label="Search..."
        />
      </Box>
      <List>
        {(searchInput !== "" ? filteredFaces : facet.counts)
          .slice(0, numberToShow)
          .map((facetCount) => {
            const labelId = `checkbox-list-label-${facetCount.name}`;

            return (
              <ListItem key={facetCount.name} disablePadding>
                <ListItemButton role={undefined} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      tabIndex={-1}
                      onChange={(e) => {
                        debugger;
                        if (!e.target.checked) {
                          clear();
                        } else {
                          setValue(i, facetCount.name);
                          facetSearch(facet.name, facetCount.name);
                        }
                      }}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={labelId}
                    className={facet.name}
                    primary={facetCount.name}
                  />
                  <Chip
                    sx={{ minWidth: "60px", fontSize: "12px" }}
                    label={facetCount.count}
                  />
                </ListItemButton>
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
                color: "#7B8FB7",
              }}
            />
          </IconButton>
          More Keywords
        </Toolbar>
      )}
    </>
  );
};

export default GenericFacet;
