import { Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ProfileCard = ({ recipient }) => {
  const navigate = useNavigate();

  const handleUserClick = (userId) => {
    navigate(`/users/${userId}`);
  };

  return (
    <div className="bg-cardBackground overflow-hidden border-b border-cardBorder">
      <div
        key={recipient._id}
        className={
          "p-4 flex items-start gap-3 cursor-pointer transition-colors"
        }
        onClick={() => handleUserClick(recipient._id)}
      >
        {/* Profile picture */}
        <div className="flex-shrink-0">
          <Avatar
            src={recipient.profilePicture || "/placeholder.svg"}
            alt={`${recipient.firstName} ${recipient.lastName}`}
            sx={{ width: 56, height: 56 }}
          />
        </div>

        {/* Person info */}
        <div className="flex-grow">
          <h3 className="text-authorName font-medium hover:underline">
            {recipient.firstName} {recipient.lastName}
          </h3>
          <p className="text-authorBio text-sm line-clamp-2">
            {recipient.headline}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
