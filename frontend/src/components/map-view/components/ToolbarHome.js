import React, { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import IconButton from "@mui/material/IconButton";
import { EMODNET, ARCGIS, USGS } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const ToolbarHome = (props) => {
  const { changeBaseLayer, center } = props;
  const [selectedLayer, setSelectedLayer] = useState(EMODNET);
  const handleButtonClick = (layer) => {
    setSelectedLayer(layer);
    changeBaseLayer(layer);
  };

  const navigate = useNavigate();

  const goToMap = () => {
    navigate(`/map-viewer?lng=${center[0]}&lat=${center[1]}`);
  };
  return (
    <>
      <Box
        sx={{
          position: "absolute",
          top: 10,
          left: 12,
        }}
      >
        <ButtonGroup
          variant="contained"
          sx={{
            ".MuiButton-root": {
              background: "#FFFFFF",
              color: "#2B498C",
              padding: "6px",
              borderRight: 0,
              fontSize: "12px",
              fontWeight: 600,
            },

            ".MuiButton-root:hover": {
              background: "#DEE2ED",
            },
          }}
          disableElevation
        >
          <Button onClick={() => handleButtonClick(EMODNET)}>
            <Box
              sx={{
                ...(selectedLayer === EMODNET && {
                  background: "#DEE2ED",
                }),
                paddingLeft: "6px",
                paddingRight: "6px",
                borderRadius: "3px",
              }}
            >
              {EMODNET}
            </Box>
          </Button>
          <Button onClick={() => handleButtonClick(ARCGIS)}>
            <Box
              sx={{
                ...(selectedLayer === ARCGIS && {
                  background: "#DEE2ED",
                }),
                paddingLeft: "6px",
                paddingRight: "6px",
                borderRadius: "3px",
              }}
            >
              {ARCGIS}
            </Box>
          </Button>
          <Button onClick={() => handleButtonClick(USGS)}>
            <Box
              sx={{
                ...(selectedLayer === USGS && {
                  background: "#DEE2ED",
                }),
                paddingLeft: "6px",
                paddingRight: "6px",
                borderRadius: "3px",
              }}
            >
              {USGS}
            </Box>
          </Button>
        </ButtonGroup>
      </Box>
      <Box sx={{ position: "absolute", bottom: 10, right: 12 }}>
        <IconButton
          sx={{
            color: "white",
            background: "#FFFFFF",
            borderRadius: "3px",
            "&:hover": {
              background: "#2B498C",
              "& .MuiSvgIcon-root": {
                color: "#FFFFFF",
              },
            },
          }}
          onClick={() => goToMap()}
        >
          <OpenInFullIcon sx={{ color: "#2B498C" }} />
        </IconButton>
      </Box>
    </>
  );
};

export default ToolbarHome;
