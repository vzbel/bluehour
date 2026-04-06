import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const FeaturedCard = ({ img, heading, bodyText, buttonText }) => {
  return (
    <Card sx={{ maxWidth: "300px", ":hover": { transform: "scale(102%)"}, transition: "0.2s ease-in-out" }}>
      <CardMedia
        component="img"
        src={img.url}
        alt={img.alt}
        sx={{ height: "300px" }}
      />
      <CardContent sx={{ height: "120px", overflowY: "auto" }}>
        <Typography gutterBottom variant="h5">
          {heading}
        </Typography>
        <Typography variant="body2">{bodyText}</Typography>
      </CardContent>
      <CardActions>
        <Button>{buttonText}</Button>
      </CardActions>
    </Card>
  );
};

export default FeaturedCard;
