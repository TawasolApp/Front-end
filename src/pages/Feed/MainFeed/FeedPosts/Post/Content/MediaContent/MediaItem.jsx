import { useMemo } from "react";
import PdfViewer from "./PdfViewer";

const MediaItem = ({ url, disabled = false }) => {
  const mediaType = useMemo(() => {
    if (url?.match(/\.pdf$/i)) return "pdf";
    if (url?.match(/\.(mp4|mov|avi|webm|video)$/i)) return "video";
    if (url?.match(/\.(doc|docx|xls|xlsx|ppt|pptx|txt|document)$/i))
      return "document";
    return "image";
  }, [url]);

  const getFileExtension = (url) => {
    return url?.split(".").pop()?.toUpperCase() || "";
  };

  const renderContent = () => {
    switch (mediaType) {
      case "pdf":
        return <PdfViewer url={url} />;

      case "video":
        return (
          <div className="relative w-full h-full">
            <video
              className="w-full h-full object-cover"
              controls={!disabled}
              muted
            >
              <source src={url} type={`video/${url.split(".").pop()}`} />
            </video>
            {/* Add play overlay indicator on all videos for consistency */}
            {disabled && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
                <div className="bg-black/50 rounded-full p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
              </div>
            )}
          </div>
        );

      case "document":
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="flex flex-col items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-md p-3 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-700"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-800">
                {getFileExtension(url)}
              </span>
            </div>
          </div>
        );

      default:
        return (
          <img
            src={url}
            alt="Post media"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        );
    }
  };

  return (
    <div className="relative w-full h-full bg-gray-100 overflow-hidden">
      {renderContent()}
    </div>
  );
};

export default MediaItem;
