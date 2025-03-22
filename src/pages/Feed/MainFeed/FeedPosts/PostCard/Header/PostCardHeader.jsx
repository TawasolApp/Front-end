import { useState, useEffect, useRef } from 'react';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloseIcon from '@mui/icons-material/Close';


import ActorHeader from '../../../../GenericComponents/ActorHeader';
import DropdownMenu from '../../../../GenericComponents/DropdownMenu';

const PostCardHeader = ({
    authorId,
    authorName,
    authorBio,
    authorPicture,
    timestamp,
    visibility,
    menuItems
  }) => {

    const [isCloseVisible, setIsCloseVisible] = useState(false);

    return (
        <div className="relative">
          <div className="pr-16 pl-3 pt-3 mb-2">
            <ActorHeader
              authorId={authorId}
              authorName={authorName}
              authorPicture={authorPicture}
              authorBio={authorBio}
              timestamp={timestamp}
              visibility={visibility}
            />
          </div>

          <div className="absolute right-3 top-1">
            <div className="flex items-center gap-1">
              <DropdownMenu menuItems={menuItems} position="right-0">
                <button className="text-gray-500 hover:bg-gray-100 rounded-full p-1">
                  <MoreHorizIcon className="w-5 h-5" />
                </button>
              </DropdownMenu>
    
              {isCloseVisible && (
                <button
                  onClick={() => setIsCloseVisible(false)}
                  className="text-gray-500 hover:bg-gray-100 rounded-full p-1"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      );
};

export default PostCardHeader;