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

  /*   const get_region_bounds = () => {
    let bounds;
    if (region) bounds = regionBoundsMap[region.replaceAll(" ", "_")];
    if (bounds) return bounds;
    else return "[-90,-180 TO 90,180]";
  }; */

  useEffect(() => {
    fetch(
      `${dataServiceUrl}/search?rows=0&include_facets=false&${
        region ? "&region=" + region : ""
      }`
    )
      .then((response) => response.json())
      .then((json) => setCounts((prev) => ({ ...prev, ...json.counts })));

    /*  fetch(
      `${dataServiceUrl}/search?rows=0&include_facets=false&facetType=the_geom&facetName=${get_region_bounds()}${
        region ? "&region=" + region : ""
      }`
    )
      .then((response) => response.json())
      .then((json) =>
        setCounts((prev) => ({
          ...prev,
          SpatialData: Object.values(json.counts).reduce((x, y) => x + y, 0),
        }))
      ); */
  }, [region]);

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
