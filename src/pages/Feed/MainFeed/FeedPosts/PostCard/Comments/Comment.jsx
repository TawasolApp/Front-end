import { useState } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FlagIcon from '@mui/icons-material/Flag';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import ActorHeader from '../../../../GenericComponents/ActorHeader';
import DropdownMenu from '../../../../GenericComponents/DropdownMenu';
import ActivitiesHolder from './ActivitiesHolder';
import CommentThreadWrapper from './CommentThreadWrapper';
import ReactionsModal from '../../ReactionModal/ReactionsModal';
import AddForm from './AddForm';
import { formatDate } from '../../../../../../utils';
import { axiosInstance } from '../../../../../../apis/axios';

const Comment = ({
  comment,
  handleDeleteComment
}) => {

  // TODO: change this to redux states
  const currentAuthorId = "mohsobh";
  const currentAuthorName = "Mohamed Sobh";
  const currentAuthorPicture = "https://media.licdn.com/dms/image/v2/D4D03AQH7Ais8BxRXzw/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1721080103981?e=1747872000&v=beta&t=nDnZdgCqkI8v5B2ymXZzluMZVlF6h_o-dN1pA95Fzv4";
  const currentAuthorBio = "Computer Engineering Student at Cairo University";
  const currentAuthorType = "User";

  const [localComment, setLocalComment] = useState(comment);
  const [showReactions, setShowReactions] = useState(false);
  const [editorMode, setEditorMode] = useState(false);

  const handleReaction = (reactionTypeAdd, reactionTypeRemove) => {

    let reacts = {};
    if (reactionTypeAdd) reacts[reactionTypeAdd] = 1;
    if (reactionTypeRemove) reacts[reactionTypeRemove] = 0;

    try {
      axiosInstance.post(`posts/react/${comment.id}`, {
        reactions: reacts,
        postType: "Comment"
      });
      setLocalComment(prev => {
        const newReactions = { ...prev.reactions };
        if (reactionTypeAdd) {
          newReactions[reactionTypeAdd] += 1;
        }
        if (reactionTypeRemove) {
          newReactions[reactionTypeRemove] -= 1;
        }
        return { ...prev, reactions: newReactions };
      });
    } catch (e) {
      console.log(e.message);
    }
  };

  let menuItems = [
    {
      text: 'Report post',
      onClick: () => console.log('Reported post'),
      icon: FlagIcon
    },
  ];
  
  if (localComment.authorId === currentAuthorId) {
    menuItems.push({
      text: 'Edit comment',
      onClick: () => setEditorMode(true),
      icon: EditIcon
    });
    menuItems.push({
      text: 'Delete comment',
      onClick: () => handleDeleteComment(localComment.id),
      icon: DeleteIcon
    });
  }

  const handleEditComment = async (text) => {
    try {
      setEditorMode(false);
      await axiosInstance.patch(`/posts/comments/${localComment.id}`, {
        content: text,
        tagged: []
      });
      setLocalComment(prev => ({
        ...prev,
        content: text
      }))
    } catch (e) {
      console.log(e.message);
    }
  }

  return (
    <>
      {editorMode ? (
        <AddForm
          handleAddFunction={handleEditComment}
          initialText={localComment.content}
          close={() => setEditorMode(false)}
          type="Reply"
        />
      ) : (
        <article>
          <div className="flex px-4 pt-1 pb-2">
            <ActorHeader
              authorId={localComment.authorId}
              authorName={localComment.authorName}
              authorBio={localComment.authorBio}
              authorPicture={localComment.authorPicture}
              iconSize={32}
            />
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-textDate">
                {formatDate(localComment.timestamp)}
              </span>
              <DropdownMenu menuItems={menuItems} position="right-0">
                <button className="text-icon hover:bg-buttonIconHover rounded-full p-1">
                  <MoreHorizIcon className="w-5 h-5" />
                </button>
              </DropdownMenu>
            </div>
          </div>

          <CommentThreadWrapper>
            <div className="pl-2">
              <p className="text-sm font-normal text-textContent">{localComment.content}</p>
            </div>
          </CommentThreadWrapper>

          <CommentThreadWrapper>
            <div className="pl-1 pt-2">
              <ActivitiesHolder
                initReactValue={localComment.reactType}
                reactions={localComment.reactions}
                onReactionChange={handleReaction}
                setShowReactions={() => {setShowReactions(true)}}
                replies={localComment.replies.length}
              />
            </div>
          </CommentThreadWrapper>

          {showReactions && (
            <ReactionsModal
                APIURL={`/posts/reactions/${localComment.id}`}
                setShowLikes={() => setShowReactions(false)}
            />
          )}
        </article>
      )}
    </>
  );
};

export default Comment;