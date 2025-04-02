import RepeatIcon from "@mui/icons-material/Repeat";

const RepostButton = () => {
  return (
    <button className="flex p-2 items-center justify-center gap-1 hover:bg-buttonIconHover hover:transition-all duration-200 group">
      <RepeatIcon
        sx={{ fontSize: 16 }}
        className="text-textActivity group-hover:text-textActivityHover"
      />
      <span className="text-sm font-semibold text-textActivity group-hover:text-textActivityHover">
        Repost
      </span>
    </button>
  );
};

export default RepostButton;
