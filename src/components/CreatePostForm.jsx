import {
  TextField,
  Box,
  Typography,
  Button,
  TextareaAutosize,
  Alert,
} from "@mui/material";

import { useState } from "react";
import { supabase } from "../client.js";

import { useNavigate } from "react-router";

const placeholderImageUrl =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw3k1c6JaNUexk2h38jFUHu4j3O73P8mgVkw&s";

const CreatePostForm = () => {
  const [formData, setFormData] = useState({
    imgUrl: "",
    title: "",
    description: "",
  });

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Create post in database
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Get the user's uid
    const { data: { user }} = await supabase.auth.getUser();
    if (!user) {
      setError(true);
      setTimeout(() => {
        setError(false);
        setLoading(false);
      }, 2000);
      return;
    }

    // Create post
    const { error: postError } = await supabase.from('Posts').insert({
      user_id: user.id,
      title: formData.title,
      img_url: formData.imgUrl,
      description: formData.description,
    });
    if(postError){
      setError(true);
      setTimeout(() => {
        setError(false);
        setLoading(false);
      }, 2000);
      return;
    }
      
    setLoading(false);
    navigate("/home");
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: { xs: 1, sm: 3 },
        maxWidth: "600px",
        mx: { xs: 1, sm: "auto" },
        mt: 1,
        boxShadow: "1px 2px 4px lightgrey",
      }}
    >
      {/* Image Preview */}
      <Box sx={{ height: "400px", width: 1, mb: 2 }}>
        <Box
          component="img"
          src={formData.imgUrl || placeholderImageUrl}
          sx={{ height: 1, width: 1, objectFit: "cover" }}
        />
      </Box>

      <Typography variant="h2" sx={{ fontSize: "2rem", mb: 2 }}>
        Create Post
      </Typography>

      {/* Image URL */}
      <TextField
        label="Image URL"
        variant="outlined"
        type="url"
        sx={{ mb: 2, width: 1 }}
        required
        name="imgUrl"
        value={formData.imgUrl}
        onChange={handleInputChange}
        disabled={loading}
      />

      {/* Title */}
      <TextField
        label="Title"
        variant="outlined"
        sx={{ mb: 2, width: 1 }}
        name="title"
        required
        value={formData.title}
        onChange={handleInputChange}
        disabled={loading}
      />

      {/* Description */}
      <TextField
        label="Description"
        rows={5}
        placeholder="Description..."
        type="textarea"
        name="description"
        sx={{ mb: 2, width: 1 }}
        multiline
        required
        value={formData.description}
        onChange={handleInputChange}
        disabled={loading}
      />

      <Button
        type="submit"
        variant="contained"
        sx={{ display: "block" }}
        size="large"
        disabled={error || loading}
      >
        Create Post
      </Button>

      {/* Show error message */}
      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          Error creating post...
        </Alert>
      )}
    </Box>
  );
};

export default CreatePostForm;
