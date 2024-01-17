import React, { useState } from "react";
import Button from "@mui/material/Button";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

const Export = (props) => {
  const { palette } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Button
        variant="outlined"
        startIcon={<FileDownloadIcon />}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          backgroundColor: palette + "bgExportButton",
          color: palette + "iconsColor",
          fontWeight: 700,
          borderRadius: 1,
          height: "34px",
          border: 0,

          ".MuiSelect-icon": {
            color: palette + "iconsColor",
          },
          marginLeft: { xs: "120px", lg: "90px" },
        }}
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        Export
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Box sx={{ padding: 1 }} display={"flex"}>
          <Grid
            container
            sx={{ display: "flex", flexDirection: "column", gap: 1 }}
          >
            <Grid item xs={12}>
              <Typography
                variant="body2"
                sx={{ fontSize: "12px", fontWeight: 600 }}
              >
                N.items to download:
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <ButtonGroup
                size="small"
                variant="outlined"
                aria-label="outlined primary button group"
                color={"inherit"}
              >
                <Button>All</Button>
                <Button>10</Button>
                <Button>20</Button>
                <Button>30</Button>
              </ButtonGroup>
            </Grid>
            <Grid item xs={12} display={"flex"} gap={1} alignItems={"center"}>
              <Typography
                variant="body2"
                sx={{ fontSize: "12px", fontWeight: 600 }}
              >
                Format:
              </Typography>
              <ButtonGroup
                size="small"
                variant="outlined"
                aria-label="outlined primary button group"
                color={"inherit"}
              >
                <Button>CSV</Button>
                <Button>JSONLD</Button>
                <Button>PDF</Button>
              </ButtonGroup>
            </Grid>
            <Divider />
            <Grid item xs={12} display={"flex"} gap={1} justifyContent={"end"}>
              <Button size="small">Done</Button>
              <Button size="small">Cancel</Button>
            </Grid>
          </Grid>
        </Box>
      </Menu>
    </>
  );
};

export default Export;
