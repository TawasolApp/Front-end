import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";

const SilentRepostHeader = ({ authorId, authorPicture, authorName }) => {
  return (
    <div className="flex items-center bg-cardBackground border-b border-cardBorder mx-3 mb-1  py-2 rounded-t-md">
      <Link to={`/users/${authorId}`} className="flex items-center space-x-2">
        <Avatar
          src={authorPicture}
          alt={authorName}
          sx={{ width: 28, height: 28 }}
        />
        <span className="text-sm text-primaryText font-medium">
          <span className="hover:underline text-authorName font-semibold">
            {authorName}
          </span>{" "}
          <span className="text-authorBio font-normal">reposted this</span>
        </span>
      </Link>
    </div>
  );
};

export default SilentRepostHeader;
