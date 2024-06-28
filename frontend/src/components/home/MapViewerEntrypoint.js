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
      <Grid
        container
        spacing={4}
        /*  sx={{ flexDirection: { xs: "column-reverse", lg: "unset" } }} */
      >
        <Grid
          item
          xs={12}
          lg={12}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Box
            sx={{
              height: "600px",
              borderRadius: "30px",
              border: "10px solid gray",
              width: "100%",
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
        <Grid
          xs={12}
          item
          lg={12}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          {/* <Typography
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
          </Typography> */}
          <Button
            variant="contained"
            disableElevation
            sx={{
              borderRadius: { xs: 2, lg: 1 },
              width: "auto",
              backgroundColor: palette + "buttonBgColor",
              fontSize: "20px",
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
