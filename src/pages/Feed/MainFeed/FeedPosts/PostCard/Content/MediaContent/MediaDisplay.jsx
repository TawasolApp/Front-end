import MediaItem from "./MediaItem";

const MediaDisplay = ({ media }) => {
  if (!media || media.length === 0) return null;

  const mediaCount = media.length;
  const remaining = mediaCount > 4 ? mediaCount - 4 : 0;
  const displayMedia = media.slice(0, 4);

  const getGridLayout = () => {
    if (mediaCount === 1) return "grid-cols-1";
    if (mediaCount === 2) return "grid-cols-2";
    if (mediaCount === 3) return "grid-cols-3 grid-rows-2";
    return "grid-cols-3 grid-rows-3"; // Use 3 columns, 3 rows for 4+ items
  };

  return (
    <div
      className={`grid ${getGridLayout()} gap-0.5 overflow-hidden ${mediaCount >= 3 ? "h-96" : ""}`}
    >
      {displayMedia.map((url, index) => (
        <div
          key={index}
          className={`
              relative h-full
              ${mediaCount > 2 && index === 0 ? "col-span-2" : ""}
              ${mediaCount === 3 && index === 0 ? "row-span-2" : ""}
              ${mediaCount >= 4 && index === 0 ? "row-span-3" : ""}
              ${mediaCount === 3 && index > 0 ? "col-start-3" : ""}
              ${mediaCount === 3 && index === 1 ? "row-start-1" : ""}
              ${mediaCount === 3 && index === 2 ? "row-start-2" : ""}
              ${mediaCount >= 4 && index > 0 ? "col-start-3" : ""}
              ${mediaCount >= 4 && index === 1 ? "row-start-1" : ""}
              ${mediaCount >= 4 && index === 2 ? "row-start-2" : ""}
              ${mediaCount >= 4 && index === 3 ? "row-start-3" : ""}
            `}
        >
          <MediaItem url={url} />
          {remaining > 0 && index === 3 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                +{remaining}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MediaDisplay;
