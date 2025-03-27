import { useState } from "react";

const MediaItem = ({ url }) => {
  const isVideo = url?.match(/\.(mp4|mov|avi|webm|video)$/i);

  return (
    <div className="relative w-full h-full bg-gray-100">
      {isVideo ? (
        <video className="w-full h-full object-cover" controls>
          <source src={url} type={`video/${url.split(".").pop()}`} />
        </video>
      ) : (
        <img
          src={url}
          alt="Post media"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      )}
    </div>
  );
};

export default MediaItem;
