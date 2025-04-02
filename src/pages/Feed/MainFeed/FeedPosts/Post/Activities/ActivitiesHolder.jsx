import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";
import RepostButton from "./RepostButton";
import SendButton from "./SendButton";

const ActivitiesHolder = ({
  initReactValue,
  handleReaction,
  setShowComments,
}) => {
  return (
    <div className="grid grid-cols-4 gap-0 px-4 py-1 ">
      <LikeButton
        initReactValue={initReactValue}
        handleReaction={handleReaction}
      />
      <CommentButton setShowComments={setShowComments} />
      <RepostButton />
      <SendButton />
    </div>
  );
};

export default ActivitiesHolder;
