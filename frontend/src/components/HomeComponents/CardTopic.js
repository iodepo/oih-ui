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
          }}
          elevation={6}
        >
          <CardContent>
            <Stack spacing={2} alignItems={"center"}>
              <Avatar
                src={image}
                sx={{
                  width: 65,
                  height: 65,
                  backgroundColor: "rgba(64, 170, 211, 0.2)",
                  "& .MuiAvatar-img": {
                    width: 60,
                    height: 60,
                  },
                }}
              />
              <Chip
                sx={{ minWidth: "50px" }}
                label={formatNumber(counterDocuments)}
              />
              <Typography
                variant="subtitle1"
                textAlign={"center"}
                fontWeight={600}
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
