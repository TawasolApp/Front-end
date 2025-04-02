
const PostModal = ({ mediaIndex }) => {
  const mediaUrl = post.media[0]; // Assuming single media for now

  return (
    <div
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4"
      onClick={handleClosePostModal}
    >
      {/* Main modal container */}
      <div
        className="bg-white rounded-xl w-full max-w-6xl h-[80vh] flex overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Media container with black space */}
        <div className="flex-1 bg-cardBackground flex items-center justify-center relative">
          <div className="max-w-full max-h-full">
            <img
              src={mediaUrl}
              alt="Post media"
              className="max-h-[80vh] object-contain"
            />
          </div>
        </div>

        {/* Post card container */}
        <div className="w-[500px] flex-shrink-0 border-l border-cardBorder h-full bg-cardBackground">
  
        </div>
      </div>
    </div>
  );
};

export default PostModal;
