import SendIcon from '@mui/icons-material/Send';

const SendButton = () => {

    return (
        <button className="flex items-center justify-center gap-1 hover:bg-gray-100 p-2 rounded">
            <SendIcon className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-500">Send</span>
        </button>
    );
};

export default SendButton;