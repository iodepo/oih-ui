import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import SupportIcon from "@mui/icons-material/Support";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Typography from "@mui/material/Typography";
import DialogContent from "@mui/material/DialogContent";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import Divider from "@mui/material/Divider";
import HelpIcon from "@mui/icons-material/Help";
import FlagIcon from "@mui/icons-material/Flag";
import { useAppTranslation } from "context/context/AppTranslation";
import HandshakeIcon from "@mui/icons-material/Handshake";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";

const Support = (props) => {
  const { openTooltipsSupport, setOpenTooltipSupport } = props;
  const [openSupport, setOpenSupport] = useState(false);
  const navigate = useNavigate();
  const translationState = useAppTranslation();

  const palette = "custom.resultPage.support.";
  return (
    <>
      <Tooltip
        PopperProps={{
          disablePortal: true,
        }}
        onClose={() => setOpenTooltipSupport(false)}
        open={openTooltipsSupport}
        disableFocusListener
        disableHoverListener
        disableTouchListener
        title={<Typography variant="body1">Need help?</Typography>}
        arrow
        placement="left"
      >
        <IconButton
          aria-label="support"
          size="large"
          onClick={() => setOpenSupport(true)}
          sx={{
            backgroundColor: palette + "bgIconSupport",
            position: "fixed",
            bottom: 25,
            right: 25,
            borderRadius: "16px",
            zIndex: 2,
            "&:hover": {
              transform: "scale(1.1)",
              backgroundColor: palette + "bgIconSupport",
            },
            "@keyframes pulse": {
              "0%": {
                transform: "scale(1)",
              },
              "50%": {
                transform: "scale(1.1)",
              },
              "100%": {
                transform: "scale(1)",
              },
            },
            "&:hover .MuiSvgIcon-root": {
              animation: "pulse 1s infinite",
            },
          }}
        >
          <SupportIcon
            fontSize="inherit"
            sx={{ color: palette + "colorIconSupport" }}
          />
        </IconButton>
      </Tooltip>

      <Dialog
        onClose={() => setOpenSupport(false)}
        open={openSupport}
        sx={{ ".MuiPaper-root": { width: "512px" } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "27px",
            fontWeight: 500,
            mb: 2,
          }}
        >
          <Box>{translationState.translation["Need help"]}</Box>

          <IconButton aria-label="close" onClick={() => setOpenSupport(false)}>
            <CloseIcon sx={{ color: palette + "iconColor" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <RocketLaunchIcon sx={{ color: palette + "iconColor" }} />
                <Box sx={{ width: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 700,
                        color: palette + "colorTypography",
                        lineHeight: 2.5,
                      }}
                    >
                      {translationState.translation["Understanding Search"]}
                    </Typography>
                    <IconButton
                      onClick={() =>
                        window.open("https://www.google.com", "_blank")
                      }
                    >
                      <KeyboardArrowRightIcon
                        sx={{ color: palette + "iconColor" }}
                      />
                    </IconButton>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 400,
                      color: palette + "colorSubTypography",
                      lineHeight: 0,
                    }}
                  >
                    Lorem ipsum dolor sit amet consectetur.
                  </Typography>
                </Box>
              </Box>
              <Divider variant="middle" sx={{ mt: "20px" }} />
            </Box>
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <HelpIcon sx={{ color: palette + "iconColor" }} />
                <Box sx={{ width: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 700,
                        color: palette + "colorTypography",
                        lineHeight: 2.5,
                      }}
                    >
                      {translationState.translation["Faq"]}
                    </Typography>
                    <IconButton
                      onClick={() =>
                        window.open("https://www.google.com", "_blank")
                      }
                    >
                      <KeyboardArrowRightIcon
                        sx={{ color: palette + "iconColor" }}
                      />
                    </IconButton>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 400,
                      color: palette + "colorSubTypography",
                      lineHeight: 0,
                    }}
                  >
                    Lorem ipsum dolor sit amet consectetur.
                  </Typography>
                </Box>
              </Box>
              <Divider variant="middle" sx={{ mt: "20px" }} />
            </Box>
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <FlagIcon sx={{ color: palette + "iconColor" }} />
                <Box sx={{ width: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 700,
                        color: palette + "colorTypography",
                        lineHeight: 2.5,
                      }}
                    >
                      {translationState.translation["Report bug"]}
                    </Typography>
                    <IconButton
                      onClick={() =>
                        window.open("https://www.google.com", "_blank")
                      }
                    >
                      <KeyboardArrowRightIcon
                        sx={{ color: palette + "iconColor" }}
                      />
                    </IconButton>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 400,
                      color: palette + "colorSubTypography",
                      lineHeight: 0,
                    }}
                  >
                    Lorem ipsum dolor sit amet consectetur.
                  </Typography>
                </Box>
              </Box>
              <Divider variant="middle" sx={{ mt: "20px" }} />
            </Box>
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <HandshakeIcon sx={{ color: palette + "iconColor" }} />
                <Box sx={{ width: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 700,
                        color: palette + "colorTypography",
                        lineHeight: 2.5,
                      }}
                    >
                      Matchmaking
                    </Typography>
                    <IconButton onClick={() => navigate("/matchmaking/demand")}>
                      <KeyboardArrowRightIcon
                        sx={{ color: palette + "iconColor" }}
                      />
                    </IconButton>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 400,
                      color: palette + "colorSubTypography",
                      lineHeight: 0,
                    }}
                  >
                    Lorem ipsum dolor sit amet consectetur.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Support;
