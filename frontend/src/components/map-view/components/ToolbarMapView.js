import React from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import MenuItem from "@mui/material/MenuItem";
import ButtonGroup from "@mui/material/ButtonGroup";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const ToolbarMapView = (props) => {
  const { applyZoom } = props;
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
              sx={{ height: "24px", backgroundColor: "#FFFFFF" }}
              startAdornment={
                <HelpOutlineIcon
                  sx={{
                    marginRight: 1,
                    fontSize: "18px",
                  }}
                />
              }
              defaultValue={"Variable"}
            >
              <MenuItem value={"Variable"}>Variable</MenuItem>
            </Select>
            <Select
              sx={{ height: "24px", backgroundColor: "#FFFFFF" }}
              startAdornment={
                <HelpOutlineIcon
                  sx={{
                    marginRight: 1,
                    fontSize: "18px",
                  }}
                />
              }
              defaultValue={"Keywords"}
            >
              <MenuItem value={"Keywords"}>Keywords</MenuItem>
            </Select>
            <Select
              sx={{ height: "24px", backgroundColor: "#FFFFFF" }}
              startAdornment={
                <HelpOutlineIcon
                  sx={{
                    marginRight: 1,
                    fontSize: "18px",
                  }}
                />
              }
              defaultValue={"Provider"}
            >
              <MenuItem value={"Provider"}>Provider</MenuItem>
            </Select>
            <Select
              sx={{ height: "24px", backgroundColor: "#FFFFFF" }}
              startAdornment={
                <HelpOutlineIcon
                  sx={{
                    marginRight: 1,
                    fontSize: "18px",
                  }}
                />
              }
              defaultValue={"Type"}
            >
              <MenuItem value={"Type"}>Type</MenuItem>
            </Select>
            <Select
              sx={{ height: "24px", backgroundColor: "#FFFFFF" }}
              defaultValue={"Starting"}
            >
              <MenuItem value={"Starting"}>Starting</MenuItem>
            </Select>
            <Select
              sx={{ height: "24px", backgroundColor: "#FFFFFF" }}
              defaultValue={"Ending"}
            >
              <MenuItem value={"Ending"}>Ending</MenuItem>
            </Select>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: 9,
          right: 0,
          paddingLeft: "8px",
          paddingRight: "8px",
        }}
      >
        <ButtonGroup
          orientation="vertical"
          variant="contained"
          sx={{ backgroundColor: "#FFFFFF", borderRadius: 2 }}
        >
          <IconButton onClick={() => applyZoom("in")}>
            <AddIcon />
          </IconButton>
          <IconButton onClick={() => applyZoom("out")}>
            <RemoveIcon />
          </IconButton>
        </ButtonGroup>
      </Box>
    </>
  );
};

export default ToolbarMapView;
