import HeroNav from "../components/hero/HeroNav";
import EditPostForm from "../components/EditPostForm";
import { Box } from "@mui/material";

const EditPage = () => {
  return (
    <Box>
      <HeroNav />
      {/* Edit Form */}
      <EditPostForm />
    </Box>
  );
};

export default EditPage;