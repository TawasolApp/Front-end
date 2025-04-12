import React from "react";
import CameraIcon from "../../../../assets/icons/camera.svg";

function CoverPhoto({ backgroundImage, isOwner, onImageClick, onUpload }) {
  return (
    <div className="relative w-full h-36 sm:h-44 bg-gray-200 rounded-t-md overflow-hidden">
      <img
        src={backgroundImage}
        alt="Cover"
        className="w-full h-full object-cover cursor-pointer"
        onClick={() => onImageClick(backgroundImage)}
      />
      {isOwner && (
        <button
          className="absolute top-2 right-0  p-2 rounded-full "
          onClick={onUpload}
        >
          {backgroundImage?.includes("defaultCoverPhoto") ? (
            <span className="w-8 h-8 rounded-full bg-white hover:bg-gray-200 flex items-center justify-center">
              <img src={CameraIcon} alt="Change Cover" className="w-5 h-5" />
            </span>
          ) : (
            <span className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 transition text-text">
              ✎
            </span>
          )}
        </button>
      )}
    </div>
  );
}

export default CoverPhoto;
