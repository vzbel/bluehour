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
import Divider from "@mui/material/Divider";

import Typography from "@mui/material/Typography";

import "../../styles/PostCard.css";
import { supabase } from "../../client";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import {
  addRepost,
  addUpvote,
  hasReposted,
  hasUpvoted,
  removeRepost,
  removeUpvote,
} from "../../services/posts";

import { Link } from "react-router";

const PostCard = ({ post, showComments = false }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);
  const [interactions, setInteractions] = useState({
    upvotesCount: 0,
    commentsCount: 0,
    repostsCount: 0,
  });
  const [hashtags, setHashtags] = useState([]);
  const [comments, setComments] = useState([]);
  const [interactionInProgress, setInteractionInProgress] = useState(false);

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

  // Get comments
  useEffect(() => {
    if (!showComments) {
      return;
    }

    let ignore = false;
    const getComments = async () => {
      if (!ignore) {
        // ! is used for inner join
        const { data, error } = await supabase
          .from("Post_comments")
          .select(
            `post_id, created_at, comment, Profiles!inner(user_id, handle, pfp_url)`,
          )
          .eq("post_id", post.id);

        if (error) {
          setError(true);
        } else {
          const newComments = data.map((c) => {
            const comment = { ...c, ...c.Profiles };
            delete comment.Profiles;
            return comment;
          });

          setComments([...newComments]);
          setError(false);
        }
      }
    };

    getComments();

    return () => {
      ignore = true;
    };
  }, [showComments, post]);
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
    setInteractionInProgress(true);
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
      setInteractionInProgress(false);
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
    setInteractionInProgress(false);
  };

  const handleRepost = async () => {
    setInteractionInProgress(true);
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
      setInteractionInProgress(false);
      return;
    }

    const alreadyReposted = await hasReposted(post.id, currentUser.id);
    if (alreadyReposted) {
      const { error } = await removeRepost(post.id, currentUser.id);
      if (!error) {
        setInteractions({
          ...interactions,
          repostsCount: Math.max(interactions.repostsCount - 1, 0),
        });
      }
    } else {
      const { error } = addRepost(post.id, currentUser.id);
      if (!error) {
        setInteractions({
          ...interactions,
          repostsCount: interactions.repostsCount + 1,
        });
      }
    }

    setInteractionInProgress(false);
  };

  const handleComment = async () => {};

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
          <IconButton
            sx={{ borderRadius: 0 }}
            onClick={handleUpvote}
            disabled={interactionInProgress}
          >
            <ArrowUpward sx={{ mr: 0.5 }} />
            <Typography sx={{ fontSize: "0.9rem" }}>
              {interactions.upvotesCount}
            </Typography>
          </IconButton>

          <Link to={`/posts/${post.id}`}>
            <IconButton
              sx={{ borderRadius: 0 }}
              onClick={handleComment}
              disabled={interactionInProgress}
            >
              <ChatBubble sx={{ mr: 0.5 }} />
              <Typography sx={{ fontSize: "0.9rem" }}>
                {interactions.commentsCount}
              </Typography>
            </IconButton>
          </Link>

          <IconButton
            sx={{ borderRadius: 0 }}
            onClick={handleRepost}
            disabled={interactionInProgress}
          >
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

      {showComments && comments.length > 0 ? (
        <Box sx={{backgroundColor: "#f9f8f8"}}>
          <CardContent sx={{ mb: 2, py: 0 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography
              variant="h3"
              sx={{ fontSize: "1rem", fontWeight: "500" }}
            >
              Comments
            </Typography>
          </CardContent>
          {comments.map((c) => (
            <CardContent
              key={c.user_id + c.comment}
              sx={{ display: "flex", gap: 2, alignItems: "center", borderLeft: "2px solid", borderBottom: "1px dotted", ml: 2 }}
            >
              <Avatar src={c.pfp_url} />
              <Box>
                <Typography sx={{ fontSize: "0.85rem", color: "grey" }}>
                  {c.handle}
                </Typography>
                <Typography sx={{ fontSize: "0.80rem" }}>
                  {c.comment}
                </Typography>
              </Box>
            </CardContent>
          ))}
        </Box>
      ) : (
        <></>
      )}
    </Card>
  );
};

export default PostCard;
