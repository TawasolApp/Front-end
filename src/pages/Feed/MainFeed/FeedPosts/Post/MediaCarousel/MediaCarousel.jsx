import { useState } from "react";

const MediaCarousel = ({ media, mediaIndex }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(mediaIndex);

  const handleNext = () => {
    setCurrentMediaIndex((prev) => Math.min(prev + 1, media.length - 1));
  };

  const handlePrev = () => {
    setCurrentMediaIndex((prev) => Math.max(prev - 1, 0));
  };

  // Determine media type from URL
  const getMediaType = (url) => {
    return url.includes(".mp4") ? "video" : "image";
  };

  return (
    <div className="relative h-full w-full flex items-center justify-center">
      {/* Media container */}
      <div className="w-full h-full flex items-center justify-center z-10">
        {media.map((url, index) => (
          <div
            key={url}
            className={`absolute inset-0 flex items-center justify-center ${
              index === currentMediaIndex ? "opacity-100" : "opacity-0"
            } transition-opacity duration-300`}
          >
            <div className="w-full h-full">
              {getMediaType(url) === "video" ? (
                <video
                  src={url}
                  className="w-full h-full max-w-full max-h-full object-contain z-0"
                  controls
                />
              ) : (
                <img
                  src={url}
                  alt={`Post media ${index + 1}`}
                  className="w-full h-full max-w-full max-h-full object-contain z-0"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handlePrev}
        disabled={currentMediaIndex === 0}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/75 transition-colors z-20"
      >
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={handleNext}
        disabled={currentMediaIndex === media.length - 1}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/75 transition-colors z-20"
      >
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};

export default MediaCarousel;