import HeroNav from "../components/hero/HeroNav";
import Box from "@mui/material/Box";
import PostCard from "../components/home/PostCard.jsx";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import { useEffect, useState } from "react";
import { supabase } from "../client.js";

const POSTS_PER_PAGE = 5;

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(false);

  // Retrieve a few posts
  useEffect(() => {
    let ignore = false;
    const getPosts = async () => {
      if (!ignore) {
        const { data, error } = await supabase
          .from("Posts")
          .select()
          .limit(POSTS_PER_PAGE);
        if (error) {
          setError(true);
        } else {
          setPosts(data);
          setError(false);
        }
      }
    };
    getPosts();

    return () => {
      ignore = true;
    };
  }, []);

  // Error message
  if (error) {
    return (
      <Box>
        <HeroNav />
        <Typography
          variant="h2"
          sx={{ fontSize: "2rem", mt: 2, textAlign: "center" }}
        >
          Failed to retrieve posts.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
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
        {/* Show posts or loading screen */}
        {posts.length > 0 ? (
          <>
            {posts.map((p) => (
              <PostCard post={p} key={p.id} />
            ))}
          </>
        ) : (
          <Typography variant="h5" sx={{mt: 5}}>No posts to show!</Typography>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
