import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

const FeaturedSection = ({ img }) => {
  return (
    <Container sx={{ my: 5 }}>
      {/* Header text */}
      <Box sx={{ mb: 5, textAlign: "center" }} fontFamily="monospace">
        <Typography
          variant="h2"
          sx={{ fontWeight: "bold", fontSize: { xs: "2rem", sm: "2.5rem" } }}
          fontFamily="inherit"
        >
          Display your mood
        </Typography>
        <Typography
          variant="p"
          sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
          fontFamily="inherit"
        >
          show off your style
        </Typography>
      </Box>

      {/* Featured image */}
      <Box
        sx={{
          height: "400px",
          ":hover": { transform: "scale(102%)" },
          transition: "0.2s ease-in-out",
          boxShadow: "1px 2px 5px grey"
        }}
      >
        <Box
          component="img"
          src={img.url}
          alt={img.alt}
          sx={{ width: 1, height: 1, objectFit: "cover" }}
        ></Box>
      </Box>
    </Container>
  );
};

export default FeaturedSection;
