/* global Intl */

import React, { useEffect, useState } from "react";

import { dataServiceUrl } from "../../config/environment";
import { useNavigate } from "react-router-dom";
import { useSearchParam } from "utilities/generalUtility";
import { CATEGORIES } from "../../portability/configuration";
import { regionBoundsMap } from "utilities/mapUtility";
import { useAppTranslation } from "context/context/AppTranslation";
import SearchHubEntrypoint from "./SearchHubEntrypoint";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Search from "../search/Search";
import MapViewerEntrypoint from "./MapViewerEntrypoint";
import CardTopic from "./CardTopic";
import CarouselPortals from "./CarouselPortals";
import Typography from "@mui/material/Typography";
import LinkMui from "@mui/material/Link";
import { defaultMatomoPageView } from "utilities/trackingUtility";

const doc_types = [
  "CreativeWork",
  "Person",
  "Organization",
  "Dataset",
  "ResearchProject",
  "Event",
  "Course",
  "Vehicle",
];
const defaultCountState = Object.fromEntries(doc_types.map((e) => [e, 0]));

const formatter = Intl.NumberFormat([], { notation: "compact" });

export default function TypesCount() {
  const [counts, setCounts] = useState(defaultCountState);
  const navigate = useNavigate();
  const [region] = useSearchParam("region");
  const translationState = useAppTranslation();

  useEffect(() => {
    fetch(
      `${dataServiceUrl}/search?rows=0&include_facets=false&${
        region ? "&region=" + region : ""
      }`
    )
      .then((response) => response.json())
      .then((json) => setCounts((prev) => ({ ...prev, ...json.counts })));
  }, [region]);

  useEffect(() => {
    defaultMatomoPageView(true);
  }, []);

  const searchByType = (type) => () => {
    localStorage.setItem(
      "lastOperationUser",
      localStorage.getItem("operationUser")
        ? localStorage.getItem("operationUser")
        : ""
    );
    localStorage.setItem("operationUser", "topic");
    navigate(`/results/${type}?${region ? "region=" + region : ""}`);
  };

  const palette = "custom.homepage.tabs.";
  return (
    <>
      <div id="home">
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Container
            maxWidth="false"
            sx={{
              backgroundColor: palette + "bgColorBox",
              paddingRight: { xs: 0, md: "auto" },
              paddingLeft: { xs: 0, md: "auto" },
            }}
          >
            <Container maxWidth="xl" sx={{ py: { xs: 2, lg: 8 } }}>
              <Grid container spacing={2}>
                <Grid item xs={12} lg={5}>
                  <SearchHubEntrypoint />
                </Grid>
                <Grid
                  item
                  container
                  spacing={2}
                  xs={12}
                  lg={7} /* sx={{ p: "24px" }} */
                >
                  <Grid item xs={12}>
                    <Search />
                  </Grid>
                  <Grid item container spacing={2} xs={12}>
                    {CATEGORIES.map((cat, index) => {
                      if (cat.id !== "SpatialData")
                        return (
                          <Grid key={index} item lg={4} xs={12}>
                            <CardTopic
                              image={cat.icon}
                              text={
                                translationState.translation[cat.text] ?? cat.id
                              }
                              counterDocuments={
                                counts[cat.id] !== undefined
                                  ? formatter.format(counts[cat.id])
                                  : 0
                              }
                              onClick={searchByType(cat.id)}
                            />
                          </Grid>
                        );
                    })}
                    <Grid item lg={4} xs={12}></Grid>
                    <Grid
                      item
                      lg={4}
                      xs={12}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: { xs: "center", lg: "end" },
                      }}
                    >
                      <LinkMui
                        sx={{
                          color: "#40AAD3",
                          textDecoration: "none",
                          cursor: "pointer",
                          transition: "transform 0.3s",
                          "&:hover": {
                            transform: "scale(1.1)",
                          },
                        }}
                        onClick={() => navigate("/matchmaking/offer")}
                      >
                        <Typography variant="subtitle1" noWrap>
                          How to share your data →
                        </Typography>
                      </LinkMui>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Container>
          </Container>
          <MapViewerEntrypoint />
          <CarouselPortals />
        </Box>
      </div>
    </>
  );
}
