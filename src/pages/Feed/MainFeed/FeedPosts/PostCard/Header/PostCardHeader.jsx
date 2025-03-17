import { useState, useEffect, useRef } from 'react';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloseIcon from '@mui/icons-material/Close';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import FlagIcon from '@mui/icons-material/Flag';

import ActorHeader from '../../../../GenericComponents/ActorHeader';
import DropdownMenu from '../../../../GenericComponents/DropdownMenu';

const PostCardHeader = ({ author, timestamp }) => {

    const [isCloseVisible, setIsCloseVisible] = useState(false);

    const menuItems = [
      { 
        text: 'Save post', 
        onClick: () => console.log('Saved post'),
        icon: BookmarkBorderIcon // Import and use actual icon component
      },
      { 
        text: 'Report post',
        onClick: () => console.log('Reported post'),
        icon: FlagIcon
      },
    ];

    return (
        <div className="relative">
          <ActorHeader author={author} timestamp={timestamp} />
    
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