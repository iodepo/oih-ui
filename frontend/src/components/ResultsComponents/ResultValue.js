import Box from "@mui/material/Box";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CircleIcon from "@mui/icons-material/Circle";
import completed100 from "../../resources/svg/100Completed.svg";
import completed75 from "../../resources/svg/75Completed.svg";
import completed50 from "../../resources/svg/50Completed.svg";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Icon from "@mui/material/Icon";
import typeMap from "../results/types";
import Link from "@mui/material/Link";
import { dataServiceUrl } from "../../config/environment";

const ResultValue = (props) => {
  const { result } = props;

  function resolveAsUrl(url) {
    const pattern = /^((http|https):\/\/)/;
    if (!pattern.test(url)) {
      return "http://" + url;
    }
    return url;
  }

  var url =
    result["type"] === "Person" || result["type"] === "Organization"
      ? resolveAsUrl(result["id"])
      : result["txt_url"] || resolveAsUrl(result["id"]);
  const { Component } = typeMap[result["type"]];
  const [truncate, setTruncate] = useState(true);
  const jsonLdParams = new URLSearchParams({ id: result["id"] }).toString();
  const sendGoogleEvent = () => {
    gtag("config", "G-MQDK6BB0YQ");
    gtag("event", "click_on_result", {
      oih_result_target: url,
    });

    /*
        //GA4 debug code
        const measurement_id = `G-MQDK6BB0YQ`;
        const api_secret = `dtIVKr8XQHSKJ0FrI4EkDQ`;

        fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${measurement_id}&api_secret=${api_secret}`, {
            method: "POST",
            body: JSON.stringify({
                client_id: 'arno.clientId',
                events: [
                    {
                        name: 'click_on_result_fetch',
                        params: {
                            'target': url
                        },
                    }
                ]
            })
        });

         */
  };

  return (
    <Card
      key={result["id"]}
      sx={{
        borderRadius: 0,
        border: 1,
        borderColor: "rgba(0, 0, 0, 0.12)",

        minHeight: { xs: "225px", lg: "200px" },
      }}
      elevation={0}
    >
      {/* {isVerified && (
        <CardHeader
          avatar={
            <Chip
              avatar={
                <CheckCircleOutlineIcon
                  color="success"
                  sx={{ color: "green" }}
                />
              }
              label="Verified"
              variant="outlined"
              color="success"
              sx={{
                color: "#1A7F37",
                ".MuiChip-avatar": {
                  color: "#2DA44E",
                },
              }}
            />
          }
        />
      )} */}

      <CardContent>
        <Stack spacing={1}>
          <Link href={url} target="_blank" onClick={sendGoogleEvent}>
            <Typography sx={{ fontSize: 21, color: "#0F1A31" }} gutterBottom>
              {result["name"]}
            </Typography>
          </Link>
          <Box>
            {/* <Stack direction={"row"} spacing={2}>
              <Typography
                variant="body2"
                display={"flex"}
                alignItems={"center"}
                sx={{ fontSize: "12px", gap: 1 }}
              >
                <CircleIcon
                  fontSize="small"
                  sx={{ fontSize: "12px", color: "#2B498C" }}
                />
                {topic}
              </Typography>

              <Typography
                variant="body2"
                display={"flex"}
                alignItems={"center"}
                sx={{ fontSize: "12px", gap: 1 }}
              >
                <CircleIcon
                  fontSize="small"
                  sx={{ fontSize: "12px", color: "#40AAD3" }}
                />
                {provider}
              </Typography>
            </Stack> */}
          </Box>
          <Component result={result} />
          {"description" in result && result["type"] !== "Person" && (
            <Typography sx={{ fontSize: "16px" }}>
              {result["description"]}
            </Typography>
          )}

          {/* <Typography
            sx={{ fontSize: "12px", color: "#42526E" }}
            display={"flex"}
            alignItems={"center"}
          >
            <Icon sx={{ padding: 0 }}>
              <img
                alt=""
                src={
                  completeValue === 50
                    ? completed50
                    : completeValue === 75
                    ? completed75
                    : completed100
                }
                height={20}
                width={20}
              />
            </Icon>
            Data completeness{" "}
            {completeValue === 50 ? 50 : completeValue === 75 ? 75 : 100}
            %
            <InfoOutlinedIcon
              sx={{
                marginLeft: 1,
                fontSize: "14px",
                color: "#42526E",
              }}
            />
          </Typography> */}

          <Box
            display={"flex"}
            justifyContent={"space-between"}
            flexDirection={{ xs: "column", lg: "row" }}
            gap={{ xs: 2, lg: 0 }}
          >
            <Typography
              component={"span"}
              sx={{
                fontSize: { xs: "10px", md: "12px" },
                color: "#42526E",
              }}
              display={"flex"}
              alignItems={"center"}
              gap={2}
            >
              {/* <Box display={"flex"} gap={1}>
                <Typography sx={{ fontSize: "12px", color: "#42526E" }}>
                  Contributor(s):
                </Typography>
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "#42526E",
                    bgcolor: "#DFE1E6",
                    fontWeight: 700,
                  }}
                >
                  SCOR/IGBP
                </Typography>
              </Box>
              Authored on{" " + "23-11-2023"} */}
            </Typography>
            <Button
              startIcon={<CodeOutlinedIcon />}
              variant="contained"
              disableElevation
              sx={{
                borderRadius: 2,
                fontWeight: 700,
                backgroundColor: "#EAEDF4",
                textTransform: "none",
                color: "#1A2C54",
              }}
              href={`${dataServiceUrl}/source?${jsonLdParams}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              View JSONLD source
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ResultValue;
