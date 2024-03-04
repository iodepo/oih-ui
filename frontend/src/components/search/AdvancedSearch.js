import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import OutlinedInput from "@mui/material/OutlinedInput";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppTranslation } from "context/context/AppTranslation";
import Alert from "@mui/material/Alert";
import { CATEGORIES, PROMOTED_REGIONS } from "portability/configuration";
import Divider from "@mui/material/Divider";
import { fieldTitleFromName, useSearchParam } from "utilities/generalUtility";
import { dataServiceUrl } from "config/environment";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import PublicIcon from "@mui/icons-material/Public";

const AdvancedSearch = (props) => {
  const { setSearchQuery, searchQuery, facets } = props;
  const palette = "custom.resultPage.searchBar.advancedSearch.";
  const translationState = useAppTranslation();
  const [facetsToShow, setFacetsToShow] = useState(facets);
  const [alertMessage, setAlertMessage] = useState("");
  const [sort, setSort] = useSearchParam("sort");
  const [searchAdvancedQuery, setSearchAdvancedQuery] = useState({
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
  });
  const navigate = useNavigate();
  const [region, setRegion] = useSearchParam("region", "global");

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
    let searchQueryBuild = "{{";
    // Build SOLR facet query
    let facetQuery = "";

    const idTabName = CATEGORIES.find(
      (c) => c.text === searchAdvancedQuery[0].value
    ).id;

    const regionValue = searchAdvancedQuery[0].region;
    searchQueryBuild +=
      ' (Topic IS "' + searchAdvancedQuery[0].value + '") AND (';
    /** @type {{id: number, category: string, value: string, operator: string, textfield: string}[][]} */
    const groups = Object.values(searchAdvancedQuery).toSpliced(0, 1);

    const categories = facetsToShow.reduce((acc, f) => {
      const t = fieldTitleFromName(f.name);
      acc[t] = f.name;
      return acc;
    }, {});

    function valueMapper(text, operator) {
      if (operator.endsWith("Contains")) {
        return `*${text}*`;
      }
      return text;
    }

    let firstGroup = true;
    for (const group of groups) {
      if (firstGroup) {
        facetQuery += "(";
        firstGroup = false;
      } else {
        facetQuery += " AND (";
        searchQueryBuild += " AND (";
      }

      for (const [index, value] of group.entries()) {
        if (!value.textfield) {
          setAlertMessage(
            "Please kindly fill in all fields or, if not applicable, feel free to remove them"
          );
        }

        if (group.length > 1) {
          searchQueryBuild +=
            "( " +
            value.category +
            " " +
            value.operator.replace(/([a-z])([A-Z])/g, "$1 $2").toUpperCase() +
            ' "' +
            value.textfield +
            '" )';
        } else {
          searchQueryBuild +=
            value.category +
            " " +
            value.operator.replace(/([a-z])([A-Z])/g, "$1 $2").toUpperCase() +
            ' "' +
            value.textfield +
            '"';
        }

        facetQuery +=
          (value.operator.startsWith("Not") ? "-" : "") +
          categories[value.category] +
          ":" +
          valueMapper(value.textfield, value.operator);

        if (index < group.length - 1) {
          facetQuery += " OR ";
          searchQueryBuild += " OR ";
        }
      }
      searchQueryBuild += ")";
      facetQuery += ")";
    }
    searchQueryBuild += " }}";
    setSearchQuery(searchQueryBuild);
    const hrefFor = (region, query) =>
      `/results/${idTabName}?${new URLSearchParams({
        ...(query ? { fq: query } : {}),
        ...(sort ? { sort: sort } : {}),
        ...(region && region.toUpperCase() !== "GLOBAL" ? { region } : {}),
      })}`;
    navigate(hrefFor(regionValue, facetQuery));
  };

  return (
    <>
      <Grid item container gap={1} sx={{ mt: 2 }}>
        <Grid item xs={12} lg={8}>
          <Box sx={{ background: "#E8EDF23F", padding: "10px" }}>
            <Typography
              variant="body1"
              alignItems={"start"}
              sx={{
                color: "#BDC7DB",
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
              {CATEGORIES.map((c, index) => (
                <MenuItem key={index} value={c.text}>
                  {translationState.translation[c.text]}
                </MenuItem>
              ))}
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
                      {searchAdvancedQuery[id].map((v, index2) => {
                        return (
                          <>
                            <Grid key={index2} item xs={7}>
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
                                {facetsToShow.map((f, index) => {
                                  const title = fieldTitleFromName(f.name);
                                  if (title !== "Provider")
                                    return (
                                      <MenuItem key={index} value={title}>
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
                                disabled={
                                  index2 !== searchAdvancedQuery[id].length - 1
                                }
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
                              {(searchAdvancedQuery[id].length > 1 ||
                                index >= 2) && (
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
                                <MenuItem value="NotContains">
                                  Not Contains
                                </MenuItem>
                                <MenuItem value="Equals">Equals</MenuItem>
                                <MenuItem value="NotEquals">
                                  Not Equals
                                </MenuItem>
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
                                    const newArray = [
                                      ...searchAdvancedQuery[id],
                                    ];
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
                              {(v.operator === "Equals" ||
                                v.operator === "NotEquals") && (
                                <Autocomplete
                                  disablePortal
                                  onChange={(e, newValue) => {
                                    const newArray = [
                                      ...searchAdvancedQuery[id],
                                    ];
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
                            {index2 !== searchAdvancedQuery[id].length - 1 &&
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
                        <Box key={v.index2}>
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
                              {facetsToShow.map((f, index) => {
                                const title = fieldTitleFromName(f.name);
                                if (title !== "Provider")
                                  return (
                                    <MenuItem key={index} value={title}>
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
                              <MenuItem value="NotContains">
                                Not Contains
                              </MenuItem>
                              <MenuItem value="Equals">Equals</MenuItem>
                              <MenuItem value="NotEquals">Not Equals</MenuItem>
                            </Select>
                            {(v.operator === "Contains" ||
                              v.operator === "NotContains") && (
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
                            {(v.operator === "Equals" ||
                              v.operator === "NotEquals") && (
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
                              disabled={
                                index2 !== searchAdvancedQuery[id].length - 1
                              }
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

                            {(searchAdvancedQuery[id].length > 1 ||
                              Object.keys(searchAdvancedQuery).length > 2) && (
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
              onClick={() =>
                setSearchAdvancedQuery({
                  0: {
                    category: "Topic",
                    value: "Documents",
                  },
                  1: [
                    {
                      id: 0,
                      category: "Provider",

                      operator: "Contains",
                      textfield: "",
                    },
                  ],
                })
              }
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
