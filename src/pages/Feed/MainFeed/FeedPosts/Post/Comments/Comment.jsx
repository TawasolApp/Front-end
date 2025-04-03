import { useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FlagIcon from "@mui/icons-material/Flag";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import ActorHeader from "../../../../GenericComponents/ActorHeader";
import DropdownMenu from "../../../../GenericComponents/DropdownMenu";
import ActivitiesHolder from "./ActivitiesHolder";
import CommentThreadWrapper from "./CommentThreadWrapper";
import ReactionsModal from "../../ReactionModal/ReactionsModal";
import AddForm from "./AddForm";
import { formatDate } from "../../../../../../utils";
import TextViewer from "../../../../GenericComponents/TextViewer";
import { usePost } from "../../PostContext";
import ReplyContainer from "./ReplyContainer";

const Comment = ({ comment }) => {
  const { handleDeleteComment, handleEditComment, handleReactOnComment, handleAddReplyToComment } =
    usePost();

  // TODO: change this to redux states
  const currentAuthorId = "mohsobh";

  const [showReactions, setShowReactions] = useState(false);
  const [editorMode, setEditorMode] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  let menuItems = [
    {
      text: "Report comment",
      onClick: () => console.log("Reported post"), // TODO: when reporting is implemented
      icon: FlagIcon,
    },
  ];

  if (comment.authorId === currentAuthorId) {
    menuItems.push({
      text: "Edit comment",
      onClick: () => setEditorMode(true),
      icon: EditIcon,
    });
    menuItems.push({
      text: "Delete comment",
      onClick: () => handleDeleteComment(comment.id),
      icon: DeleteIcon,
    });
  }

  const handleEditCommentInternal = (text, taggedUsers) => {
    handleEditComment(comment.id, text, taggedUsers);
    setEditorMode(false);
  };

  return (
    <>
      {editorMode ? (
        <div className="px-4">
          <AddForm
            handleAddFunction={handleEditCommentInternal}
            initialText={comment.content}
            initialTaggedUsers={comment.taggedUsers}
            close={() => setEditorMode(false)}
            type="Edit Comment"
          />
        </div>
      ) : (
        <article>
          <div className="flex px-4 pt-1 pb-2">
            <ActorHeader
              authorId={comment.authorId}
              authorName={comment.authorName}
              authorBio={comment.authorBio}
              authorPicture={comment.authorPicture}
              iconSize={32}
            />
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-textDate">
                {formatDate(comment.timestamp)}
              </span>
              <DropdownMenu menuItems={menuItems} position="right-0">
                <button className="text-icon hover:bg-buttonIconHover rounded-full p-1">
                  <MoreHorizIcon className="w-5 h-5" />
                </button>
              </DropdownMenu>
            </div>
          </div>

          <CommentThreadWrapper hasReplies={showReplies}>
            <div className="pl-2">
              <TextViewer
                text={comment.content}
                maxChars={200}
                maxLines={2}
                taggedUsers={comment.taggedUsers}
              />
            </div>
          </CommentThreadWrapper>

          <CommentThreadWrapper hasReplies={showReplies}>
            <div className="pl-1 pt-1">
              <ActivitiesHolder
                currentReaction={comment.reactType}
                reactions={comment.reactions}
                handleReaction={(reactionTypeAdd, reactionTypeRemove) =>
                  handleReactOnComment(
                    comment.id,
                    reactionTypeAdd,
                    reactionTypeRemove,
                  )
                }
                setShowReactions={() => setShowReactions(true)}
                replies={comment.replies.length}
                setShowReplies={() => setShowReplies(true)}
              />
            </div>
          </CommentThreadWrapper>

          {showReplies && (
            <ReplyContainer commentId={comment.id}/>
          )}

          {showReactions && (
            <ReactionsModal
              APIURL={`/posts/reactions/${comment.id}`}
              setShowLikes={() => setShowReactions(false)}
            />
          )}
        </article>
      )}
    </>
  );
};

export default Comment;
