import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import OutlinedInput from "@mui/material/OutlinedInput";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import Divider from "@mui/material/Divider";
import { fieldTitleFromName } from "utilities/generalUtility";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const MobileAS = (props) => {
  const {
    index,
    searchAdvancedQuery,
    id,
    setSearchAdvancedQuery,
    facetsToShow,
    showCorrectSubFacets,
  } = props;

  const palette = "custom.resultPage.searchBar.advancedSearch.";
  return (
    <Box display={{ lg: "none" }}>
      <Grid container display={"flex"} spacing={1}>
        {index === 1 && (
          <Grid item xs={12}>
            <Divider
              sx={{
                color: palette + "dividerColor",
                fontWeight: 700,
                "&::before, &::after": {
                  borderColor: "rgba(0, 0, 0, 0.50);",
                },
              }}
            >
              AND
            </Divider>
          </Grid>
        )}
        {searchAdvancedQuery[id].map((v, k) => {
          return (
            <>
              <Grid key={k} item xs={7}>
                <Select
                  defaultValue={"Provider"}
                  sx={{
                    color: palette + "colorTypography",
                    fontWeight: 600,
                    borderRadius: 1,
                    height: "40px",
                    width: "100%",
                  }}
                  onChange={(e) => {
                    const newArray = [...searchAdvancedQuery[id]];
                    const updatedArray = newArray.map((obj) =>
                      obj.id === v.id
                        ? { ...obj, category: e.target.value }
                        : obj
                    );

                    setSearchAdvancedQuery({
                      ...searchAdvancedQuery,
                      [id]: updatedArray,
                    });
                  }}
                >
                  <MenuItem value={"Provider"}>Provider</MenuItem>
                  {facetsToShow.map((f, j) => {
                    const title = fieldTitleFromName(f.name);
                    if (title !== "Provider")
                      return (
                        <MenuItem key={j} value={title}>
                          {title}
                        </MenuItem>
                      );
                  })}
                </Select>
              </Grid>
              <Grid item xs={5} display={"flex"} columnGap={1}>
                <Button
                  variant={"outlined"}
                  sx={{
                    height: "40px",
                    minWidth: "44px",
                    borderColor: palette + "borderColor",
                    color: palette + "colorTypography",
                    width: "50px",
                    whiteSpace: "nowrap",
                  }}
                  onClick={() => {
                    const lastID =
                      searchAdvancedQuery[id][
                        searchAdvancedQuery[id].length - 1
                      ].id;

                    const newKey = parseInt(lastID) + 1;

                    setSearchAdvancedQuery({
                      ...searchAdvancedQuery,
                      [id]: [
                        ...searchAdvancedQuery[id],
                        {
                          id: newKey,
                          category: "Provider",

                          operator: "Contains",
                          textfield: "",
                        },
                      ],
                    });
                  }}
                >
                  {"+ OR"}
                </Button>
                <Button
                  variant={"outlined"}
                  disabled={k !== searchAdvancedQuery[id].length - 1}
                  sx={{
                    height: "40px",
                    minWidth: "44px",
                    borderColor: palette + "borderColor",
                    color: palette + "colorTypography",
                    width: "50px",
                    whiteSpace: "nowrap",
                  }}
                  onClick={() => {
                    const keys = Object.keys(searchAdvancedQuery);

                    const lastKey = Math.max(
                      ...keys.map((k) => parseInt(k, 10))
                    );

                    const newKey = lastKey + 1;

                    const obj = {
                      ...searchAdvancedQuery,
                      [newKey]: [
                        {
                          id: 0,
                          category: "Provider",

                          operator: "Contains",
                          textfield: "",
                        },
                      ],
                    };

                    setSearchAdvancedQuery(obj);
                  }}
                >
                  {"+ AND"}
                </Button>
                {(searchAdvancedQuery[id].length > 1 || index >= 2) && (
                  <IconButton
                    aria-label="remove"
                    sx={{
                      border: " 1px solid #aaa",
                      borderRadius: "6px",
                      backgroundColor: "#FBE5E6",
                    }}
                    onClick={() => {
                      setSearchAdvancedQuery((prevState) => {
                        const updatedSearchAdvancedQuery = {
                          ...prevState,
                        };
                        delete updatedSearchAdvancedQuery[id];
                        const updatedArray = prevState[id].filter(
                          (f) => f.id !== v.id
                        );
                        if (updatedArray.length > 0)
                          return {
                            ...updatedSearchAdvancedQuery,
                            [id]: updatedArray,
                          };
                        else
                          return {
                            ...updatedSearchAdvancedQuery,
                          };
                      });
                    }}
                  >
                    <DeleteIcon sx={{ color: "#CC0000" }} />
                  </IconButton>
                )}
              </Grid>
              <Grid item xs={12}>
                <Select
                  defaultValue="Contains"
                  sx={{
                    color: palette + "colorTypography",
                    fontWeight: 600,
                    borderRadius: 1,
                    height: "40px",
                    width: "100%",
                  }}
                  onChange={(e) => {
                    const newArray = [...searchAdvancedQuery[id]];
                    const updatedArray = newArray.map((obj) =>
                      obj.id === v.id
                        ? { ...obj, operator: e.target.value }
                        : obj
                    );

                    setSearchAdvancedQuery({
                      ...searchAdvancedQuery,
                      [id]: updatedArray,
                    });
                  }}
                >
                  <MenuItem value="Contains">Contains</MenuItem>
                  <MenuItem value="NotContains">Not Contains</MenuItem>
                  <MenuItem value="Equals">Equals</MenuItem>
                  <MenuItem value="NotEquals">Not Equals</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12}>
                {(v.operator === "Contains" ||
                  v.operator === "NotContains") && (
                  <OutlinedInput
                    sx={{
                      height: "40px",
                      marginRight: 4,
                      width: "100%",
                    }}
                    onInput={(e) => {
                      const newArray = [...searchAdvancedQuery[id]];
                      const updatedArray = newArray.map((obj) =>
                        obj.id === v.id
                          ? { ...obj, textfield: e.target.value }
                          : obj
                      );
                      setSearchAdvancedQuery({
                        ...searchAdvancedQuery,
                        [id]: updatedArray,
                      });
                    }}
                    placeholder="Please enter text"
                  />
                )}
                {(v.operator === "Equals" || v.operator === "NotEquals") && (
                  <Autocomplete
                    disablePortal
                    onChange={(e, newValue) => {
                      const newArray = [...searchAdvancedQuery[id]];
                      const updatedArray = newArray.map((obj) =>
                        obj.id === v.id
                          ? { ...obj, textfield: newValue.value }
                          : obj
                      );
                      setSearchAdvancedQuery({
                        ...searchAdvancedQuery,
                        [id]: updatedArray,
                      });
                    }}
                    options={showCorrectSubFacets(v.category)}
                    sx={{
                      height: "40px",
                      marginRight: 4,
                      width: "100%",
                    }}
                    renderInput={(params) => (
                      <TextField
                        sx={{
                          paddingTop: 0,
                          ".MuiOutlinedInput-root": {
                            height: "40px",
                          },
                        }}
                        {...params}
                        placeholder="Please enter text"
                      />
                    )}
                  />
                )}
              </Grid>
              {k !== searchAdvancedQuery[id].length - 1 &&
                searchAdvancedQuery[id].length > 1 && (
                  <Grid item xs={12}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: palette + "andOrColor",
                        fontWeight: 700,
                        marginBottom: "3px",
                        textAlign: "center",
                      }}
                    >
                      OR
                    </Typography>
                  </Grid>
                )}
            </>
          );
        })}
        {index !== Object.keys(searchAdvancedQuery).length - 1 &&
          Object.keys(searchAdvancedQuery).length > 2 && (
            <Grid item xs={12}>
              <Divider
                sx={{
                  color: palette + "dividerColor",
                  fontWeight: 700,
                  "&::before, &::after": {
                    borderColor: "rgba(0, 0, 0, 0.50);",
                  },
                }}
              >
                AND
              </Divider>
            </Grid>
          )}
      </Grid>
    </Box>
  );
};

export default MobileAS;
