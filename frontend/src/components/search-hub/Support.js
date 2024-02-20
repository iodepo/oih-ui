import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import SupportIcon from "@mui/icons-material/Support";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import DialogContent from "@mui/material/DialogContent";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import Divider from "@mui/material/Divider";
import HelpIcon from "@mui/icons-material/Help";
import FlagIcon from "@mui/icons-material/Flag";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Support = () => {
  const [openSupport, setOpenSupport] = useState(false);
  const [selectedWindow, setSelectedWindow] = useState("menu");

  return (
    <>
      <IconButton
        aria-label="support"
        size="large"
        onClick={() => setOpenSupport(true)}
        sx={{
          background: "#2B498C",
          position: "fixed",
          bottom: 25,
          right: 25,
          borderRadius: "16px",
          zIndex: 2,
          "&:hover": {
            transform: "scale(1.1)",
            background: "#2B498C",
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
        <SupportIcon fontSize="inherit" sx={{ color: "#FFFFFF" }} />
      </IconButton>
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
          {selectedWindow !== "menu" ? (
            <IconButton
              aria-label="back"
              onClick={() => setSelectedWindow("menu")}
            >
              <ArrowBackIcon sx={{ color: "#000000" }} />
            </IconButton>
          ) : (
            <Box>Need Help?</Box>
          )}
          <IconButton aria-label="close" onClick={() => setOpenSupport(false)}>
            <CloseIcon sx={{ color: "#000000" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mb: 2 }}>
          {selectedWindow === "menu" && (
            <Fade in={selectedWindow === "menu"}>
              <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <RocketLaunchIcon sx={{ color: "#1A2C54" }} />
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
                            color: "#1A2C54",
                            lineHeight: 2.5,
                          }}
                        >
                          Understanding search
                        </Typography>
                        <IconButton
                          aria-label="close"
                          onClick={() => setSelectedWindow("understanding")}
                        >
                          <KeyboardArrowRightIcon sx={{ color: "#1A2C54" }} />
                        </IconButton>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 400,
                          color: "#BDC7DB",
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
                    <HelpIcon sx={{ color: "#1A2C54" }} />
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
                            color: "#1A2C54",
                            lineHeight: 2.5,
                          }}
                        >
                          Faq
                        </Typography>
                        <IconButton
                          aria-label="close"
                          onClick={() => setSelectedWindow("faq")}
                        >
                          <KeyboardArrowRightIcon sx={{ color: "#1A2C54" }} />
                        </IconButton>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 400,
                          color: "#BDC7DB",
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
                    <FlagIcon sx={{ color: "#1A2C54" }} />
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
                            color: "#1A2C54",
                            lineHeight: 2.5,
                          }}
                        >
                          Report a bug
                        </Typography>
                        <IconButton
                          aria-label="close"
                          onClick={() => setSelectedWindow("report")}
                        >
                          <KeyboardArrowRightIcon sx={{ color: "#1A2C54" }} />
                        </IconButton>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 400,
                          color: "#BDC7DB",
                          lineHeight: 0,
                        }}
                      >
                        Lorem ipsum dolor sit amet consectetur.
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Fade>
          )}

          {selectedWindow === "understanding" && (
            <Fade in={selectedWindow === "understanding"}>
              <Box>Understanding</Box>
            </Fade>
          )}
          {selectedWindow === "faq" && (
            <Fade in={selectedWindow === "faq"}>
              <Box>Faq</Box>
            </Fade>
          )}

          {selectedWindow === "report" && (
            <Fade in={selectedWindow === "report"}>
              <Box>Report</Box>
            </Fade>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Support;
