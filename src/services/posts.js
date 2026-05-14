import { supabase } from "../client.js";

// Check if the user has upvoted the post
export const hasUpvoted = async (postId, userId) => {
  const { data, error } = await supabase
    .from("Post_upvotes")
    .select()
    .eq("post_id", postId)
    .eq("user_id", userId);

  if (error) {
    return false;
  }

  return data.length > 0;
};

// Create an upvote row in DB for given user on post
export const addUpvote = async (postId, userId) => {
  return await supabase.from("Post_upvotes").insert({
    post_id: postId,
    user_id: userId,
  });
};

// Remove an upvote row from DB for given user on post
export const removeUpvote = async (postId, userId) => {
  return await supabase
    .from("Post_upvotes")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", userId);
};

// Check if user has reposted the post
export const hasReposted = async (postId, userId) => {
  const { data, error } = await supabase
    .from("Post_reposts")
    .select()
    .eq("post_id", postId)
    .eq("user_id", userId);

  if (error) {
    return false;
  }

  return data.length > 0;
};

// Create repost row in DB for given user on post
export const addRepost = async (postId, userId) => {
  return await supabase.from("Post_reposts").insert({
    post_id: postId,
    user_id: userId,
  });
};

// Remove repost row in DB for given user on post
export const removeRepost = async (postId, userId) => {
  return await supabase
    .from("Post_reposts")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", userId);
};
