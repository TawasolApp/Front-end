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

const Reply = ({ commentId, reply }) => {
  const {
    handleDeleteReplyToComment,
    handleEditReplyToComment,
    handleReactOnReplyToComment,
  } = usePost();

  // TODO: change this to redux states
  const currentAuthorId = "mohsobh";

  const [showReactions, setShowReactions] = useState(false);
  const [editorMode, setEditorMode] = useState(false);

  const menuItems = [
    {
      text: "Report post",
      onClick: () => console.log("Reported post"),
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
      onClick: () => handleDeleteReplyToComment(commentId, reply.id),
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
            <div className="flex">
              <ActorHeader
                authorId={reply.authorId}
                authorName={reply.authorName}
                authorBio={reply.authorBio}
                authorPicture={reply.authorPicture}
                iconSize={32}
              />
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {formatDate(reply.timestamp)}
                </span>
                <DropdownMenu menuItems={menuItems} position="right-0">
                  <button className="text-gray-500 hover:bg-gray-100 rounded-full p-1">
                    <MoreHorizIcon className="w-5 h-5" />
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
                reactions={reply.reactions}
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
              APIURL={`/posts/reactions/${reply.id}`}
              setShowLikes={() => setShowReactions(false)}
            />
          )}
        </>
      )}
    </>
  );
};

export default Reply;
