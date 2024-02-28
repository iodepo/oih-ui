import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import { cutWithDots } from "components/results/ResultDetails";
import Select from "@mui/material/Select";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import MenuItem from "@mui/material/MenuItem";
import PublicIcon from "@mui/icons-material/Public";
import { fieldTitleFromName } from "utilities/generalUtility";
import { PROMOTED_REGIONS } from "portability/configuration";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Popover from "@mui/material/Popover";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Tooltip from "@mui/material/Tooltip";
import { useAppTranslation } from "context/context/AppTranslation";

const FilterMapMobile = (props) => {
  const {
    region,
    setRegion,
    filteredFacets,
    setOpenPopoverFilter,
    openPopoverFilter,
    handleInputChange,
    isChecked,
    setSelectedFacets,
    selectedFacets,
    facetSearch,
  } = props;
  const translationState = useAppTranslation();
  return (
    <Box sx={{ display: "flex", gap: 1, overflowX: "auto" }}>
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
          height: "30px",
          fontSize: "14px",
          backgroundColor: "#FFFFFF",
          maxWidth: "140px",
          ".MuiOutlinedInput-notchedOutline": {
            borderWidth: 0,
          },
          marginBottom: 1,
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
                  height: "30px",
                  fontSize: "14px",
                  backgroundColor: "#FFFFFF",
                  maxWidth: "165px",
                  color: "#1A2C54",
                  textTransform: "none",
                  boxShadow: "none",
                  flex: "0 0 auto",
                  marginBottom: 1,
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
                open={openPopoverFilter ? openPopoverFilter.id == title : false}
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
                      backgroundColor: "#ffffff",
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
  );
};

export default FilterMapMobile;
