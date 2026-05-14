import HeroNav from "../components/hero/HeroNav.jsx";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { supabase } from "../client.js";
import PostCard from "../components/home/PostCard.jsx";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { CircularProgress, Button } from "@mui/material";

const PostDetailPage = () => {
  let { postId } = useParams();

  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

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

  // Get the current user
  useEffect(() => {
    let ignore = false;
    const getUser = async () => {
      if (!ignore) {
        const {
          data: { user: currUser },
        } = await supabase.auth.getUser();
        setUser(currUser);
      }
    };
    getUser();

    return () => {
      ignore = true;
    };
  }, [postId]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete the post?")) {
      await supabase.from("Posts").delete().eq("id", postId);
      navigate("/home");
    }
  };

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

  const canEdit = user && post && user.id === post.user_id;

  return (
    <>
      <HeroNav />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          my: 2,
          gap: 2,
        }}
      >
        {/* Options for editing */}
        {canEdit && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
            <Button
              size="small"
              variant="outlined"
              sx={{ textTransform: "none" }}
              type="button"
            >
              Edit Post
            </Button>
            <Button
              size="small"
              color="error"
              variant="outlined"
              sx={{ textTransform: "none" }}
              type="button"
              onClick={handleDelete}
            >
              Delete Post
            </Button>
          </Box>
        )}

        {post ? (
          <PostCard post={post} showComments={true} />
        ) : (
          <CircularProgress />
        )}
      </Box>
    </>
  );
};

export default PostDetailPage;
