import { usePost } from "../../../PostContext";
import MediaItem from "./MediaItem";
import PdfViewer from "./PdfViewer";

const MediaDisplay = ({ handleOpenPostModal, reposted }) => {
  const { post } = usePost();
  const media = reposted ? post.repostedComponents.media : post.media;

  if (!media || media.length === 0) return null;

  const mediaCount = media.length;
  const remaining = mediaCount > 4 ? mediaCount - 4 : 0;
  const displayMedia = media.slice(0, 4);

  // Improved grid layout function
  const getGridLayout = () => {
    switch (mediaCount) {
      case 1:
        return "grid-cols-1 h-96"; // Taller for PDFs
      case 2:
        return "grid-cols-2 h-80";
      case 3:
        return "grid-cols-2 grid-rows-2 h-96";
      default:
        return "grid-cols-2 grid-rows-2 h-96"; // 2x2 grid for 4+ items
    }
  };

  // Helper functions to check media types
  const isVideo = (url) => url?.match(/\.(mp4|mov|avi|webm|video)$/i);
  const isPdf = (url) => url?.match(/.*(\/raw\/).*/i);

  return (
    <div
      className={`grid ${getGridLayout()} gap-1 rounded-none overflow-hidden mb-2`}
    >
      {displayMedia.map((url, index) => {
        // Check if this is a video with multiple media items
        const isDisabledVideo = isVideo(url) && mediaCount > 1;
        // Check if this is a PDF document - PDFs should not open in modal
        const isPdfDocument = isPdf(url);

        return (
          <div
            key={index}
            className={`
              relative overflow-hidden
              ${mediaCount === 3 && index === 0 ? "row-span-2" : ""}
            `}
          >
            {isPdfDocument ? (
              // PDF viewer - not clickable for modal
              <div className="w-full h-full">
                <PdfViewer url={url} />
              </div>
            ) : (
              // All other media - clickable for modal
              <button
                onClick={() =>
                  !(isVideo(url) && mediaCount === 1) &&
                  handleOpenPostModal(index)
                }
                className="w-full h-full"
              >
                <MediaItem url={url} disabled={isDisabledVideo} />
                {remaining > 0 && index === 3 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      +{remaining}
                    </span>
                  </div>
                )}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MediaDisplay;
