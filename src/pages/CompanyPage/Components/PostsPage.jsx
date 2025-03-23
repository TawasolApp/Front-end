import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function PostsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentFilter = searchParams.get("filter") || "All";
  const [activeFilter, setActiveFilter] = useState(currentFilter);

  const filters = ["All", "Images", "Videos", "Articles", "Documents"];

  useEffect(() => {
    setSearchParams({ feedView: activeFilter });
  }, [activeFilter, setSearchParams]);

  return (
    <div className="bg-white p-6 shadow-md rounded-md w-full max-w-3xl mx-auto">
      {/* Navigation Filters */}
      <div className="flex space-x-2 border-b pb-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              activeFilter === filter
                ? "bg-green-700 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Posts Content */}
      <div className="mt-4">
        <h2 className="text-lg font-semibold">{activeFilter} Posts</h2>
        {/* Your posts filtering logic here */}
      </div>
    </div>
  );
}

export default PostsPage;
