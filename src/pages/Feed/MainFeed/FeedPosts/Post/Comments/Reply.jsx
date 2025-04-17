import { useState } from "react";
import FlagIcon from "@mui/icons-material/Flag";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DropdownMenu from "../../../../GenericComponents/DropdownMenu";
import ActorHeader from "../../../../GenericComponents/ActorHeader";
import ActivitiesHolder from "./ActivitiesHolder";
import { formatDate } from "../../../../../../utils";
import TextViewer from "../../../../GenericComponents/TextViewer";
import AddForm from "./AddForm";
import ReactionsModal from "../../ReactionModal/ReactionsModal";
import { usePost } from "../../PostContext";
import DeletePostModal from "../../DeleteModal/DeletePostModal";

const Reply = ({ commentId, reply }) => {
  const {
    currentAuthorId,
    handleDeleteReplyToComment,
    handleEditReplyToComment,
    handleReactOnReplyToComment,
  } = usePost();

  const [showReactions, setShowReactions] = useState(false);
  const [editorMode, setEditorMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const menuItems = [
    {
      text: "Report reply",
      onClick: () => console.log("Reported reply"),
      icon: FlagIcon,
    },
  ];

  if (reply.authorId === currentAuthorId) {
    menuItems.push({
      text: "Edit reply",
      onClick: () => setEditorMode(true),
      icon: EditIcon,
    });
    menuItems.push({
      text: "Delete reply",
      onClick: () => setShowDeleteModal(true),
      icon: DeleteIcon,
    });
  }

  const handleEditReplyToCommentInternal = (text, taggedUsers) => {
    handleEditReplyToComment(commentId, reply.id, text, taggedUsers);
    setEditorMode(false);
  };

  return (
    <>
      {editorMode ? (
        <AddForm
          handleAddFunction={handleEditReplyToCommentInternal}
          initialText={reply.content}
          initialTaggedUsers={reply.taggedUsers}
          close={() => setEditorMode(false)}
          type="Edit Reply"
        />
      ) : (
        <>
          <div className="items-start pt-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <ActorHeader
                  authorId={reply.authorId}
                  authorName={reply.authorName}
                  authorBio={reply.authorBio}
                  authorPicture={reply.authorPicture}
                  iconSize={32}
                  enableLink={false}
                />
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-gray-500">
                  {formatDate(reply.timestamp)}
                </span>
                <DropdownMenu menuItems={menuItems} position="right-0">
                  <button className="hover:bg-buttonIconHover rounded-full p-1">
                    <MoreHorizIcon className="w-5 h-5 text-icon" />
                  </button>
                </DropdownMenu>
              </div>
            </div>

            <div className="pl-10 pt-2">
              <TextViewer
                text={reply.content}
                maxChars={100}
                maxLines={1}
                taggedUsers={reply.taggedUsers}
              />
            </div>

            <div className="pl-9 pt-1">
              <ActivitiesHolder
                currentReaction={reply.reactType}
                reactions={reply.reactCounts}
                handleReaction={(reactionTypeAdd, reactionTypeRemove) =>
                  handleReactOnReplyToComment(
                    commentId,
                    reply.id,
                    reactionTypeAdd,
                    reactionTypeRemove,
                  )
                }
                setShowReactions={() => setShowReactions(true)}
                isReply={true}
              />
            </div>
          </div>
          {showReactions && (
            <ReactionsModal
              API_URL={`/posts/reactions/${reply.id}`}
              setShowLikes={() => setShowReactions(false)}
              reactCounts={reply.reactCounts}
            />
          )}
          {showDeleteModal && (
            <DeletePostModal
              closeModal={() => setShowDeleteModal(false)}
              deleteFunc={async () => {
                await handleDeleteReplyToComment(commentId, reply.id);
                setShowDeleteModal(false);
              }}
              commentOrPost="Reply"
            />
          )}
        </>
      )}
    </>
  );
};

export default Reply;
