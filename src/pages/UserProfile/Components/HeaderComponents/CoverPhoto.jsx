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
          className="absolute top-2 right-2 bg-white p-2 rounded-full shadow cursor-pointer"
          onClick={onUpload}
        >
          <img src={CameraIcon} alt="Change Cover" className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

export default CoverPhoto;
