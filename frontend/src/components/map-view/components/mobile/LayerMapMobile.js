import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useAppTranslation } from "context/context/AppTranslation";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import LayersIcon from "@mui/icons-material/Layers";
import ButtonGroup from "@mui/material/ButtonGroup";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Emodnet from "../../../../resources/svg/Emodnet.svg";
import Arcgis from "../../../../resources/svg/Arcgis.svg";
import Usgs from "../../../../resources/svg/Usgs.svg";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Slider from "@mui/material/Slider";
import { ARCGIS, EMODNET, USGS } from "components/map-view/utils/constants";

const LayerMapMobile = (props) => {
  const {
    setOpenLayerDrawer,
    applyZoom,
    openLayerDrawer,
    changeBaseLayer,
    baseLayer,
  } = props;

  const palette = "custom.mapView.mobile.layerMap.";

  const translationState = useAppTranslation();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        marginLeft: "auto !important",
      }}
    >
      <IconButton
        sx={{
          backgroundColor: palette + "bgButton",
          borderRadius: 2,
          width: "45px",
          "&:hover": {
            backgroundColor: palette + "iconColor",
            "& .MuiSvgIcon-root": {
              color: palette + "bgButton",
            },
          },
          boxShadow: 0,
        }}
        onClick={() => setOpenLayerDrawer(true)}
      >
        <LayersIcon sx={{ color: palette + "iconColor" }} />
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
          <AddIcon sx={{ color: palette + "iconColor" }} />
        </IconButton>
        <IconButton onClick={() => applyZoom("out")}>
          <RemoveIcon sx={{ color: palette + "iconColor" }} />
        </IconButton>
      </ButtonGroup>
      <Drawer
        anchor="bottom"
        open={openLayerDrawer}
        onClose={() => setOpenLayerDrawer(false)}
        sx={{
          ".MuiPaper-root": {
            borderRadius: "24px 24px 0px 0px",
            height: "338px",
            padding: 2,
          },
        }}
      >
        <Stack spacing={2}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: palette + "colorCloseIconTypo",
                fontSize: "14px",
              }}
            >
              {translationState.translation["Map Layers"]}
            </Typography>
            <IconButton
              sx={{ color: palette + "colorCloseIconTypo" }}
              onClick={() => setOpenLayerDrawer(false)}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "20px 32px",
            }}
          >
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems="center"
              sx={{ gap: "24px" }}
            >
              <Avatar
                sx={{
                  width: "66px",
                  height: "66px",
                  borderRadius: "4px",
                  ...(baseLayer === EMODNET && {
                    border: "3px solid",
                    borderColor: palette + "colorSelectedLayer",
                  }),
                }}
                onClick={() => changeBaseLayer(EMODNET)}
                variant="square"
                src={Emodnet}
              />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: palette + "colorCloseIconTypo",
                  fontSize: "14px",
                  ...(baseLayer === EMODNET && {
                    color: palette + "colorSelectedLayer",
                  }),
                }}
              >
                EMODNET
              </Typography>
            </Box>

            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems="center"
              sx={{ gap: "24px" }}
            >
              <Avatar
                sx={{
                  width: "66px",
                  height: "66px",
                  borderRadius: "4px",
                  ...(baseLayer === ARCGIS && {
                    border: "3px solid",
                    borderColor: palette + "colorSelectedLayer",
                  }),
                }}
                onClick={() => changeBaseLayer(ARCGIS)}
                variant="square"
                src={Arcgis}
              />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: palette + "colorCloseIconTypo",
                  fontSize: "14px",
                  ...(baseLayer === ARCGIS && {
                    color: palette + "colorSelectedLayer",
                  }),
                }}
              >
                ARCGIS
              </Typography>
            </Box>

            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems="center"
              sx={{ gap: "24px" }}
            >
              <Avatar
                sx={{
                  width: "66px",
                  height: "66px",
                  borderRadius: "4px",
                  ...(baseLayer === USGS && {
                    border: "3px solid",
                    borderColor: palette + "colorSelectedLayer",
                  }),
                }}
                onClick={() => changeBaseLayer(USGS)}
                variant="square"
                src={Usgs}
              />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: palette + "colorCloseIconTypo",
                  fontSize: "14px",
                  ...(baseLayer === USGS && {
                    color: palette + "colorSelectedLayer",
                  }),
                }}
              >
                USGS
              </Typography>
            </Box>
          </Box>
          <Divider />
          <Box>
            <Typography
              variant="body2"
              sx={{
                fontSize: "14px",
                fontWeight: 700,
                color: palette + "colorTypography",
              }}
            >
              {translationState.translation["Opacity layer"]}
            </Typography>
            <Slider
              defaultValue={50}
              valueLabelDisplay="auto"
              sx={{ color: "#2B498C !important" }}
            />
          </Box>
        </Stack>
      </Drawer>
    </Box>
  );
};

export default LayerMapMobile;
