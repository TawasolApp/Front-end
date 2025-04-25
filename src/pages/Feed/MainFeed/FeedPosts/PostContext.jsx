import { createContext, useContext, useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../../../apis/axios";

const PostContext = createContext();

export const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePost must be used within a PostProvider");
  }
  return context;
};

export const PostProvider = ({
  children,
  initialPost,
  handleSharePost,
  handleDeletePostExternal,
  currentAuthorId,
  currentAuthorName,
  currentAuthorPicture,
  isAdmin,
}) => {
  const [post, setPost] = useState(initialPost);
  const [comments, setComments] = useState([]);
  const [commentPage, setCommentPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [replies, setReplies] = useState({});
  const abortControllerRef = useRef(null);

  useEffect(() => {
    setPost(initialPost);
  }, [initialPost]);

  const handleEditPost = async (text, media, visibility, taggedUsers) => {
    await axiosInstance.patch(`/posts/${currentAuthorId}/${post.id}`, {
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
      isEdited: true,
    }));
  };

  const handleSavePost = async () => {
    if (post.isSaved) {
      await axiosInstance.delete(`/posts/${currentAuthorId}/save/${post.id}`);
      setPost((prev) => {
        return { ...prev, isSaved: false };
      });
      toast.success("Post unsaved.", {
        position: "bottom-left",
        autoClose: 3000,
      });
    } else {
      await axiosInstance.post(`/posts/${currentAuthorId}/save/${post.id}`);
      setPost((prev) => {
        return { ...prev, isSaved: true };
      });
      toast.success("Post saved", {
        position: "bottom-left",
        autoClose: 3000,
      });
    }
  };

  const handleDeletePost = async () => {
    handleDeletePostExternal(post.headerData ? post.headerData.postId : post.id);
  };

  const handleReactOnPost = async (reactionTypeAdd, reactionTypeRemove) => {
    // initialize json with the agreed format
    let reacts = {};
    if (reactionTypeAdd) reacts[reactionTypeAdd] = 1;
    if (reactionTypeRemove) reacts[reactionTypeRemove] = 0;

    await axiosInstance.post(`/posts/${currentAuthorId}/react/${post.id}`, {
      reactions: reacts,
      postType: "Post",
    });

    setPost((prev) => {
      const newReactions = { ...prev.reactCounts };
      if (reactionTypeAdd) newReactions[reactionTypeAdd] += 1;
      if (reactionTypeRemove) newReactions[reactionTypeRemove] -= 1;
      return {
        ...prev,
        reactCounts: newReactions,
        reactType: reactionTypeAdd || null,
      };
    });
  };

  const handleCopyPost = async () => {
    await navigator.clipboard.writeText(
      `${window.location.origin}/feed/${post.id}`,
    );
    toast.success("Link copied to clipboard.", {
      position: "bottom-left",
      autoClose: 3000,
    });
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

      const response = await axiosInstance.get(`/posts/${currentAuthorId}/comments/${post.id}`, {
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
        const mergedComments = [...prev, ...newComments];
        const uniqueComments = Array.from(
          new Map(
            mergedComments.map((comment) => [comment.id, comment]),
          ).values(),
        );

        return uniqueComments;
      });

      setCommentPage((prev) => prev + 1);
      setHasMoreComments(post.comments > comments.length + newComments.length);
    } catch (e) {
      console.log(e);
      if (e.name === "CanceledError") return;
      if (e.response?.status === 404) {
        setHasMoreComments(false);
      } else {
        throw new Error("Error in fetching comments!");
      }
    }
  };

  const handleAddComment = async (text, taggedUsers) => {
    const response = await axiosInstance.post(`/posts/${currentAuthorId}/comment/${post.id}`, {
      content: text,
      taggedUsers: taggedUsers,
      isReply: false,
    });

    setPost((prev) => ({
      ...prev,
      comments: prev.comments + 1,
    }));

    setComments((prevComments) => [response.data, ...prevComments]);
  };

  const handleEditComment = async (commentId, text, taggedUsers) => {
    await axiosInstance.patch(`/posts/${currentAuthorId}/comment/${commentId}`, {
      content: text,
      tagged: taggedUsers,
      isReply: false,
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
    await axiosInstance.delete(`/posts/${currentAuthorId}/comment/${commentId}`);

    setPost((prev) => ({
      ...prev,
      comments: prev.comments - 1,
    }));

    setCommentPage((prev) => prev - 1);

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
    await axiosInstance.post(`/posts/${currentAuthorId}/react/${commentId}`, {
      reactions: reacts,
      postType: "Comment",
    });

    setComments((prevComments) =>
      prevComments.map((c) =>
        c.id === commentId
          ? {
              ...c,
              reactCounts: {
                ...c.reactCounts, // Ensure we copy the existing reactions properly
                [reactionTypeAdd]: reactionTypeAdd
                  ? (c.reactCounts[reactionTypeAdd] || 0) + 1
                  : c.reactCounts[reactionTypeAdd], // Increment safely
                [reactionTypeRemove]: reactionTypeRemove
                  ? Math.max((c.reactCounts[reactionTypeRemove] || 1) - 1, 0)
                  : c.reactCounts[reactionTypeRemove], // Decrement safely, ensuring no negative values
              },
              reactType: reactionTypeAdd || null,
            }
          : c,
      ),
    );
  };

  const fetchReplies = async (commentId) => {
    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const currentPage = replies[commentId]?.replyPage || 1;
      const response = await axiosInstance.get(`/posts/${currentAuthorId}comments/${commentId}`, {
        params: {
          page: currentPage,
          limit: 2,
          _: Date.now(),
        },
        signal: controller.signal,
      });

      const newReplies = response.data;
      setReplies((prevReplies) => {
        const existingReplies = prevReplies[commentId]?.data || [];
        const mergedReplies = [...existingReplies, ...newReplies];
        const uniqueReplies = Array.from(
          new Map(mergedReplies.map((reply) => [reply.id, reply])).values(),
        ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        const wantedComment = comments.find(
          (comment) => comment.id === commentId,
        );

        return {
          ...prevReplies,
          [commentId]: {
            data: uniqueReplies,
            hasMore: wantedComment.repliesCount > uniqueReplies.length,
            replyPage: currentPage + 1,
          },
        };
      });
    } catch (e) {
      console.log(e);
      if (e.name === "CanceledError") return;
      if (e.response?.status === 500) {
        setReplies((prevReplies) => ({
          ...prevReplies,
          [commentId]: {
            data: prevReplies[commentId]?.data || [],
            hasMore: false,
            replyPage: (prevReplies[commentId]?.replyPage || 1) + 1,
          },
        }));
      } else {
        throw new Error("Error in fetching comments!");
      }
    }
  };

  const handleAddReplyToComment = async (commentId, text, taggedUsers) => {
    const response = await axiosInstance.post(`/posts/${currentAuthorId}/comment/${commentId}`, {
      content: text,
      taggedUsers: taggedUsers,
      isReply: true,
    });

    setReplies((prevReplies) => ({
      ...prevReplies,
      [commentId]: {
        ...prevReplies[commentId],
        data: [...(prevReplies[commentId]?.data || []), response.data],
      },
    }));

    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              repliesCount: comment.repliesCount + 1,
            }
          : comment,
      ),
    );
  };

  const handleEditReplyToComment = async (
    commentId,
    replyId,
    text,
    taggedUsers,
  ) => {
    await axiosInstance.patch(`/posts/${currentAuthorId}/comment/${replyId}`, {
      content: text,
      taggedUsers: taggedUsers,
      isReply: true,
    });

    setReplies((prevReplies) => ({
      ...prevReplies,
      [commentId]: {
        ...prevReplies[commentId],
        data: prevReplies[commentId].data.map((reply) =>
          reply.id === replyId
            ? { ...reply, content: text, taggedUsers }
            : reply,
        ),
      },
    }));
  };

  const handleDeleteReplyToComment = async (commentId, replyId) => {
    await axiosInstance.delete(`/posts/${currentAuthorId}/comment/${replyId}`);

    setReplies((prevReplies) => {
      const existingReplies = prevReplies[commentId]?.data || [];
      const updatedReplies = existingReplies.filter(
        (reply) => reply.id !== replyId,
      );

      const currentPage = prevReplies[commentId]?.replyPage || 1;

      return {
        ...prevReplies,
        [commentId]: {
          ...prevReplies[commentId],
          data: updatedReplies,
          replyPage: Math.max(1, currentPage - 1),
        },
      };
    });

    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              repliesCount: comment.repliesCount - 1,
            }
          : comment,
      ),
    );
  };

  const handleReactOnReplyToComment = async (
    commentId,
    replyId,
    reactionTypeAdd,
    reactionTypeRemove,
  ) => {
    let reacts = {};
    if (reactionTypeAdd) reacts[reactionTypeAdd] = 1;
    if (reactionTypeRemove) reacts[reactionTypeRemove] = 0;
    await axiosInstance.post(`/posts/${currentAuthorId}/react/${replyId}`, {
      reactions: reacts,
      postType: "Comment",
    });

    setReplies((prevReplies) => ({
      ...prevReplies,
      [commentId]: {
        ...prevReplies[commentId],
        data: prevReplies[commentId].data.map((reply) =>
          reply.id === replyId
            ? {
                ...reply,
                reactCounts: {
                  ...reply.reactCounts,
                  [reactionTypeAdd]: reactionTypeAdd
                    ? (reply.reactCounts[reactionTypeAdd] || 0) + 1
                    : reply.reactCounts[reactionTypeAdd],
                  [reactionTypeRemove]: reactionTypeRemove
                    ? Math.max(
                        (reply.reactCounts[reactionTypeRemove] || 1) - 1,
                        0,
                      )
                    : reply.reactCounts[reactionTypeRemove],
                },
                reactType: reactionTypeAdd || null,
              }
            : reply,
        ),
      },
    }));
  };

  const value = {
    /******************************************************** Main parameters ********************************************************/
    post,
    comments,
    replies,

    /***************************************************** Secondary parameters ******************************************************/
    hasMoreComments,
    currentAuthorId,
    currentAuthorName,
    currentAuthorPicture,
    isAdmin,

    /************************************************************** API **************************************************************/
    handleDeletePost,
    handleSharePost,
    handleEditPost,
    handleSavePost,
    handleReactOnPost,
    handleCopyPost,
    fetchComments,
    handleAddComment,
    handleEditComment,
    handleDeleteComment,
    handleReactOnComment,
    fetchReplies,
    handleAddReplyToComment,
    handleEditReplyToComment,
    handleDeleteReplyToComment,
    handleReactOnReplyToComment,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};
