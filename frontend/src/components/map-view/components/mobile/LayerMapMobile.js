import React, { useState } from "react";
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
import {
  ARCGIS,
  EMODNET,
  HEATMAP_REGIONS,
  HEXAGON,
  NO_CLUSTER,
  USGS,
} from "components/map-view/utils/constants";
import SettingsIcon from "@mui/icons-material/Settings";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Radio from "@mui/material/Radio";

const LayerMapMobile = (props) => {
  const {
    setOpenLayerDrawer,
    applyZoom,
    openLayerDrawer,
    changeBaseLayer,
    baseLayer,
    openSettingsDrawer,
    setOpenSettingsDrawer,
    changeBaseOpacity,
    baseOpacity,
    changeClustering,
    clustering,
    changeHexOpacity,
    hexOpacity,
    setShowPoints,
    setShowRegions,
    showPoints,
    showRegions,
  } = props;

  const palette = "custom.mapView.mobile.layerMap.";

  const [showClusters, setShowClusters] = useState(false);

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
        onClick={() => {
          setOpenSettingsDrawer(!openSettingsDrawer);
          setOpenLayerDrawer(false);
        }}
      >
        <SettingsIcon sx={{ color: palette + "iconColor" }} />
      </IconButton>
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
        onClick={() => {
          setOpenSettingsDrawer(false);
          setOpenLayerDrawer(!openLayerDrawer);
        }}
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
              defaultValue={baseOpacity}
              min={0}
              step={0.1}
              onChangeCommitted={(e, newValue) => {
                changeBaseOpacity(newValue);
              }}
              max={1}
              valueLabelDisplay="auto"
              sx={{ color: "#2B498C !important" }}
            />
          </Box>
        </Stack>
      </Drawer>
      <Drawer
        anchor="bottom"
        open={openSettingsDrawer}
        onClose={() => setOpenSettingsDrawer(false)}
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
              backgroundColor: palette + "bgBox2",
              height: "100%",
              borderRadius: "6px",
              padding: "12px",
            }}
          >
            <Stack spacing={1}>
              <Typography variant="body2">COMPONENTS</Typography>
              <Stack spacing={2} direction={"column"}>
                <Box
                  sx={{
                    border: "1px solid #DEE2ED",
                    borderRadius: "6px",
                    padding: "12px",
                  }}
                >
                  <Stack spacing={2}>
                    <FormControlLabel
                      control={
                        <Switch
                          size={"small"}
                          checked={showClusters}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            if (checked) {
                              setShowClusters(true);
                              changeClustering(HEXAGON);
                            } else {
                              setShowClusters(false);
                              changeClustering(NO_CLUSTER);
                            }
                          }}
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
                      label={translationState.translation["Show Clustering"]}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Radio
                            disabled={!showClusters}
                            checked={clustering === HEXAGON}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              if (checked) {
                                changeClustering(HEXAGON);
                              } else {
                                changeClustering(NO_CLUSTER);
                              }
                            }}
                            size="small"
                          />
                        }
                        label={translationState.translation["H3 Layer"]}
                        sx={{
                          ".MuiTypography-root": {
                            fontSize: "12px",
                            color: palette + "colorTypography",
                          },
                        }}
                      />
                      <FormControlLabel
                        control={
                          <Radio
                            disabled={!showClusters}
                            checked={clustering === HEATMAP_REGIONS}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              if (checked) {
                                changeClustering(HEATMAP_REGIONS);
                              } else {
                                changeClustering(NO_CLUSTER);
                              }
                            }}
                            size="small"
                          />
                        }
                        label={translationState.translation["Heatmap"]}
                        sx={{
                          ".MuiTypography-root": {
                            fontSize: "12px",
                            color: palette + "colorTypography",
                          },
                        }}
                      />
                    </Box>
                    <Divider variant="middle" />

                    {clustering === HEXAGON && (
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color: palette + "colorTypography",
                          }}
                        >
                          {translationState.translation["Opacity layer"]}
                        </Typography>
                        <Slider
                          disabled={!showClusters}
                          defaultValue={hexOpacity}
                          min={0}
                          step={0.1}
                          onChangeCommitted={(e, newValue) => {
                            if (clustering === HEXAGON)
                              changeHexOpacity(newValue);
                          }}
                          max={1}
                          valueLabelDisplay="auto"
                          sx={{ color: "#2B498C !important" }}
                        />
                      </Box>
                    )}
                  </Stack>
                </Box>
                <Box
                  sx={{
                    border: "1px solid #DEE2ED",
                    borderRadius: "6px",
                    padding: "12px",
                  }}
                >
                  <Stack spacing={2}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={showPoints}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            if (checked) {
                              setShowPoints(true);
                            } else {
                              setShowPoints(false);
                            }
                          }}
                          sx={{
                            ".Mui-checked": { color: "#2B498C !important" },
                          }}
                        />
                      }
                      sx={{
                        ".MuiTypography-root": {
                          fontSize: "12px",
                          fontWeight: 700,
                          color: palette + "colorTypography",
                        },
                      }}
                      label={translationState.translation["Show Points"]}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={showRegions}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            if (checked) {
                              setShowRegions(true);
                            } else {
                              setShowRegions(false);
                            }
                          }}
                          sx={{
                            ".Mui-checked": { color: "#2B498C !important" },
                          }}
                        />
                      }
                      sx={{
                        ".MuiTypography-root": {
                          fontSize: "12px",
                          fontWeight: 700,
                          color: palette + "colorTypography",
                        },
                      }}
                      label={translationState.translation["Show Geometries"]}
                    />
                  </Stack>
                </Box>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Drawer>
    </Box>
  );
};

export default LayerMapMobile;
