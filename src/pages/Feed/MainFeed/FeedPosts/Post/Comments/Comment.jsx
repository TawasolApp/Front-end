import { useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FlagIcon from "@mui/icons-material/Flag";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatDate } from "../../../../../../utils";
import { usePost } from "../../PostContext";
import ActorHeader from "../../../../GenericComponents/ActorHeader";
import DropdownMenu from "../../../../GenericComponents/DropdownMenu";
import ActivitiesHolder from "./ActivitiesHolder";
import CommentThreadWrapper from "./CommentThreadWrapper";
import ReactionsModal from "../../ReactionModal/ReactionsModal";
import AddForm from "./AddForm";
import TextViewer from "../../../../GenericComponents/TextViewer";
import ReplyContainer from "./ReplyContainer";
import DeletePostModal from "../../DeleteModal/DeletePostModal";

const Comment = ({ comment }) => {
  const {
    currentAuthorId,
    handleDeleteComment,
    handleEditComment,
    handleReactOnComment,
  } = usePost();

  const [showReactions, setShowReactions] = useState(false);
  const [editorMode, setEditorMode] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  let menuItems = [
    {
      text: "Report comment",
      onClick: () => console.log("Reported comment"), // TODO: when reporting is implemented
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
      onClick: () => setShowDeleteModal(true),
      icon: DeleteIcon,
    });
  }

  const handleEditCommentInternal = async (text, taggedUsers) => {
    await handleEditComment(comment.id, text, taggedUsers);
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
          <div className="flex px-4 pt-1 pb-2 items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <ActorHeader
                authorId={comment.authorId}
                authorName={comment.authorName}
                authorBio={comment.authorBio}
                authorPicture={comment.authorPicture}
                authorType={comment.authorType}
                iconSize={32}
              />
            </div>

            <div className="flex-shrink-0 flex items-center gap-2">
              <span className="text-xs text-textDate whitespace-nowrap">
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
                reactions={comment.reactCounts}
                handleReaction={(reactionTypeAdd, reactionTypeRemove) =>
                  handleReactOnComment(
                    comment.id,
                    reactionTypeAdd,
                    reactionTypeRemove,
                  )
                }
                setShowReactions={() => setShowReactions(true)}
                replies={comment.repliesCount}
                setShowReplies={() => setShowReplies(true)}
              />
            </div>
          </CommentThreadWrapper>

          {showReplies && <ReplyContainer commentId={comment.id} />}

          {showReactions && (
            <ReactionsModal
              API_URL={`/posts/${currentAuthorId}/reactions/${comment.id}`}
              setShowLikes={() => setShowReactions(false)}
              reactCounts={comment.reactCounts}
            />
          )}
          {showDeleteModal && (
            <DeletePostModal
              closeModal={() => setShowDeleteModal(false)}
              deleteFunc={async () => {
                await handleDeleteComment(comment.id);
                setShowDeleteModal(false);
              }}
              commentOrPost="Comment"
            />
          )}
        </article>
      )}
    </>
  );
};

export default Comment;
