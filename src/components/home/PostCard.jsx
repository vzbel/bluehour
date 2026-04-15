import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";

import IconButton from "@mui/material/IconButton";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import ChatBubble from "@mui/icons-material/ChatBubble";
import IosShare from "@mui/icons-material/IosShare";
import Repeat from "@mui/icons-material/Repeat";
import Button from "@mui/material/Button";

import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";

import "../../styles/PostCard.css";
import { supabase } from "../../client";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { addUpvote, hasUpvoted, removeUpvote } from "../../services/posts";

const PostCard = ({ post }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);
  const [interactions, setInteractions] = useState({
    upvotesCount: 0,
    commentsCount: 0,
    repostsCount: 0,
  });
  const [hashtags, setHashtags] = useState([]);
  const [alert, setAlert] = useState(null);

  // Retrieve profile of user
  useEffect(() => {
    let ignore = false;
    const getProfile = async () => {
      if (!ignore) {
        const { data, error } = await supabase
          .from("Profiles")
          .select()
          .eq("user_id", post.user_id);

        if (error) {
          setError(true);
        } else {
          setUser(data[0]);
          setError(false);
        }
      }
    };

    getProfile();
    return () => {
      ignore = true;
    };
  }, [post]);

  // Get interaction counts
  useEffect(() => {
    let ignore = false;
    const getUpvotes = async () => {
      if (!ignore) {
        const { count: upvotesCount, error: upvotesError } = await supabase
          .from("Post_upvotes")
          .select("*", { count: "exact", head: true })
          .eq("post_id", post.id);
        if (upvotesError) {
          setError(true);
          return;
        }
        const { count: commentsCount, error: commentsError } = await supabase
          .from("Post_comments")
          .select("*", { count: "exact", head: true })
          .eq("post_id", post.id);
        if (commentsError) {
          setError(true);
          return;
        }
        const { count: repostsCount, error: repostsError } = await supabase
          .from("Post_reposts")
          .select("*", { count: "exact", head: true })
          .eq("post_id", post.id);
        if (repostsError) {
          setError(true);
          return;
        }

        setInteractions({
          ...interactions,
          upvotesCount,
          commentsCount,
          repostsCount,
        });
        setError(false);
      }
    };

    getUpvotes();

    return () => {
      ignore = true;
    };
  }, [post]);

  // Get hashtags
  useEffect(() => {
    let ignore = false;
    const getHashtags = async () => {
      if (!ignore) {
        const { data, error: hashtagsError } = await supabase
          .from("Post_hashtags")
          .select("hashtag")
          .eq("post_id", post.id);
        if (hashtagsError) {
          setError(true);
        } else {
          setHashtags(data.map((h) => h.hashtag));
          setError(false);
        }
      }
    };

    getHashtags();

    return () => {
      ignore = true;
    };
  }, [post]);
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

  // Load until user is found
  if (!user) {
    return <CircularProgress />;
  }

  // Convert date to readable format
  const postDate = new Date(post.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Toggle the upvote depending on
  // if the user has already upvoted it
  const handleUpvote = async () => {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
      return;
    }

    const alreadyUpvoted = await hasUpvoted(post.id, currentUser.id);
    if (alreadyUpvoted) {
      const { error } = await removeUpvote(post.id, currentUser.id);
      if (!error) {
        setInteractions({
          ...interactions,
          upvotesCount: Math.max(interactions.upvotesCount - 1, 0),
        });
      }
    } else {
      const { error } = addUpvote(post.id, currentUser.id);
      if (!error) {
        setInteractions({
          ...interactions,
          upvotesCount: interactions.upvotesCount + 1,
        });
      }
    }
  };

  return (
    <Card sx={{ width: { xs: "300px", sm: "520px" } }}>
      {/* Header */}
      <CardHeader
        avatar={<Avatar src={user.pfp_url} />}
        action={
          <Button variant="outlined" sx={{ textTransform: "none", px: 2.5 }}>
            Follow{" "}
          </Button>
        }
        classes={{ action: "action-no-margin" }}
        title={user.handle}
        subheader={postDate}
      />

      {/* Post image */}
      <CardMedia
        component="img"
        src={post.img_url}
        sx={{ height: 450, objectFit: "cover" }}
      />

      {/* Upvotes, comments, reposts, and share button */}
      <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
          <IconButton sx={{ borderRadius: 0 }} onClick={handleUpvote}>
            <ArrowUpward sx={{ mr: 0.5 }} />
            <Typography sx={{ fontSize: "0.9rem" }}>
              {interactions.upvotesCount}
            </Typography>
          </IconButton>

          <IconButton sx={{ borderRadius: 0 }}>
            <ChatBubble sx={{ mr: 0.5 }} />
            <Typography sx={{ fontSize: "0.9rem" }}>
              {interactions.commentsCount}
            </Typography>
          </IconButton>

          <IconButton sx={{ borderRadius: 0 }}>
            <Repeat sx={{ mr: 0.5 }} />
            <Typography sx={{ fontSize: "0.9rem" }}>
              {interactions.repostsCount}
            </Typography>
          </IconButton>
        </Box>

        <IconButton>
          <IosShare />
        </IconButton>
      </CardActions>

      {/* Body */}
      <CardContent sx={{ py: 1 }}>
        <Typography sx={{ fontSize: "1.05rem", fontWeight: "500" }}>
          {post.title}
        </Typography>
        <Typography sx={{ fontSize: "0.9rem", mt: 1 }}>
          {post.description}
        </Typography>
      </CardContent>

      <CardContent>
        <Typography sx={{ fontSize: "0.9rem", mt: 1, color: "grey" }}>
          {hashtags.length > 0 && `#${hashtags.join(" #")}`}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PostCard;
