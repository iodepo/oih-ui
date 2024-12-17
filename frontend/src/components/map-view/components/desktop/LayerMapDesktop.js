import React from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import Emodnet from "../../../../resources/svg/Emodnet.svg";
import Arcgis from "../../../../resources/svg/Arcgis.svg";
import Usgs from "../../../../resources/svg/Usgs.svg";
import Avatar from "@mui/material/Avatar";
import { ARCGIS, EMODNET, USGS } from "components/map-view/utils/constants";
import { useAppTranslation } from "context/context/AppTranslation";

const LayerMapDesktop = (props) => {
  const {
    openLayerMap,
    baseLayer,
    changeBaseLayer,
    baseOpacity,
    changeBaseOpacity,
  } = props;
  const translationState = useAppTranslation();
  const palette = "custom.mapView.desktop.toolbar.";
  return (
    <Fade in={openLayerMap} mountOnEnter unmountOnExit>
      <Box
        sx={{
          backgroundColor: palette + "bgBox2",
          height: "100%",
          borderRadius: "6px",
          padding: "12px",
        }}
      >
        <Stack spacing={1}>
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
                color: palette + "colorTypographyLayer",
                fontSize: "14px",
              }}
            >
              {translationState.translation["Map Layers"]}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "40px",
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
                  width: "50px",
                  height: "50px",
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
                  color: palette + "colorTypographyLayer",
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
                  width: "50px",
                  height: "50px",
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
                  color: palette + "colorTypographyLayer",
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
                  width: "50px",
                  height: "50px",
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
                  color: palette + "colorTypographyLayer",
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
              defaultValue={baseOpacity}
              min={0}
              step={0.1}
              onChangeCommitted={(e, newValue) => {
                changeBaseOpacity(newValue);
              }}
              max={1}
              valueLabelDisplay="auto"
              sx={{ color: palette + "sliderColor !important" }}
            />
          </Box>
        </Stack>
      </Box>
    </Fade>
  );
};

export default LayerMapDesktop;
