/* global Intl */

import React, { useEffect, useState } from "react";

import { dataServiceUrl } from "../../config/environment";
import { useNavigate } from "react-router-dom";
import useSearchParam from "../../useSearchParam";
import { regionBoundsMap, HOME_PAGE_CATEGORIES } from "../../constants";
import { useAppTranslation } from "ContextManagers/context/AppTranslation";
import Header from "./Header";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Search from "../Search";
import Footer from "./Footer";
import CardTopic from "./CardTopic";
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

  const get_region_bounds = () => {
    let bounds;
    if (region) bounds = regionBoundsMap[region.replaceAll(" ", "_")];
    if (bounds) return bounds;
    else return "[-90,-180 TO 90,180]";
  };

  useEffect(() => {
    fetch(
      `${dataServiceUrl}/search?rows=0&include_facets=false&${
        region ? "&region=" + region : ""
      }`
    )
      .then((response) => response.json())
      .then((json) => setCounts((prev) => ({ ...prev, ...json.counts })));

    fetch(
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
      );
  }, [region]);

  const searchByType = (type) => (event) =>
    navigate(`/results/${type}?${region ? "region=" + region : ""}`);

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ marginBottom: 6 }}>
        <Box
          width={"100%"}
          sx={{ borderRadius: 2, backgroundColor: "#EAEDF4", marginBottom: 3 }}
        >
          <Grid container spacing={2} p={3}>
            <Search />
            {HOME_PAGE_CATEGORIES.map((cat) => (
              <Grid item lg={3} xs={6}>
                <CardTopic
                  image={cat.icon}
                  text={translationState.translation[cat.text] ?? cat.id}
                  counterDocuments={
                    counts[cat.id] !== undefined
                      ? formatter.format(counts[cat.id])
                      : 0
                  }
                  onClick={searchByType(cat.id)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
      <Footer />
    </>
  );
}
