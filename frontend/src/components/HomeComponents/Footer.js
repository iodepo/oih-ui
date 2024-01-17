import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useAppTranslation } from "ContextManagers/context/AppTranslation";

export default function Footer() {
  const translationState = useAppTranslation();
  const palette = "custom.homepage.footer.";

  return (
    <Container
      maxWidth="md"
      sx={{
        marginBottom: 6,
      }}
    >
      <Stack spacing={3} alignItems={"center"}>
        <Typography
          variant="body1"
          align="center"
          sx={{ color: palette + "labelColor" }}
        >
          {translationState.translation["Description homepage"]}
        </Typography>
        <Button
          variant="contained"
          disableElevation
          sx={{
            width: 200,
            backgroundColor: palette + "bgColorButton",
            color: palette + "labelColorButton",
          }}
        >
          {translationState.translation["Discover more"]}
        </Button>
      </Stack>
    </Container>
  );
}
