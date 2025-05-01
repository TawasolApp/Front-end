import { useState } from "react";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import FlagIcon from "@mui/icons-material/Flag";
import LinkIcon from "@mui/icons-material/Link";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { usePost } from "../PostContext";
import PostCardHeader from "./Header/PostCardHeader";
import PostContent from "./Content/PostContent";
import EngagementMetrics from "./Metrics/EngagementMetrics";
import ActivitiesHolder from "./Activities/ActivitiesHolder";
import CommentsContainer from "./Comments/CommentsContainer";
import ReactionsModal from "../ReactionModal/ReactionsModal";
import TextModal from "../../SharePost/TextModal";
import DeletePostModal from "../DeleteModal/DeletePostModal";
import SilentRepostHeader from "./Header/SilentRepostHeader";

const PostCard = ({ setShowPostModal, setMediaIndex }) => {
  // MODALS
  const [showLikes, setShowLikes] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    currentAuthorId,
    currentAuthorName,
    currentAuthorPicture,
    isAdmin,
    post,
    handleSavePost,
    handleCopyPost,
    handleEditPost,
    handleDeletePost,
  } = usePost();

  let menuItems = [
    {
      text: post.isSaved ? "Unsave post" : "Save post",
      onClick: () => handleSavePost(),
      icon: post.isSaved ? BookmarkIcon : BookmarkBorderIcon,
    },
    {
      text: "Report post",
      onClick: () => console.log("Reported post"), // TODO: when reporting is implemented
      icon: FlagIcon,
    },
    {
      text: "Copy link to post",
      onClick: () => handleCopyPost(),
      icon: LinkIcon,
    },
  ];

  if (
    (post.authorType === "Company" && isAdmin) ||
    post.authorId === currentAuthorId
  ) {
    menuItems.push({
      text: "Edit post",
      onClick: () => setShowEditModal(true),
      icon: EditIcon,
    });

    menuItems.push({
      text: "Delete post",
      onClick: () => setShowDeleteModal(true),
      icon: DeleteIcon,
    });
  }

  const handleEditPostInternal = (text, media, visibility, taggedUsers) => {
    try {
      handleEditPost(text, media, visibility, taggedUsers);
    } catch (e) {
      setShowEditModal(false);
      console.log(e.message);
    }
  };

  const handleOpenPostModal = (index) => {
    setMediaIndex(index);
    setShowPostModal(true);
  };

  return (
    <div data-testid="post" className="bg-cardBackground rounded-none sm:rounded-lg border border-cardBorder mb-4">
      {post.headerData && (
        <SilentRepostHeader
          authorId={post.headerData.authorId}
          authorPicture={post.headerData.authorPicture}
          authorName={post.headerData.authorName}
        />
      )}

      <PostCardHeader menuItems={menuItems} modal={false} />

      <PostContent
        modal={false}
        handleOpenPostModal={(index) => handleOpenPostModal(index)}
      />

      {post.repostedComponents && (
        <div className="mx-4 mb-2 border rounded-md border-cardBorder">
          <PostCardHeader noRightItems={true} />
          <PostContent
            modal={false}
            handleOpenPostModal={(index) => handleOpenPostModal(index)}
            reposted={true}
          />
        </div>
      )}

      <EngagementMetrics
        setShowLikes={() => setShowLikes(true)}
        setShowComments={() => setShowComments(true)}
      />

      <ActivitiesHolder setShowComments={() => setShowComments(true)} />

      {showComments && <CommentsContainer />}

      {showLikes && (
        <ReactionsModal
          API_URL={`/posts/${currentAuthorId}/reactions/${post.id}`}
          setShowLikes={() => setShowLikes(false)}
          reactCounts={post.reactCounts}
        />
      )}

      {showEditModal && (
        <TextModal
          currentAuthorName={currentAuthorName}
          currentAuthorPicture={currentAuthorPicture}
          setIsModalOpen={() => setShowEditModal(false)}
          handleSubmitFunction={handleEditPostInternal}
          initialText={post.content}
          initialTaggedUsers={post.taggedUsers}
          initialVisiblity={post.visibility}
          initialMedia={post.media}
        />
      )}

      {showDeleteModal && (
        <DeletePostModal
          closeModal={() => setShowDeleteModal(false)}
          deleteFunc={async () => {
            await handleDeletePost(post.id);
            setShowDeleteModal(false);
          }}
          commentOrPost="Post"
        />
      )}
    </div>
  );
};

export default PostCard;
