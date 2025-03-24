import React, { useState } from "react";
function ProfilePicture({
  profilePictureSrc,
  isOwner,
  onImageClick,
  onUpload,
}) {
  return (
    <div className="relative flex items-center ">
      {/* Profile Picture & Plus Icon as One Unit */}
      <div className="relative">
        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white shadow-md cursor-pointer flex items-center justify-center bg-white">
          <img
            src={profilePictureSrc}
            alt="User Profile"
            className="w-full h-full object-cover "
            onClick={() => onImageClick(profilePictureSrc)}
          />
        </div>

        {/* Move Plus Icon WITH the Profile Picture */}
        {isOwner ? (
          <button
            className="absolute bottom-1 right-1 bg-blue-500 text-white border border-blue-500 p-1 rounded-full shadow-md cursor-pointer flex items-center justify-center w-7 h-7 
  hover:bg-blue-600 hover:border-blue-600 transition"
            onClick={onUpload} // Open upload modal
          >
            &#43; {/* Unicode for plus (+) */}
          </button>
        ) : null}
      </div>
    </div>
  );
}
export default ProfilePicture;
