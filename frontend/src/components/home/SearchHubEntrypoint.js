import React, { useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { useSearchParam } from "utilities/generalUtility";
import { useNavigate } from "react-router-dom";

export default function SearchHubEntrypoint() {
  const [region, setRegion] = useSearchParam("region", "global");
  const navigate = useNavigate();
  const goToCatalogue = (type) => {
    navigate(`/results/${type}?${region ? "region=" + region : ""}`);
  };
  return (
    <Container maxWidth="md" sx={{ marginBottom: 6 }}>
      <Typography
        fontWeight={{ xs: 800, lg: 700 }}
        sx={{ fontSize: "36px", color: "white" }}
        gutterBottom
      >
        Lorem ipsum dolor sit amet consecte Mauris.
      </Typography>
      <Typography
        sx={{ fontSize: "18px", color: "rgba(255, 255, 255, 0.60);" }}
        gutterBottom
      >
        Lorem ipsum dolor sit amet consectetur. Sit scelerisque gravida commodo
        justo. Ut a sed nisl rutrum leo nulla. Semper a massa facilisis eu et
        orci nec justo.
      </Typography>
      <Button
        variant="contained"
        disableElevation
        sx={{
          borderRadius: { xs: 2, lg: 1 },
          width: { xs: "100%", lg: "auto" },
          backgroundColor: "#40AAD3",
          marginTop: 2,
          textTransform: "none",
        }}
        onClick={() => {
          goToCatalogue("CreativeWork");
        }}
        endIcon={<ArrowRightAltIcon />}
      >
        UNESCO SearchHub
      </Button>
    </Container>
  );
}
