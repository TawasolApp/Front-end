import React, { useRef } from "react";
import PostSlide from "./PostSlide";
import posts from "../poststest";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

function PostsSlider({ setActiveButton }) {
  const sliderRef = useRef(null);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -350, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 350, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-md w-full max-w-3xl mx-auto pb-0 relative">
      {/* Header with Navigation Arrows */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Page Posts</h1>
        <div className="flex space-x-2">
          <button
            className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition"
            onClick={scrollLeft}
          >
            <AiOutlineLeft size={20} />
          </button>
          <button
            className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition"
            onClick={scrollRight}
          >
            <AiOutlineRight size={20} />
          </button>
        </div>
      </div>

      {/* Slider Wrapper - No Scrollbar But Scrollable */}
      <div className="relative overflow-hidden">
        <div
          ref={sliderRef}
          className="flex space-x-4 overflow-x-scroll no-scrollbar scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {posts.map((post, index) => (
            <div key={index} className="flex-shrink-0 w-[350px]">
              <PostSlide post={post} />
            </div>
          ))}
        </div>
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center mt-3 space-x-2">
        {posts.map((_, index) => (
          <button
            key={index}
            className="h-2 w-2 rounded-full transition-all duration-300 bg-gray-400"
          />
        ))}
      </div>
      <button
        className="w-full py-2 text-gray-700 border-t border-gray-300 mt-4"
        onClick={() => setActiveButton("Posts")}
      >
        Show all posts →
      </button>
    </div>
  );
}

export default PostsSlider;
