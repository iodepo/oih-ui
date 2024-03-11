import React, { useState, useCallback } from "react";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { CardActionArea } from "@mui/material";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";
import { PARTNERS } from "portability/configuration";
import { useAppTranslation } from "context/context/AppTranslation";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
const CarouselPortals = () => {
  const [index, setIndex] = useState(0);

  const handleSlideChange = (index) => {
    setIndex(index);
  };

  const handleNextSlide = useCallback(() => {
    setIndex((prevIndex) => (prevIndex + 1) % PARTNERS.length);
  }, [setIndex]);

  const handlePrevSlide = useCallback(() => {
    setIndex((prevIndex) => (prevIndex - 1 + 3) % PARTNERS.length);
  }, [setIndex]);

  const palette = "custom.homepage.carouselPortals.";
  const translationState = useAppTranslation();
  return (
    <Container
      maxWidth="xl"
      sx={{
        my: 12,
      }}
    >
      <Grid container>
        <Grid item xs={12} lg={12}>
          <Typography
            fontWeight={{ xs: 800, lg: 700 }}
            sx={{ fontSize: "36px", color: palette + "colorTypography" }}
            gutterBottom
          >
            {translationState.translation["Portals"]}
          </Typography>
        </Grid>
        <Grid item xs={5} lg={12} sx={{ position: "relative", mt: 4 }}>
          <AutoPlaySwipeableViews
            index={index}
            onChangeIndex={handleSlideChange}
          >
            {PARTNERS.map((g, i) => {
              return (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {g.map((p, k) => {
                    return (
                      <Card
                        key={k}
                        sx={{
                          background: "transparent",
                        }}
                        elevation={0}
                      >
                        <CardActionArea
                          component={Link}
                          to={p.url}
                          target="_blank"
                        >
                          <CardMedia
                            component="img"
                            sx={{ height: "100%", width: "250px" }}
                            image={p.icon}
                            alt=""
                          />
                        </CardActionArea>
                      </Card>
                    );
                  })}
                </Box>
              );
            })}
          </AutoPlaySwipeableViews>
          <Box
            sx={{
              position: "absolute",
              marginTop: "8px",
              display: "flex",
              gap: "9px",
              right: 14,
            }}
          >
            <IconButton onClick={handlePrevSlide}>
              <ArrowBackIcon sx={{ color: palette + "colorArrows" }} />
            </IconButton>
            <IconButton onClick={handleNextSlide}>
              <ArrowForwardIcon sx={{ color: palette + "colorArrows" }} />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CarouselPortals;
