import HeroNav from "../components/HeroNav.jsx";
import HeroSection from "../components/HeroSection.jsx";
import Box from "@mui/material/Box";
import FeaturedSection from "../components/FeaturedSection.jsx";

const HeroPage = () => {
  const featuredImg = {
    url: "https://i.pinimg.com/1200x/6f/f3/fb/6ff3fbc2e6bb8afb08a9aaf0189a3388.jpg",
    alt: "Fluid frutiger aero 3D render",
  };

  return (
    <Box>
      <HeroNav />
      <HeroSection />
      <FeaturedSection img={featuredImg} />
    </Box>
  );
};

export default HeroPage;
