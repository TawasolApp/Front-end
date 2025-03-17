import { Avatar } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import { formatDistanceToNow } from 'date-fns';

const ActorHeader = ({
    author,
    timestamp,
    iconSize=48,
}) => {

    return (
        <div className={`flex items-start gap-2 w-full`}>

            <a className="hover:underline flex-shrink-0">
                <Avatar
                    src={author.avatar}
                    sx={{
                        width: iconSize,
                        height: iconSize,
                        borderRadius: '50%'
                    }}
                />
            </a>

            <div className={`flex-1 min-w-0 max-w-${iconSize}`}>

                <a className="hover:underline block">
                    <h3 className="font-medium text-gray-900 text-sm leading-tight truncate">
                        {author.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-px truncate">
                        {author.title}
                    </p>
                </a>

                {timestamp && (
                    <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(timestamp))} •
                    </span>
                    <PublicIcon
                        sx={{
                            fontSize: '14px',
                            verticalAlign: 'text-top'
                        }}
                        className="text-gray-500"
                    />
                </div>
                )}
                
            </div>

        </div>
    );
};

export default ActorHeader;