import { Avatar } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import PeopleIcon from '@mui/icons-material/People';
import { formatDate } from '../../../utils';
import { Link } from 'react-router-dom';

const ActorHeader = ({
    authorId,
    authorName,
    authorBio,
    authorPicture,
    timestamp,
    visibility,
    iconSize=48,
}) => {

    return (
        <div className={`flex items-start gap-2 w-full`}>

            <Link to={`/in/${authorId}`}>
                <Avatar
                    src={authorPicture}
                    sx={{
                        width: iconSize,
                        height: iconSize,
                        borderRadius: '50%'
                    }}
                />
            </Link>

            <div className={`flex-1 min-w-0 max-w-${iconSize}`}>
                <Link to={`/in/${authorId}`}>
                    <h3 className="font-medium text-gray-900 text-sm leading-tight truncate hover:text-blue-700 hover:underline">
                        {authorName}
                    </h3>
                    <p className="text-xs text-gray-500 mt-px truncate">
                        {authorBio}
                    </p>
                </Link>

                {timestamp && (
                    <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-xs text-gray-500">
                        {formatDate(timestamp)} •
                    </span>
                    {visibility === "Public" ? (
                        <PublicIcon
                            sx={{
                                fontSize: '14px',
                                verticalAlign: 'text-top'
                            }}
                            className="text-gray-500"
                        />
                    ) : (
                        <PeopleIcon
                            sx={{
                                fontSize: '14px',
                                verticalAlign: 'text-top'
                            }}
                            className="text-gray-500"
                        />
                    )}
                    
                </div>
                )}
                
            </div>

        </div>
    );
};

export default ActorHeader;