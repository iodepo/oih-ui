import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React from "react";
import CardActionArea from "@mui/material/CardActionArea";

const CardTopic = (props) => {
  const { image, text, counterDocuments, onClick } = props;

  function formatNumber(num) {
    return num.toString();
  }

  return (
    <>
      <CardActionArea onClick={onClick}>
        <Card
          sx={{
            borderRadius: 4,
            minHeight: { xs: "225px", lg: "200px" },
            backgroundColor: "#172B4D",
            border: 2,
            borderColor: "#40AAD31A",
          }}
          elevation={0}
        >
          <CardContent>
            <Stack spacing={2} alignItems={"center"}>
              <Avatar
                src={image}
                sx={{
                  width: 65,
                  height: 65,
                  backgroundColor: "#40AAD31A",
                  "& .MuiAvatar-img": {
                    width: 60,
                    height: 60,
                  },
                }}
              />
              <Chip
                sx={{
                  minWidth: "50px",

                  backgroundColor: "white",
                  ".MuiChip-label": {
                    color: "#172B4D",
                    fontWeight: 700,
                  },
                }}
                label={formatNumber(counterDocuments)}
              />
              <Typography
                variant="subtitle1"
                textAlign={"center"}
                fontWeight={600}
                sx={{ color: "white" }}
              >
                {text}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </CardActionArea>
    </>
  );
};

export default CardTopic;
