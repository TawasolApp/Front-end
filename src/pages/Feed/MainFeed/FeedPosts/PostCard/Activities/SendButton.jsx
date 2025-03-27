import SendIcon from "@mui/icons-material/Send";

const SendButton = () => {
  return (
    <button className="p-2 flex items-center justify-center gap-1 hover:bg-buttonIconHover hover:transition-all duration-200 group">
      <SendIcon
        sx={{ fontSize: 16 }}
        className="text-textActivity group-hover:text-textActivityHover"
      />
      <span className="text-sm font-semibold text-textActivity group-hover:text-textActivityHover">
        Send
      </span>
    </button>
  );
};

export default SendButton;
