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

const DesktopAS = (props) => {
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
    <Box display={{ xs: "none", lg: "block" }}>
      {index === 1 && (
        <Grid item xs={12}>
          <Divider
            textAlign="left"
            sx={{
              color: palette + "dividerColor",
              fontWeight: 700,
              "&::before, &::after": {
                borderColor: "rgba(0, 0, 0, 0.50);",
              },
              marginBottom: 1,
            }}
          >
            AND
          </Divider>
        </Grid>
      )}
      {searchAdvancedQuery[id].map((v, index2) => {
        return (
          <Box key={v.id}>
            <Box
              display={{ xs: "none", lg: "flex" }}
              alignItems={"center"}
              columnGap={1}
              sx={{ marginBottom: 1 }}
            >
              <Select
                defaultValue={"Provider"}
                sx={{
                  color: palette + "colorTypography",
                  fontWeight: 600,
                  borderRadius: 1,
                  height: "40px",
                  maxWidth: "8.5rem",
                  minWidth: "8.5rem",
                }}
                onChange={(e) => {
                  const newArray = [...searchAdvancedQuery[id]];
                  const updatedArray = newArray.map((obj) =>
                    obj.id === v.id ? { ...obj, category: e.target.value } : obj
                  );

                  setSearchAdvancedQuery({
                    ...searchAdvancedQuery,
                    [id]: updatedArray,
                  });
                }}
              >
                <MenuItem value={"Provider"}>Provider</MenuItem>
                {facetsToShow.map((f, index3) => {
                  const title = fieldTitleFromName(f.name);
                  if (title !== "Provider")
                    return (
                      <MenuItem key={index3} value={title}>
                        {title}
                      </MenuItem>
                    );
                })}
              </Select>
              <Select
                defaultValue="Contains"
                sx={{
                  color: palette + "colorTypography",
                  fontWeight: 600,
                  borderRadius: 1,
                  height: "40px",
                  maxWidth: "8.5rem",
                  minWidth: "8.5rem",
                }}
                onChange={(e) => {
                  const newArray = [...searchAdvancedQuery[id]];
                  const updatedArray = newArray.map((obj) =>
                    obj.id === v.id ? { ...obj, operator: e.target.value } : obj
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
              {(v.operator === "Contains" || v.operator === "NotContains") && (
                <OutlinedInput
                  sx={{
                    height: "40px",
                    marginRight: 4,
                    width: "250px",
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
                    width: "250px",
                  }}
                  renderInput={(params) => (
                    <TextField
                      sx={{
                        ".MuiOutlinedInput-root": {
                          height: "40px",
                          paddingTop: 0,
                        },
                      }}
                      {...params}
                      placeholder="Please enter text"
                    />
                  )}
                />
              )}

              <Button
                variant={"outlined"}
                sx={{
                  height: "40px",
                  minWidth: "44px",
                  borderColor: palette + "borderColor",
                  color: palette + "colorTypography",
                  width: "55px",
                  whiteSpace: "nowrap",
                }}
                onClick={() => {
                  const lastID =
                    searchAdvancedQuery[id][searchAdvancedQuery[id].length - 1]
                      .id;

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
                disabled={index2 !== searchAdvancedQuery[id].length - 1}
                sx={{
                  height: "40px",
                  minWidth: "44px",
                  borderColor: palette + "borderColor",
                  color: palette + "colorTypography",
                  width: "55px",
                  whiteSpace: "nowrap",
                }}
                onClick={() => {
                  const keys = Object.keys(searchAdvancedQuery);

                  const lastKey = Math.max(...keys.map((k) => parseInt(k, 10)));

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

              {(searchAdvancedQuery[id].length > 1 ||
                Object.keys(searchAdvancedQuery).length > 2) && (
                <IconButton
                  aria-label="remove"
                  sx={{
                    border: "1px solid #aaa",
                    borderRadius: "6px",
                    backgroundColor: palette + "bgIconDelete",
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
                  <DeleteIcon sx={{ color: palette + "colorIconRed" }} />
                </IconButton>
              )}
            </Box>
            {index2 !== searchAdvancedQuery[id].length - 1 &&
              searchAdvancedQuery[id].length > 1 && (
                <Typography
                  variant="body1"
                  sx={{
                    color: palette + "andOrColor",
                    paddingLeft: 2,
                    fontWeight: 700,
                    marginBottom: "3px",
                  }}
                >
                  OR
                </Typography>
              )}
          </Box>
        );
      })}
      {index !== Object.keys(searchAdvancedQuery).length - 1 &&
        Object.keys(searchAdvancedQuery).length > 2 && (
          <Divider
            textAlign={"left"}
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
        )}
      {/*
                    {facets.map((f, index) => {
                      const title = fieldTitleFromName(f.name);
                      const values = f.counts;
                      if (searchAdvancedQuery[key].category === title)
                        return (
                          <Box key={index}>
                            <Select
                              defaultValue={""}
                              sx={{
                                color: palette + "colorTypography",
                                fontWeight: 600,
                                borderRadius: 1,
                                height: "40px",
                                maxWidth: "8.5rem",
                                minWidth: "8.5rem",
                              }}
                              onChange={(e) => {
                                const obj = {
                                  ...searchAdvancedQuery[key],
                                  subCategory: e.target.value,
                                };
                                setSearchAdvancedQuery({
                                  ...searchAdvancedQuery,
                                  [key]: obj,
                                });
                              }}
                            >
                              {values &&
                                values.map((v, index) => (
                                  <MenuItem key={index} value={v.name}>
                                    {v.name}
                                  </MenuItem>
                                ))}
                            </Select>
                          </Box>
                        );
                    })}
 */}
    </Box>
  );
};

export default DesktopAS;
