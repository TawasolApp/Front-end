import AddComment from './AddComment';
import CommentItem from './CommentItem';

const CommentsContainer = ({ comments, onAddComment }) => {
    return (
        <div className="">
            <AddComment onAddComment={onAddComment} />
            {/* <div className="max-h-96 overflow-y-auto">
                {comments && comments.map((comment, index) => (
                    <CommentItem key={index} comment={comment} />
                ))}
            </div> */}
        </div>
    );
};

export default CommentsContainer;