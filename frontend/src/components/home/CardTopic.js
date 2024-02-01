import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import React from "react";
import CardActionArea from "@mui/material/CardActionArea";

const CardTopic = (props) => {
  const { image, text, counterDocuments, onClick } = props;

  function formatNumber(num) {
    return num.toString();
  }
  const palette = "custom.homepage.tabs.cards.";
  return (
    <>
      <CardActionArea onClick={onClick}>
        <Card
          sx={{
            borderRadius: 4,
            minHeight: "56px",
            maxHeight: "56px",
            backgroundColor: palette + "bgColor",
            border: 2,
            borderColor: palette + "borderColor",
            display: "flex",
          }}
          elevation={0}
        >
          <CardContent
            sx={{
              display: "flex",
              padding: "12px 8px !important",
              width: "100%",
            }}
          >
            <Stack
              spacing={1}
              direction="row"
              alignItems={"center"}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Box display={"flex"} gap={1} alignItems={"center"}>
                <Avatar
                  src={image}
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: palette + "bgColorAvatar",
                    "& .MuiAvatar-img": {
                      width: 40,
                      height: 30,
                    },
                  }}
                />

                <Typography
                  variant="subtitle2"
                  textAlign={"center"}
                  fontWeight={600}
                  sx={{ color: palette + "labelColor", fontSize: "14px" }}
                >
                  {text}
                </Typography>
              </Box>

              <Chip
                sx={{
                  minWidth: "50px",

                  backgroundColor: palette + "bgColorChip",
                  ".MuiChip-label": {
                    color: palette + "bgColor",
                    fontSize: "12px",
                    fontWeight: 700,
                  },
                }}
                label={formatNumber(counterDocuments)}
              />
            </Stack>
          </CardContent>
        </Card>
      </CardActionArea>
    </>
  );
};

export default CardTopic;
