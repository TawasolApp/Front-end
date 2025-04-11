import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";
import RepostButton from "./RepostButton";
import SendButton from "./SendButton";

const ActivitiesHolder = ({ setShowComments }) => {
  return (
    <div className="grid grid-cols-4 gap-0 px-4 py-1 ">
      <LikeButton />
      <CommentButton setShowComments={setShowComments} />
      <RepostButton />
      <SendButton />
    </div>
  );
};

export default ActivitiesHolder;
