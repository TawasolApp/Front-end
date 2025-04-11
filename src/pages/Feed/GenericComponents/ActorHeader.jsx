import { Avatar } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import PeopleIcon from "@mui/icons-material/People";
import { formatDate } from "../../../utils";
import { Link } from "react-router-dom";

const ActorHeader = ({
  authorId,
  authorName,
  authorBio,
  authorPicture,
  authorType = "User",
  timestamp,
  visibility,
  iconSize = 48,
  enableLink = true,
  isEdited = false,
}) => {
  return (
    <div className="flex gap-2 max-w-[75%] items-center">
      <div className="flex-shrink-0 items-center">
        <Link
          to={
            authorType === "User"
              ? `/users/${authorId}`
              : `/company/${authorId}`
          }
        >
          <Avatar
            src={authorPicture}
            sx={{
              width: iconSize,
              height: iconSize,
              borderRadius: authorType === "Company" ? "0px" : "50%",
            }}
          />
        </Link>
      </div>

      <div className="flex-1 min-w-0 max-w-[calc(100%-56px)]">
        <div className="flex flex-col max-w-full">
          {enableLink ? (
            <Link
              to={
                authorType === "User"
                  ? `/users/${authorId}`
                  : `/company/${authorId}`
              }
              className="block max-w-full"
            >
              <h3 className="font-medium text-sm text-authorName hover:text-authorNameHover hover:underline truncate">
                {authorName}
              </h3>
              <p className="text-xs font-semibold text-authorBio mt-px truncate max-w-full">
                {authorBio && authorBio.length > 47
                  ? authorBio.slice(0, 47) + "..."
                  : authorBio}
              </p>
            </Link>
          ) : (
            <div className="max-w-full">
              <h3 className="font-medium text-sm text-authorName truncate">
                {authorName}
              </h3>
              <p className="text-xs font-semibold text-authorBio mt-px truncate max-w-48">
                {authorBio}
              </p>
            </div>
          )}

          {timestamp && (
            <div className="flex items-center gap-1 mt-0.5 max-w-full">
              <span className="text-xs font-semibold text-textDate shrink-0">
                {formatDate(timestamp)} •
              </span>
              {visibility === "Public" ? (
                <PublicIcon
                  sx={{
                    fontSize: "14px",
                    verticalAlign: "text-top",
                  }}
                  className="text-textDate shrink-0"
                />
              ) : (
                <PeopleIcon
                  sx={{
                    fontSize: "14px",
                    verticalAlign: "text-top",
                  }}
                  className="text-textDate shrink-0"
                />
              )}
              {isEdited && (
                <span className="text-xs font-semibold text-textDate shrink-0">
                  {" "}
                  • Edited
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActorHeader;
