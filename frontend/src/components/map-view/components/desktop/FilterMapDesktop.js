import React from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import PublicIcon from "@mui/icons-material/Public";
import { fieldTitleFromName } from "utilities/generalUtility";
import { PROMOTED_REGIONS } from "portability/configuration";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Popover from "@mui/material/Popover";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { cutWithDots } from "components/results/ResultDetails";
import Tooltip from "@mui/material/Tooltip";
import { useAppTranslation } from "context/context/AppTranslation";

const FilterMapDesktop = (props) => {
  const {
    region,
    filteredFacets,
    selectedFacets,
    setSelectedFacets,
    setOpenPopoverFilter,
    openPopoverFilter,
    handleInputChange,
    isChecked,
    setRegion,
    facetSearch,
  } = props;
  const translationState = useAppTranslation();
  const palette = "custom.mapView.desktop.toolbar.";
  return (
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
          backgroundColor: palette + "bgButton",
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
          return (
            <Box key={index}>
              <Button
                variant="contained"
                sx={{
                  height: "24px",
                  fontSize: "13px",
                  backgroundColor: palette + "bgButton",
                  maxWidth: "160px",
                  whiteSpace: "noWrap",
                  color: palette + "colorButton",
                  textTransform: "none",
                  boxShadow: "none",
                  ".MuiButton-startIcon": { marginRight: "2px" },
                  ".MuiButton-endIcon": { marginLeft: 0 },
                  "&:hover": {
                    backgroundColor: palette + "colorButton",
                    color: palette + "bgButton",
                    ".MuiSvgIcon-root": {
                      color: palette + "bgButton",
                    },
                  },
                }}
                startIcon={
                  <>
                    {counter > 0 && (
                      <Box
                        sx={{
                          color: palette + "colorBox",
                          fontSize: "12px !important",
                          width: "20px",
                          height: "20px",
                          borderRadius: "12px",
                          backgroundColor: palette + "bgBox",
                        }}
                      >
                        {counter}
                      </Box>
                    )}
                  </>
                }
                endIcon={
                  <KeyboardArrowDownIcon
                    sx={{
                      fontSize: "14px",
                      color: palette + "colorIcon",
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
                {
                  translationState.translation[
                    title.replace(" Between", "").replace(" Measured", "")
                  ]
                }
              </Button>
              <Popover
                /* id={id} */
                elevation={0}
                open={
                  openPopoverFilter ? openPopoverFilter.id === title : false
                }
                anchorEl={openPopoverFilter ? openPopoverFilter.target : null}
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
                      backgroundColor: palette + "bgButton",
                      "& .MuiFormLabel-root": {
                        fontSize: "12px",
                      },
                      borderRadius: 1,
                    }}
                    onChange={(e) => handleInputChange(e.target.value, f.name)}
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
                            key={index2}
                            arrow
                            placement="right"
                            title={c.name}
                            sx={{
                              display: c.name.length < 30 ? "none" : "flex",
                            }}
                          >
                            <FormControlLabel
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
                                        p.name !== f.name && p.value !== c.name
                                    )
                                  );
                                }
                                facetSearch(f.name, c.name, checked);
                              }}
                              label={cutWithDots(c.name, 30)}
                              sx={{
                                ".MuiTypography-root": {
                                  fontSize: "12px",
                                  color: palette + "colorTypography",
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
            </Box>
          );
        })}
    </Box>
  );
};

export default FilterMapDesktop;
