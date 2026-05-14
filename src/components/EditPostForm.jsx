import {
  TextField,
  Box,
  Typography,
  Button,
  TextareaAutosize,
  Alert,
} from "@mui/material";

import { useState, useEffect } from "react";
import { supabase } from "../client.js";

import { useNavigate, useParams } from "react-router";

const placeholderImageUrl =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw3k1c6JaNUexk2h38jFUHu4j3O73P8mgVkw&s";

const EditPostForm = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    imgUrl: "",
    title: "",
    description: "",
  });

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch post data to prefill form
  useEffect(() => {
    let ignore = false;
    const getPost = async () => {
      if (!ignore) {
        setLoading(true);
        const { data, error: getPostError } = await supabase
          .from("Posts")
          .select()
          .eq("id", postId);

        // Couldn't fetch post
        if (getPostError) {
          setError(true);
          setTimeout(() => {
            setError(false);
          }, 2000);
          setLoading(false);
          return;
        }

        setFormData({
          imgUrl: data[0].img_url,
          title: data[0].title,
          description: data[0].description,
        });
        setLoading(false);
      }
    };

    getPost();

    return () => {
      ignore = true;
    };
  }, [postId]);

  // Update post in database
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Get the user's uid
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError(true);
      setTimeout(() => {
        setError(false);
        setLoading(false);
      }, 2000);
      return;
    }

    // Update post
    const { error: postError } = await supabase
      .from("Posts")
      .update({
        title: formData.title,
        img_url: formData.imgUrl,
        description: formData.description,
      })
      .eq("id", postId);

    if (postError) {
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
        Edit Post
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
        Edit Post
      </Button>

      {/* Show error message */}
      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          Error editing post...
        </Alert>
      )}
    </Box>
  );
};

export default EditPostForm;
