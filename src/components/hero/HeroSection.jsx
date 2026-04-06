import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import heroImage from "/src/assets/heroImage.jpg";

const heroImageAlt = "A nokia phone showing hearts on its screen";

const HeroSection = () => {
  // Relative position ensures the background image stays within the container only */
  return (
    <Grid
      sx={{
        display: "flex",
        justifyContent: { sm: "center" },
        position: "relative",
        alignItems: "center",
        flexWrap: "wrap-reverse",
        py: { xs: 2, sm: 5 },
        p: 1,
        gap: { xs: 2, sm: 5 },
      }}
    >
      {/* Hero Left */}
      <Box>
        <Typography
          variant="h3"
          fontWeight="bold"
          color="white"
          sx={{
            fontSize: { xs: "2.2rem", sm: "3rem" },
            fontFamily: "monospace",
          }}
        >
          Find your inspiration
        </Typography>
        <Typography
          variant="h3"
          fontWeight="bold"
          color="primary"
          sx={{
            fontSize: { xs: "2.2rem", sm: "3rem" },
            fontFamily: "monospace",
          }}
        >
          for any aesthetic
        </Typography>
        <Button variant="contained" sx={{ mt: 4 }} size="large">
          Join bluehour
        </Button>
      </Box>

      {/* Hero Right */}
      <Box
        sx={{
          width: { xs: 1, sm: "unset" },
          maxWidth: "600px",
          height: { xs: "300px", sm: "500px" },
          cursor: "pointer",
          ":hover": {
            transform: "scale(101%)",
            boxShadow: "1px 2px 10px lightblue",
          },
          transition: "1s ease-in-out",
        }}
        flexShrink={0}
      >
        <Box
          component="img"
          src={heroImage}
          alt={heroImageAlt}
          sx={{ width: 1, height: 1, objectFit: "cover" }}
        ></Box>
      </Box>

      {/* Darkened BG Image */}
      <Box
        sx={{
          backgroundImage: `url(${heroImage})`,
          filter: "brightness(30%)",
          position: "absolute",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: -1,
          width: 1,
          height: 1,
          overflow: "hidden",
        }}
      ></Box>
    </Grid>
  );
};

export default HeroSection;
