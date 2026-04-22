import HeroNav from "../components/hero/HeroNav.jsx";

import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { supabase } from "../client.js";
import PostCard from "../components/home/PostCard.jsx";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { CircularProgress } from "@mui/material";

const PostDetailPage = () => {
  let { postId } = useParams();

  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);

  // Get the post with the given ID
  useEffect(() => {
    let ignore = false;
    const getPost = async () => {
      if (!ignore) {
        const { data, error: postError } = await supabase
          .from("Posts")
          .select()
          .eq("id", postId);
        if (postError || data.length === 0) {
          setError(true);
        } else {
          setPost(data[0]);
          setError(false);
        }
      }
    };
    getPost();

    return () => {
      ignore = true;
    };
  }, [postId]);

  // Show error message
  if (error) {
    return (
      <Card
        sx={{
          width: "200px",
          height: "300px",
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ fontSize: "1rem", textAlign: "center" }}>
          Failed to retrieve post
        </Typography>
      </Card>
    );
  }

  return (
    <>
      <HeroNav />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          my: 2,
          gap: 5,
        }}
      >
        {post ? <PostCard post={post} showComments={true} /> : <CircularProgress />}
      </Box>
    </>
  );
};

export default PostDetailPage;
