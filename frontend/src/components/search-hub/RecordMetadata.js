import { dataServiceUrl } from "config/environment";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";

const RecordMetadata = () => {
  const { jsonld } = useParams();
  const [jsonFormatted, setJsonFormatted] = useState();

  useEffect(() => {
    const URL = `${dataServiceUrl}/source?${jsonld}`;
    fetch(URL)
      .then((response) => response.json())
      .then((json) => {
        setJsonFormatted(json);
      });
  }, [jsonld]);
  const palette = "custom.resultPage.recordMetadata.";
  return (
    <div id="">
      <Container maxWidth="lg">
        <Box sx={{}}>
          <Box sx={{ padding: "10px", mt: "40px", mb: 2 }}>
            <Typography
              variant="body1"
              alignItems={"start"}
              textAlign="center"
              sx={{
                color: palette + "colorTypography",
                fontWeight: 700,
                fontSize: "22px",
              }}
            >
              No webpage is provided for that record, but its metadata is:
            </Typography>
          </Box>
          <Box
            sx={{
              padding: "40px",
              background: "#E8EDF27F",
            }}
          >
            <JsonView src={jsonFormatted} />
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default RecordMetadata;