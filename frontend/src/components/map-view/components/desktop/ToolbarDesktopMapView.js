import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import MenuItem from "@mui/material/MenuItem";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import PublicIcon from "@mui/icons-material/Public";
import RemoveIcon from "@mui/icons-material/Remove";
import { fieldTitleFromName } from "utilities/generalUtility";
import { PROMOTED_REGIONS, backgroundImage } from "portability/configuration";
import { useAppTranslation } from "context/context/AppTranslation";
import LayersIcon from "@mui/icons-material/Layers";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import Slider from "@mui/material/Slider";
import Popover from "@mui/material/Popover";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { cutWithDots } from "components/results/ResultDetails";
import Tooltip from "@mui/material/Tooltip";

const ToolbarDesktopMapView = (props) => {
  const {
    applyZoom,
    facets,
    setRegion,
    region,
    handleSubmit,
    facetSearch,
    facetQuery,
    selectedFacets,
    setSelectedFacets,
  } = props;
  const translationState = useAppTranslation();
  const [filteredFacets, setFilteredFacets] = useState(facets);

  const [openPopoverFilter, setOpenPopoverFilter] = useState(null);
  const [openFilterMap, setOpenFilterMap] = useState(false);

  useEffect(() => {
    handleSubmit();
  }, [region]);

  useEffect(() => {
    if (facets) setFilteredFacets(facets);
  }, [facets]);

  const isChecked = (name, value) => {
    return selectedFacets.some(
      (obj) => obj.name === name && obj.value === value
    );
  };

  useEffect(() => {
    if (facetQuery) {
      const pairs = facetQuery.split("&");

      const extractedPairs = [];

      for (let i = 0; i < pairs.length; i += 2) {
        const facetType = pairs[i].split("=")[1];
        const facetName = decodeURIComponent(
          pairs[i + 1].split("=")[1].replaceAll("+", " ")
        );

        extractedPairs.push({ name: facetType, value: facetName });
      }

      setSelectedFacets(extractedPairs);
    }
  }, [facetQuery]);

  const handleInputChange = (value, name) => {
    setFilteredFacets(() => {
      return facets.map((facet) => {
        if (facet.name === name) {
          const filteredCounts = facet.counts.filter((count) =>
            count.name.toLowerCase().includes(value.toLowerCase())
          );
          return {
            ...facet,
            counts: filteredCounts,
          };
        }
        return facet;
      });
    });
  };

  return (
    <>
      <Box
        sx={{
          position: "absolute",
          top: 9,
          width: "100%",
          paddingLeft: "8px",
          paddingRight: "8px",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: window.innerWidth < 1400 ? "wrap" : "nowrap",
            }}
          >
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
                setRegion(e.target.value);
              }}
              sx={{
                height: "24px",
                fontSize: "14px",
                backgroundColor: "#FFFFFF",
                maxWidth: "140px",
                ".MuiOutlinedInput-notchedOutline": {
                  borderWidth: 0,
                },
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
            {filteredFacets.length > 0 &&
              filteredFacets.map((f, index) => {
                const title = fieldTitleFromName(f.name);

                const counter = selectedFacets.filter(
                  (s) => s.name === f.name
                ).length;
                const counterTitle = counter > 0 ? "[" + counter + "]" : "";
                return (
                  <>
                    <Button
                      key={index}
                      variant="contained"
                      sx={{
                        height: "24px",
                        fontSize: "14px",
                        backgroundColor: "#FFFFFF",
                        maxWidth: "135px",
                        color: "#1A2C54",
                        textTransform: "none",
                        boxShadow: "none",
                        ".MuiButton-startIcon": { marginRight: "2px" },
                        ".MuiButton-endIcon": { marginLeft: 0 },
                        "&:hover": {
                          background: "#1A2C54",
                          color: "#FFFFFF",
                          ".MuiSvgIcon-root": {
                            color: "#FFFFFF",
                          },
                        },
                      }}
                      startIcon={
                        <HelpOutlineIcon
                          sx={{
                            fontSize: "14px",
                            color: "#1A2C54",
                          }}
                        />
                      }
                      endIcon={
                        <KeyboardArrowDownIcon
                          sx={{
                            fontSize: "14px",
                            color: "#1A2C54",
                          }}
                        />
                      }
                      onClick={(e) =>
                        setOpenPopoverFilter({
                          id: title,
                          target: e.currentTarget,
                        })
                      }
                    >
                      {title.replace(" Between", "").replace(" Measured", "") +
                        counterTitle}
                    </Button>
                    <Popover
                      /* id={id} */
                      elevation={0}
                      open={
                        openPopoverFilter
                          ? openPopoverFilter.id == title
                          : false
                      }
                      anchorEl={
                        openPopoverFilter ? openPopoverFilter.target : null
                      }
                      onClose={() => setOpenPopoverFilter(null)}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                    >
                      <Box
                        sx={{
                          padding: 1,
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        <TextField
                          fullWidth
                          size="small"
                          /* value={searchInput} */
                          sx={{
                            backgroundColor: "#ffffff",
                            "& .MuiFormLabel-root": {
                              fontSize: "12px",
                            },
                            borderRadius: 1,
                          }}
                          onChange={(e) =>
                            handleInputChange(e.target.value, f.name)
                          }
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
                          label={
                            translationState.translation["Search"] +
                            " " +
                            title +
                            "..."
                          }
                        />
                        <Box
                          sx={{
                            maxHeight: "300px",
                            overflowY: "scroll",
                          }}
                        >
                          <Stack>
                            {f.counts.map((c, index2) => {
                              return (
                                <Tooltip
                                  arrow
                                  placement="right"
                                  title={c.name}
                                  sx={{
                                    display:
                                      c.name.length < 30 ? "none" : "flex",
                                  }}
                                >
                                  <FormControlLabel
                                    key={index2}
                                    control={<Checkbox size="small" />}
                                    checked={isChecked(f.name, c.name)}
                                    onClick={(e) => {
                                      const checked = e.target.checked;
                                      if (checked) {
                                        setSelectedFacets([
                                          ...selectedFacets,
                                          { name: f.name, value: c.name },
                                        ]);
                                      } else {
                                        setSelectedFacets((prevState) =>
                                          prevState.filter(
                                            (p) =>
                                              p.name !== f.name &&
                                              p.value !== c.name
                                          )
                                        );
                                      }
                                      facetSearch(f.name, c.name, checked);
                                    }}
                                    label={cutWithDots(c.name, 30)}
                                    sx={{
                                      ".MuiTypography-root": {
                                        fontSize: "12px",
                                        color: "#1A2C54",
                                      },
                                    }}
                                  />
                                </Tooltip>
                              );
                            })}
                          </Stack>
                        </Box>
                      </Box>
                    </Popover>
                  </>
                );
              })}
          </Box>
        </Box>
      </Box>
      <Stack
        sx={{
          width: "100%",
          position: "absolute",
          bottom: 30,
          paddingLeft: "8px",
          paddingRight: "8px",
        }}
        direction={"row"}
        spacing={2}
      >
        <Box sx={{ width: "25%", height: "191px" }}>
          <Fade in={openFilterMap} mountOnEnter unmountOnExit>
            <Box
              sx={{
                backgroundColor: "white",
                height: "100%",
                borderRadius: "6px",

                padding: "12px",
              }}
            >
              <Stack spacing={0.5}>
                <Typography variant="body2">
                  COLOR - POINTS PER HEXAGON
                </Typography>
              </Stack>
            </Box>
          </Fade>
        </Box>

        <Box sx={{ width: "70%", height: "191px" }}>
          <Fade in={openFilterMap} mountOnEnter unmountOnExit>
            <Box
              sx={{
                backgroundColor: "white",
                height: "100%",
                borderRadius: "6px",
                padding: "12px",
              }}
            >
              <Stack spacing={0.5}>
                <Typography variant="body2">COMPONENTS</Typography>
                <Stack spacing={2} direction={"row"}>
                  <Box
                    sx={{
                      height: "139px",
                      width: "50%",
                      border: "1px solid #DEE2ED",
                      borderRadius: "6px",
                      padding: "12px",
                    }}
                  >
                    <Stack spacing={0.5}>
                      <FormControlLabel
                        control={
                          <Switch
                            size={"small"}
                            sx={{
                              ".Mui-checked": { color: "#2B498C !important" },
                            }}
                          />
                        }
                        sx={{
                          ".MuiTypography-root": {
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#1A2C54",
                          },
                        }}
                        label="Show Clustering"
                      />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <FormControlLabel
                          control={<Checkbox size="small" />}
                          label="Heatmap"
                          sx={{
                            ".MuiTypography-root": {
                              fontSize: "12px",
                              color: "#1A2C54",
                            },
                          }}
                        />
                        <FormControlLabel
                          control={<Checkbox size="small" />}
                          label="H3 Layer"
                          sx={{
                            ".MuiTypography-root": {
                              fontSize: "12px",
                              color: "#1A2C54",
                            },
                          }}
                        />
                      </Box>
                      <Divider variant="middle" />

                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#1A2C54",
                          }}
                        >
                          Opacity layer
                        </Typography>
                        <Slider
                          defaultValue={50}
                          valueLabelDisplay="auto"
                          sx={{ color: "#2B498C !important" }}
                        />
                      </Box>
                    </Stack>
                  </Box>
                  <Box
                    sx={{
                      height: "139px",
                      width: "50%",
                      border: "1px solid #DEE2ED",
                      borderRadius: "6px",
                      padding: "12px",
                    }}
                  >
                    <Stack spacing={1}>
                      <FormControlLabel
                        control={
                          <Switch
                            sx={{
                              ".Mui-checked": { color: "#2B498C !important" },
                            }}
                          />
                        }
                        sx={{
                          ".MuiTypography-root": {
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#1A2C54",
                          },
                        }}
                        label="Show Clustering"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            sx={{
                              ".Mui-checked": { color: "#2B498C !important" },
                            }}
                          />
                        }
                        sx={{
                          ".MuiTypography-root": {
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#1A2C54",
                          },
                        }}
                        label="Show Clustering"
                      />
                    </Stack>
                  </Box>
                </Stack>
              </Stack>
            </Box>
          </Fade>
        </Box>

        <Box
          sx={{
            width: "5%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <IconButton
            sx={{
              backgroundColor: "#FFFFFF",
              borderRadius: 2,
              width: "45px",
              "&:hover": {
                background: "#13213F",
                "& .MuiSvgIcon-root": {
                  color: "#FFFFFF",
                },
              },
            }}
            onClick={() => setOpenFilterMap(!openFilterMap)}
          >
            <LayersIcon sx={{ color: "#13213F" }} />
          </IconButton>
          <ButtonGroup
            orientation="vertical"
            variant="contained"
            sx={{
              backgroundColor: "#FFFFFF",
              borderRadius: 2,
              width: "45px",
              boxShadow: 0,
            }}
          >
            <IconButton onClick={() => applyZoom("in")}>
              <AddIcon sx={{ color: "#13213F" }} />
            </IconButton>
            <IconButton onClick={() => applyZoom("out")}>
              <RemoveIcon sx={{ color: "#13213F" }} />
            </IconButton>
          </ButtonGroup>
        </Box>
      </Stack>
    </>
  );
};

export default ToolbarDesktopMapView;
