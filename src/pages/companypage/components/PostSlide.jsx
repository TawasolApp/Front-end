import React from "react";
import { FaRegComment, FaRetweet, FaPaperPlane } from "react-icons/fa"; // FaRetweet for Repost
import { AiOutlineLike } from "react-icons/ai";

function PostSlide({ post }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-400 p-4 w-[350px] flex-shrink-0 flex flex-col justify-between min-h-[400px] h-[400px]">
      {/* Company Info */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <img
            src={post.logo}
            alt="Company Logo"
            className="w-10 h-10 rounded-full object-contain"
          />
          <div>
            <h2 className="font-semibold text-gray-900 text-sm">
              {post.companyName}
            </h2>
            <p className="text-gray-500 text-xs">{post.followers} followers</p>
            <p className="text-gray-500 text-xs">
              {post.timeAgo} <span className="font-bold">·</span>{" "}
              {post.edited ? (
                <>
                  Edited <span className="font-bold">·</span>
                </>
              ) : (
                ""
              )}
            </p>
          </div>
        </div>

        {/* Post Content */}
        <p className="text-gray-700 text-sm mb-2 line-clamp-3">{post.text}</p>
      </div>

      {/* Post Media (Image/Video/Article/Document) */}
      <div className="flex-grow flex items-center justify-center max-h-[200px]">
        {post.mediaType === "image" && (
          <img
            src={post.media}
            alt="Post"
            className="w-full rounded-lg object-cover max-h-[200px]"
          />
        )}
        {post.mediaType === "video" && (
          <video controls className="w-full rounded-lg max-h-[200px]">
            <source src={post.media} type="video/mp4" />
          </video>
        )}
        {post.mediaType === "article" && (
          <a
            href={post.media}
            className="text-blue-600 text-sm underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read Article
          </a>
        )}
        {post.mediaType === "document" && (
          <a
            href={post.media}
            className="text-blue-600 text-sm underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Document
          </a>
        )}
      </div>

      {/* Engagement Section */}
      <div className="flex justify-between items-center text-gray-600 text-sm mt-3 border-t pt-2">
        <button className="flex items-center gap-1 hover:text-blue-500">
          <AiOutlineLike size={16} />
        </button>
        <button className="flex items-center gap-1 hover:text-blue-500">
          <FaRegComment size={16} />
        </button>
        <button className="flex items-center gap-1 hover:text-blue-500">
          <FaRetweet size={16} />
        </button>
        <button className="flex items-center gap-1 hover:text-blue-500">
          <FaPaperPlane size={16} />
        </button>
      </div>
    </div>
  );
}

export default PostSlide;
