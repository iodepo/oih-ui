import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import MenuItem from "@mui/material/MenuItem";
import ButtonGroup from "@mui/material/ButtonGroup";
import AddIcon from "@mui/icons-material/Add";
import PublicIcon from "@mui/icons-material/Public";
import RemoveIcon from "@mui/icons-material/Remove";
import { fieldTitleFromName } from "utilities/generalUtility";
import { PROMOTED_REGIONS, backgroundImage } from "portability/configuration";
import { useAppTranslation } from "context/context/AppTranslation";
import LayersIcon from "@mui/icons-material/Layers";
import Fade from "@mui/material/Fade";

const ToolbarMapView = (props) => {
  const { applyZoom, facets, setRegion, region, handleSubmit } = props;
  const translationState = useAppTranslation();

  const [openFilterMap, setOpenFilterMap] = useState(false);

  useEffect(() => {
    handleSubmit();
  }, [region]);
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
          <Box sx={{ display: "flex", gap: 2 }}>
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
            {facets.length > 0 &&
              facets.map((f, index) => {
                const title = fieldTitleFromName(f.name)
                  .replace(" Between", "")
                  .replace(" Measured", "");

                return (
                  <Select
                    key={index}
                    sx={{
                      height: "24px",
                      fontSize: "14px",
                      backgroundColor: "#FFFFFF",
                      maxWidth: "130px",
                    }}
                    startAdornment={
                      <HelpOutlineIcon
                        sx={{
                          marginRight: 1,
                          fontSize: "14px",
                        }}
                      />
                    }
                    defaultValue={title}
                  >
                    <MenuItem value={title}>{title}</MenuItem>
                    {f.counts.map((c, index2) => {
                      return (
                        <MenuItem key={index2} value={c.name}>
                          {c.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
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
            <Box sx={{ backgroundColor: "white", height: "100%" }}>Ciao</Box>
          </Fade>
        </Box>

        <Box sx={{ width: "70%", height: "191px" }}>
          <Fade in={openFilterMap} mountOnEnter unmountOnExit>
            <Box sx={{ backgroundColor: "white", height: "100%" }}>Ciao</Box>
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
            sx={{ backgroundColor: "#FFFFFF", borderRadius: 2 }}
            onClick={() => setOpenFilterMap(!openFilterMap)}
          >
            <LayersIcon sx={{ color: "#13213F" }} />
          </IconButton>
          <ButtonGroup
            orientation="vertical"
            variant="contained"
            sx={{ backgroundColor: "#FFFFFF", borderRadius: 2 }}
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
      {/* <Box
        sx={{
          position: "absolute",
          bottom: 30,
          right: 0,
          paddingLeft: "8px",
          paddingRight: "8px",
        }}
      ></Box> */}
    </>
  );
};

export default ToolbarMapView;
