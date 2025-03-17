import RepeatIcon from '@mui/icons-material/Repeat';

const RepostButton = () => {

    return (
        <button className="flex items-center justify-center gap-1 hover:bg-gray-100 p-2 rounded">
            <RepeatIcon className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-500">Repost</span>
        </button>
    );
};

export default RepostButton;