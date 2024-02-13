import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useAppTranslation } from "context/context/AppTranslation";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import MapContainer from "components/map-view/MapContainer";
import { useNavigate } from "react-router-dom";

export default function MapViewerEntrypoint() {
  const translationState = useAppTranslation();
  const palette = "custom.homepage.mapViewerEntrypoint.";

  const navigate = useNavigate();

  const goToMap = () => {
    navigate(`/map-viewer`);
  };
  return (
    <Container
      maxWidth="xl"
      sx={{
        my: 6,
      }}
    >
      <Grid container spacing={4}>
        <Grid item xs={7} sx={{ display: "flex", justifyContent: "end" }}>
          <Box
            sx={{
              height: "370px",
              borderRadius: "30px",
              border: " 6px solid gray",
              width: "1100px",
            }}
          >
            <Box
              sx={{
                height: "100%",
                borderRadius: "30px",
                border: "6px solid black",
                width: "100%",
                position: "relative",
              }}
            >
              <MapContainer isHome={true} />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={5}>
          <Typography
            fontWeight={{ xs: 800, lg: 700 }}
            sx={{ fontSize: "36px", color: palette + "colorTypography" }}
            gutterBottom
          >
            Lorem ipsum dolor sit amet consecte Mauris.
          </Typography>
          <Typography
            sx={{ fontSize: "18px", color: "rgba(255, 255, 255, 0.60);" }}
            gutterBottom
          >
            Lorem ipsum dolor sit amet consectetur. Sit scelerisque gravida
            commodo justo. Ut a sed nisl rutrum leo nulla. Semper a massa
            facilisis eu et orci nec justo.
          </Typography>
          <Button
            variant="contained"
            disableElevation
            sx={{
              borderRadius: { xs: 2, lg: 1 },
              width: { xs: "100%", lg: "auto" },
              backgroundColor: palette + "buttonBgColor",
              marginTop: 2,
              textTransform: "none",
            }}
            onClick={() => {
              goToMap("CreativeWork");
            }}
            endIcon={<ArrowRightAltIcon />}
          >
            UNESCO Viewer
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
