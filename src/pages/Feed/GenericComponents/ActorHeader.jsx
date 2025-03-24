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
                    <h3 className="font-medium text-sm text-authorName hover:text-authorNameHover hover:underline leading-tight truncate">
                        {authorName}
                    </h3>
                    <p className="text-xs font-semibold text-authorBio mt-px truncate">
                        {authorBio}
                    </p>
                </Link>

                {timestamp && (
                    <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-xs font-semibold text-textDate">
                        {formatDate(timestamp)} •
                    </span>
                    {visibility === "Public" ? (
                        <PublicIcon
                            sx={{
                                fontSize: '14px',
                                verticalAlign: 'text-top'
                            }}
                            className="text-textDate"
                        />
                    ) : (
                        <PeopleIcon
                            sx={{
                                fontSize: '14px',
                                verticalAlign: 'text-top'
                            }}
                            className="text-textDate"
                        />
                    )}
                    
                </div>
                )}
                
            </div>

        </div>
    );
};

export default ActorHeader;