import { useState } from "react";
import FlagIcon from "@mui/icons-material/Flag";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DropdownMenu from "../../../../GenericComponents/DropdownMenu";
import ActorHeader from "../../../../GenericComponents/ActorHeader";
import ActivitiesHolder from "./ActivitiesHolder";
import { formatDate } from "../../../../../../utils";
import CommentThreadWrapper from "./CommentThreadWrapper";
import { usePost } from "../../PostContext";

const Reply = ({ reply }) => {

  const { handleReactOnReplyToComment } = usePost();

  const menuItems = [
    {
      text: "Report post",
      onClick: () => console.log("Reported post"),
      icon: FlagIcon,
    },
  ];


  return (
    <CommentThreadWrapper hasReplies={true}>
      <div className="items-start px-4 pt-1">
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

        <p className="text-sm text-gray-800 mt-1">{reply.text}</p>

        <ActivitiesHolder
          currentReaction={reply.reactType}
          reactions={reply.reactions}
          handleReaction={(reactionTypeAdd, reactionTypeRemove) =>
            handleReactOnReplyToComment(
              reply.id,
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
  );
};
export default Reply;
