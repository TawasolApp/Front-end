import React, { useState } from "react";
import CameraIcon from "../../../../assets/icons/camera.svg";

function CoverPhoto({ backgroundImage, isOwner, onImageClick, onUpload }) {
  return (
    <div className="relative w-full h-36 sm:h-44 bg-cover bg-center rounded-t-lg z-0">
      <img
        src={backgroundImage}
        alt="Cover Photo"
        className="w-full h-full object-cover cursor-pointer"
        onClick={() => onImageClick(backgroundImage)}
      />

      {/* Cover Photo Edit Button (ONLY for Owner) */}
      {isOwner ? (
        <button
          className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md cursor-pointer z-50"
          onClick={onUpload} // Open upload modal
        >
          <img src={CameraIcon} alt="Change Cover Photo" className="w-5 h-5" />
        </button>
      ) : null}
    </div>
  );
}

export default CoverPhoto;
