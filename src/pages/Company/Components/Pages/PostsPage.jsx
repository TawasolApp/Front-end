import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function PostsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentFilter = searchParams.get("feedView") || "All";

  const [activeFilter, setActiveFilter] = useState(currentFilter);

  const filters = ["All", "Images", "Videos", "Articles", "Documents"];

  useEffect(() => {
    setSearchParams({ feedView: activeFilter });
  }, [activeFilter, setSearchParams]);

  return (
    <div className="bg-boxbackground p-6 shadow-md rounded-md w-full max-w-3xl mx-auto">
      {/* Navigation Filters */}
      <div className="overflow-x-auto">
        <div className="flex flex-wrap gap-2 border-b pb-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full font-semibold transition border border-white text-navbuttons shadow-md ${
                activeFilter === filter
                  ? "bg-green-700 text-white"
                  : "bg-postsbuttoncolor text-gray-700 hover:border-2"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Content */}
      <div className="mt-4">
        <h2 className="text-lg font-semibold">{activeFilter} Posts</h2>
        {/* posts filtering logic here */}
      </div>
    </div>
  );
}

export default PostsPage;
