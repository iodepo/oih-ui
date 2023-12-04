import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
export default function Footer() {
  return (
    <Container
      maxWidth="md"
      sx={{
        marginBottom: 6,
      }}
    >
      <Stack spacing={3} alignItems={"center"}>
        <Typography variant="body1" align="center" sx={{ color: "white" }}>
          Lorem ipsum dolor sit amet consectetur. Elementum blandit tincidunt
          sed sit faucibus pellentesque arcu turpis odio. Tempor aliquam
          fermentum at dolor. Aliquam leo blandit sem turpis enim.
        </Typography>
        <Button
          variant="contained"
          disableElevation
          sx={{ width: 200, backgroundColor: "white", color: "#1A2C54" }}
        >
          Discover more
        </Button>
      </Stack>
    </Container>
  );
}
