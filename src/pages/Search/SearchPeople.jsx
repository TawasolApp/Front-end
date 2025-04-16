import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";
import { axiosInstance } from "../../apis/axios";

const PeopleSearch = ({ searchText, company }) => {
  const navigate = useNavigate();
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  // Function to fetch people data
  const fetchPeople = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pageNum,
        limit,
        name: searchText || "",
      };

      if (company) params.company = company;
      const response = await axiosInstance.get("/connections/users", {
        params,
      });
      if (reset) {
        setPeople(response.data);
      } else {
        setPeople((prev) => [...prev, ...response.data]);
      }

      // Check if there are more results to load
      setHasMore(response.data.length === limit);
    } catch (err) {
      console.error("Error fetching people:", err);
      setError("Failed to load people. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch when component mounts or search params change
  useEffect(() => {
    setPeople([]);
    setPage(1);
    setHasMore(true);
    fetchPeople(1, true);
  }, [searchText, company]);

  // Load more results when page changes
  useEffect(() => {
    if (page > 1) {
      fetchPeople(page);
    }
  }, [page]);

  // Handle load more
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Handle user click
  const handleUserClick = (userId) => {
    navigate(`/users/${userId}`);
  };

  return (
    <div className="flex justify-center bg-mainBackground gap-0 p-4">
      <main className="w-full max-w-[700px] flex-grow-0 mx-2 space-y-4">
        {/* Results count */}
        <div className="text-textActivity text-sm py-2">
          {people.length > 0
            ? `Showing ${people.length} results`
            : "No results found"}
        </div>

        {/* People results */}
        <div className="bg-cardBackground rounded-lg overflow-hidden">
          {people.map((person, index) => (
            <div
              key={person.userId}
              className={`p-4 flex items-start gap-3 cursor-pointer transition-colors ${
                index !== 0 ? "border-t border-cardBorder" : ""
              }`}
              onClick={() => handleUserClick(person.userId)}
            >
              {/* Profile picture */}
              <div className="flex-shrink-0">
                <Avatar
                  src={person.profilePicture || "/placeholder.svg"}
                  alt={`${person.firstName} ${person.lastName}`}
                  sx={{ width: 56, height: 56 }}
                />
              </div>

              {/* Person info */}
              <div className="flex-grow">
                <h3
                  data-testid="searchUserName"
                  className="text-authorName font-medium hover:underline"
                >
                  {person.firstName} {person.lastName}
                </h3>
                <p className="text-authorBio text-sm line-clamp-2">
                  {person.headline}
                </p>
              </div>
            </div>
          ))}

          {/* Loading and load more */}
          {loading && (
            <div className="p-4 text-center text-textActivity">Loading...</div>
          )}

          {error && <div className="p-4 text-center text-red-500">{error}</div>}

          {!loading && hasMore && (
            <button
              onClick={handleLoadMore}
              className="w-full p-3 text-center text-textActivity hover:bg-cardBackgroundHover transition-colors"
            >
              Load more
            </button>
          )}

          {!loading && !hasMore && people.length > 0 && (
            <div className="p-4 text-center text-textActivity">
              No more results
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PeopleSearch;
