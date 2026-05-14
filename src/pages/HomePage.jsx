import HeroNav from "../components/hero/HeroNav";
import Box from "@mui/material/Box";
import PostCard from "../components/home/PostCard.jsx";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import SearchIcon from "@mui/icons-material/Search";

import {
  Select,
  MenuItem,
  FormControlLabel,
  FormControl,
  InputLabel,
  Checkbox,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useEffect, useState } from "react";
import { supabase } from "../client.js";

const POSTS_PER_PAGE = 5;

const possibleFilters = ["creation", "upvote", "none"];

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(false);
  const [filters, setFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Retrieve a few posts
  useEffect(() => {
    let ignore = false;
    const getUpvotes = async (postId) => {
      const { count } = await supabase
        .from("Post_upvotes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", postId);
      return count;
    };

    const getPosts = async () => {
      if (!ignore) {
        const { data, error } = await supabase
          .from("Posts")
          .select()
          .limit(POSTS_PER_PAGE)
          .order("created_at", { ascending: false });
        if (error) {
          setError(true);
          return;
        }

        // Retrieve upvote counts for each post
        const upvoteCounts = {};
        for (const p of data) {
          upvoteCounts[p.id] = await getUpvotes(p.id);
        }
        const allPosts = data.map((p) => ({
          ...p,
          upvotes: upvoteCounts[p.id],
        }));
        setPosts(allPosts);
        setError(false);
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

  const handleFilterSelect = (e) => {
    // None cannot be mixed with other filters
    if (e.target.value.find((el) => el === "none")) {
      setFilters(["none"]);
      return;
    }
    setFilters(e.target.value);
  };

  const handleSearchQuery = (e) => {
    setSearchQuery(e.target.value);
  };

  // Apply filters
  let filteredPosts = [];
  if (posts.length > 0) {
    filteredPosts = [...posts];
    for (const f of filters) {
      // Sort by oldest to newest
      if (f === "creation") {
        filteredPosts.sort((p1, p2) => p1.created_at >= p2.created_at);
      } else if (f === "upvote") {
        filteredPosts.sort((p1, p2) => p1.upvotes < p2.upvotes);
      }
    }

    // Apply search query
    if (searchQuery) {
      filteredPosts = filteredPosts.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
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
        }}
      >
        {/* Show posts or loading screen */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            width: { xs: "300px", sm: "520px" },
            mt: 2,
            mb: 3,
          }}
        >
          <Box sx={{ mr: { xs: 2, sm: 4 } }}>
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" }, mb: 0.5 }}
            >
              Posts Home
            </Typography>
            <Typography
              variant="p"
              sx={{
                fontSize: { xs: "0.7rem", sm: "0.9rem" },
                fontWeight: "200",
                display: "block",
              }}
            >
              Browsing all posts
            </Typography>
          </Box>
          {/* Search bar */}
          <TextField
            sx={{ flex: 2 }}
            size="small"
            label="Search..."
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchQuery}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <FormControl
            sx={{ flex: 1, flexShrink: 1, maxWidth: "150px" }}
            size="small"
          >
            <InputLabel id="filter-label">Filter by...</InputLabel>
            <Select
              labelId="filter-label"
              label="Filter by..."
              value={filters}
              onChange={handleFilterSelect}
              multiple
              sx={{ width: "100%" }}
            >
              {possibleFilters.map((f) => (
                <MenuItem key={f} value={f}>
                  {f}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {filteredPosts.map((p) => (
          <PostCard post={p} key={p.id} />
        ))}
      </Box>
    </Box>
  );
};

export default HomePage;
