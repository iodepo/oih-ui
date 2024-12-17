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
import UploadFileSharpIcon from "@mui/icons-material/UploadFileSharp";
import Divider from "@mui/material/Divider";
import HelpIcon from "@mui/icons-material/Help";
import FlagIcon from "@mui/icons-material/Flag";
import { useAppTranslation } from "context/context/AppTranslation";
import ContactSupportSharpIcon from "@mui/icons-material/ContactSupportSharp";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import LinkMui from "@mui/material/Link";

const MatchmakingModal = (props) => {
  const {} = props;
  const [openDialog, setOpenDialog] = useState();

  const navigate = useNavigate();
  const palette = "custom.resultPage.support.";

  const translationState = useAppTranslation();
  return (
    <>
      <LinkMui
        sx={{
          color: palette + "colorLink",
          textDecoration: "none",
          cursor: "pointer",
          transition: "transform 0.3s",
          "&:hover": {
            transform: "scale(1.1)",
          },
        }}
        onClick={() => setOpenDialog(true)}
      >
        <Typography variant="subtitle1" noWrap>
          How to share your data →
        </Typography>
      </LinkMui>

      <Dialog
        onClose={() => setOpenDialog(false)}
        open={openDialog}
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
          <Box>Matchmaking</Box>

          <IconButton aria-label="close" onClick={() => setOpenDialog(false)}>
            <CloseIcon sx={{ color: palette + "iconColor" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2">
                Lorem ipsum dolor sit amet consectetur.
              </Typography>
            </Box>
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <UploadFileSharpIcon sx={{ color: palette + "iconColor" }} />
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
                      Offer Form
                    </Typography>
                    <IconButton onClick={() => navigate("/matchmaking/offer")}>
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
                <ContactSupportSharpIcon
                  sx={{ color: palette + "iconColor" }}
                />
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
                      Demand Form
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

export default MatchmakingModal;
