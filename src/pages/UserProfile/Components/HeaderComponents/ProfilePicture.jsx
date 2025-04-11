import React from "react";

function ProfilePicture({
  profilePictureSrc,
  isOwner,
  onImageClick,
  onUpload,
}) {
  const isDefault = profilePictureSrc?.includes("defaultProfilePicture");

  return (
    <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full  border-4 border-white shadow-lg bg-white">
      <img
        src={profilePictureSrc}
        alt="Profile"
        className="w-full h-full object-cover cursor-pointer rounded-full "
        onClick={() => {
          if (!isDefault) {
            onImageClick(profilePictureSrc);
          }
        }}
      />
      {isOwner && (
        <button
          className="absolute bottom-1  -right-1 w-7 h-7 bg-blue-400 text-white rounded-full flex items-center justify-center border-2 border-white shadow z-50"
          onClick={onUpload}
          title="Edit Profile Picture"
        >
          {profilePictureSrc?.includes("defaultProfilePicture") ? "+" : "✎"}
        </button>
      )}
    </div>
  );
}

export default ProfilePicture;
