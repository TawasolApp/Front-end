import RepeatIcon from '@mui/icons-material/Repeat';

const RepostButton = () => {

    return (
        <button className="flex p-2 items-center justify-center gap-1 hover:bg-gray-100 hover:transition-all duration-200 group">
            <RepeatIcon sx={{ fontSize: 16 }} className="text-gray-700 group-hover:text-black" />
            <span className="text-sm font-semibold text-gray-700 group-hover:text-black">Repost</span>
        </button>
    );
};

export default RepostButton;