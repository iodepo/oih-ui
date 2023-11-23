import React, { useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export default function Header() {
  return (
    <Container maxWidth="md" sx={{ marginBottom: 6 }}>
      <Typography
        mt={6}
        fontWeight={{ xs: 800, lg: 700 }}
        sx={{ typography: { lg: "h3", xs: "h4" } }}
        textAlign={"center"}
        gutterBottom
      >
        Browse across 500,000+ resources in our one-stop-shop ocean data &
        knowledge hub
      </Typography>
    </Container>
  );
}
