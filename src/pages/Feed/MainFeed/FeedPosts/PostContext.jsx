import { createContext, useContext, useState, useRef } from "react";
import { axiosInstance } from "../../../../apis/axios";

// TODO: change this to redux states
const currentAuthorId = "mohsobh";

const PostContext = createContext();

export const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePost must be used within a PostProvider");
  }
  return context;
};

export const PostProvider = ({ children, initialPost, handleDeletePost }) => {
  const [post, setPost] = useState(initialPost);
  const [comments, setComments] = useState([]);
  const [commentPage, setCommentPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const abortControllerRef = useRef(null);

  const handleEditPost = async (text, media, visibility, taggedUsers) => {
    await axiosInstance.patch(`/posts/${post.id}`, {
      authorId: currentAuthorId,
      content: text,
      media: media,
      taggedUsers: taggedUsers,
      visibility: visibility,
    });

    setPost((prev) => ({
      ...prev,
      content: text,
      taggedUsers: taggedUsers,
      media: media,
      visibility: visibility,
    }));
  };

  const handleSavePost = async () => {
    if (post.isSaved) await axiosInstance.delete(`posts/save/${post.id}`);
    else await axiosInstance.post(`posts/save/${post.id}`);

    setPost((prev) => {
      return { ...prev, isSaved: !prev.isSaved };
    });
  };

  const handleReactOnPost = async (reactionTypeAdd, reactionTypeRemove) => {
    // initialize json with the agreed format
    let reacts = {};
    if (reactionTypeAdd) reacts[reactionTypeAdd] = 1;
    if (reactionTypeRemove) reacts[reactionTypeRemove] = 0;

    await axiosInstance.post(`posts/react/${post.id}`, {
      reactions: reacts,
      postType: "Post",
    });

    setPost((prev) => {
      const newReactions = { ...prev.reactions };
      if (reactionTypeAdd) newReactions[reactionTypeAdd] += 1;
      if (reactionTypeRemove) newReactions[reactionTypeRemove] -= 1;
      return {
        ...prev,
        reactions: newReactions,
        reactType: reactionTypeAdd || null,
      };
    });
  };

  const handleCopyPost = async () => {
    await navigator.clipboard.writeText(
      `${window.location.origin}/posts/${post.id}`,
    );
  };

  const fetchComments = async () => {
    try {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
  
      // Create new controller for this request
      const controller = new AbortController();
      abortControllerRef.current = controller;
  
      const response = await axiosInstance.get(`/posts/comments/${post.id}`, {
        params: {
          page: commentPage,
          limit: 2,
          _: Date.now(), // Cache buster
        },
        signal: controller.signal,
      });
  
      const newComments = response.data;
  
      setComments((prev) => {
        // Merge and remove duplicates based on comment ID
        const mergedComments = [...newComments, ...prev];
        const uniqueComments = Array.from(
          new Map(mergedComments.map((comment) => [comment.id, comment])).values()
        );
  
        return uniqueComments;
      });
  
      setCommentPage((prev) => prev + 1);
      setHasMoreComments(post.comments > comments.length + newComments.length);
    } catch (e) {
      if (e.name === "CanceledError") return;
      if (e.response?.status === 404) {
        setHasMoreComments(false);
      } else {
        throw new Error("Error in fetching comments!");
      }
    }
  };

  const handleAddComment = async (text, taggedUsers) => {
    const response = await axiosInstance.post(`/posts/comment/${post.id}`, {
      content: text,
      taggedUsers: taggedUsers,
      isReply: false
    });
    setPost((prev) => ({
      ...prev,
      comments: prev.comments + 1,
    }));
    setComments((prevComments) => [response.data, ...prevComments]);
  };

  const handleEditComment = async (commentId, text, taggedUsers) => {
    await axiosInstance.patch(`/posts/comments/${commentId}`, {
      content: text,
      tagged: taggedUsers,
    });
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? { ...comment, content: text, taggedUsers: taggedUsers }
          : comment,
      ),
    );
  };

  const handleDeleteComment = async (commentId) => {
    await axiosInstance.delete(`/posts/comments/${commentId}`);

    setPost((prev) => ({
      ...prev,
      comments: prev.comments - 1,
    }));

    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== commentId),
    );
  };

  const handleReactOnComment = async (
    commentId,
    reactionTypeAdd,
    reactionTypeRemove,
  ) => {
    let reacts = {};
    if (reactionTypeAdd) reacts[reactionTypeAdd] = 1;
    if (reactionTypeRemove) reacts[reactionTypeRemove] = 0;
    await axiosInstance.post(`posts/react/${commentId}`, {
      reactions: reacts,
      postType: "Comment",
    });

    setComments((prevComments) =>
        prevComments.map((c) =>
          c.id === commentId
            ? {
                ...c,
                reactions: {
                  ...c.reactions, // Ensure we copy the existing reactions properly
                  [reactionTypeAdd]: reactionTypeAdd
                    ? (c.reactions[reactionTypeAdd] || 0) + 1
                    : c.reactions[reactionTypeAdd], // Increment safely
                  [reactionTypeRemove]: reactionTypeRemove
                    ? Math.max((c.reactions[reactionTypeRemove] || 1) - 1, 0)
                    : c.reactions[reactionTypeRemove], // Decrement safely, ensuring no negative values
                },
                reactType: reactionTypeAdd || null,
              }
            : c
        )
      );
  };

  const handleAddReplyToComment = async (commentId, text, taggedUsers) => {
    const response = await axiosInstance.post(`/posts/comment/${commentId}`, {
        content: text,
        tagged: taggedUsers,
        isReply: true
    });
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              replies: [...comment.replies, response.data], // Append new reply
            }
          : comment
    ));
  };

  const handleEditReplyToComment = async (replyId, text, taggedUsers) => {};

  const handleDeleteReplyToComment = async (replyId) => {};

  const handleReactOnReplyToComment = async (
    replyId,
    reactionTypeAdd,
    reactionTypeRemove,
  ) => {
    let reacts = {};
    if (reactionTypeAdd) reacts[reactionTypeAdd] = 1;
    if (reactionTypeRemove) reacts[reactionTypeRemove] = 0;
  };

  const value = {
    /******************************************************** Main parameters ********************************************************/
    post,
    comments,

    /***************************************************** Secondary parameters ******************************************************/
    hasMoreComments,

    /************************************************************** API **************************************************************/
    handleDeletePost,
    handleEditPost,
    handleSavePost,
    handleReactOnPost,
    handleCopyPost,
    fetchComments,
    handleAddComment,
    handleEditComment,
    handleDeleteComment,
    handleReactOnComment,
    handleAddReplyToComment,
    handleEditReplyToComment,
    handleDeleteReplyToComment,
    handleReactOnReplyToComment,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};
