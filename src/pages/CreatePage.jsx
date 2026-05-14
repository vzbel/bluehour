import HeroNav from "../components/hero/HeroNav";
import CreatePostForm from "../components/CreatePostForm";
import { Box } from "@mui/material";

const CreatePage = () => {
  return (
    <Box>
      <HeroNav />
      {/* Create Form */}
      <CreatePostForm />
    </Box>
  );
};

export default CreatePage;
