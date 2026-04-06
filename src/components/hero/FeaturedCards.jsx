import FeaturedCard from "./FeaturedCard.jsx";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { blue } from "@mui/material/colors";

const cards = [
  {
    img: {
      url: "https://i.pinimg.com/736x/43/26/2e/43262ee6d9d2e4f12fc9a393cabf1bf9.jpg",
      alt: "Blue eyed white dragon on a blue sky",
    },
    heading: "Ethereal Aesthetic",
    bodyText: "Like a blue-eyed white dragon in some ethereal space!",
    buttonText: "Love it",
  },
  {
    img: {
      url: "https://i.pinimg.com/736x/7f/47/1f/7f471f5bf85fc0ea5a2edd984f607cbc.jpg",
      alt: "Monochrome poster of a man with a mask and a target on his eye",
    },
    heading: "Dark Aesthetic",
    bodyText: "For when color is unnecessary and ink speaks volumes.",
    buttonText: "Love it",
  },
  {
    img: {
      url: "https://i.pinimg.com/736x/8f/e9/da/8fe9da14acd9099aa7006301d2656456.jpg",
      alt: "Black cat sitting in a green field",
    },
    heading: "Fairy Aesthetic",
    bodyText: "Because who doesn't want to escape into a fantasy world?",
    buttonText: "Love it",
  },
];

const FeaturedCards = () => {
  return (
    <Box sx={{ mt: 5, py: 5, backgroundColor: blue[700] }}>
      {/* Heading */}
      <Box sx={{ overflow: "auto", color: "white" }}>
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            fontFamily: "monospace",
            fontSize: "2.5rem",
          }}
        >
          Aesthetics Galore
        </Typography>
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            mb: 4,
            fontFamily: "monospace",
            fontSize: "1.5rem",
          }}
        >
          for whatever you want
        </Typography>
      </Box>

      {/* Cards */}
      <Box
        sx={{
          display: "flex",
          gap: 3,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {cards.map((c) => (
          <FeaturedCard
            key={c.heading}
            img={{
              url: c.img.url,
              alt: c.img.alt,
            }}
            heading={c.heading}
            bodyText={c.bodyText}
            buttonText={c.buttonText}
          />
        ))}
      </Box>
    </Box>
  );
};

export default FeaturedCards;
