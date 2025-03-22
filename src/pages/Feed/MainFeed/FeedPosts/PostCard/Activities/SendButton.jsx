import SendIcon from '@mui/icons-material/Send';

const SendButton = () => {

    return (
        <button className="p-2 flex items-center justify-center gap-1 hover:bg-gray-100 hover:transition-all duration-200 group">
            <SendIcon sx={{ fontSize: 16 }} className="text-gray-700 group-hover:text-black" />
            <span className="text-sm font-semibold text-gray-700 group-hover:text-black">Send</span>
        </button>
    );
};

export default SendButton;