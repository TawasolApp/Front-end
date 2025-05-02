import React from "react";

const formatDate = (timestamp) =>
  new Date(timestamp).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

function PostCard({ post, reportCount }) {
  if (!post) return null;

  return (
    <div className="bg-boxbackground border border-itemBorder rounded-xl p-4 shadow-md space-y-3">
      {/* Author Info */}
      <div className="flex items-center gap-4">
        <img
          src={post.authorPicture}
          alt={post.authorName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-text">{post.authorName}</p>
          <p className="text-xs text-gray-500">{post.authorBio}</p>
          <p className="text-xs text-gray-400">{formatDate(post.timestamp)}</p>
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-textContent whitespace-pre-line">
        {post.content}
      </p>

      {/* Media */}
      {post.media?.length > 0 && (
        <div className="w-full mt-2">
          {post.media.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`media-${idx}`}
              className="w-full max-h-[400px] rounded-xl object-cover"
            />
          ))}
        </div>
      )}

      {/* Report Count (optional) */}
      {reportCount !== undefined && (
        <p className="text-sm text-red-500 mt-2">
          Reports Received: {reportCount}
        </p>
      )}
    </div>
  );
}

export default PostCard;
