import { useState } from "react";
import { usePost } from "../PostContext";

import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import FlagIcon from "@mui/icons-material/Flag";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import LinkIcon from "@mui/icons-material/Link";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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
  // TODO: change this to redux states
  const currentAuthorId = "mohsobh";
  const currentAuthorName = "Mohamed Sobh";
  const currentAuthorPicture =
    "https://media.licdn.com/dms/image/v2/D4D03AQH7Ais8BxRXzw/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1721080103981?e=1747872000&v=beta&t=nDnZdgCqkI8v5B2ymXZzluMZVlF6h_o-dN1pA95Fzv4";
  const currentAuthorBio = "Computer Engineering Student at Cairo University";
  const currentAuthorType = "User";

  // MODALS
  const [showLikes, setShowLikes] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showReposts, setShowReposts] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
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
      text: `Unfollow ${post.authorName}`,
      onClick: () => console.log("User unfollowed"), // TODO: Phase 3 to integrate with noor
      icon: HighlightOffIcon,
    },
    {
      text: "Copy link to post",
      onClick: () => handleCopyPost(),
      icon: LinkIcon,
    },
  ];

  if (post.authorId === currentAuthorId) {
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
    <div className="bg-cardBackground rounded-none sm:rounded-lg border border-cardBorder mb-4">
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
        setShowReposts={() => setShowReposts(true)}
      />

      <ActivitiesHolder setShowComments={() => setShowComments(true)} />

      {showComments && <CommentsContainer />}

      {showLikes && (
        <ReactionsModal
          APIURL={`/posts/reactions/${post.id}`}
          setShowLikes={() => setShowLikes(false)}
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
