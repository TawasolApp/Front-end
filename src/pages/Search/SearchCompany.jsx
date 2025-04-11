import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";
import { axiosInstance } from "../../apis/axios";

const CompanySearch = ({ searchText, industry }) => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  // Function to format follower count
  const formatFollowers = (count) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return count.toString();
  };

  // Function to fetch company data
  const fetchCompanies = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);
      setError(null);

      // Construct query parameters
      const params = {
        page: pageNum,
        limit,
        name: searchText || "",
      };

      // Add industry filter if provided
      if (industry) {
        params.industry = industry;
      }

      // Make API call
      const response = await axiosInstance.get("/companies", { params });

      // Update state based on response
      if (reset) {
        setCompanies(response.data);
      } else {
        setCompanies((prev) => [...prev, ...response.data]);
      }

      // Check if there are more results to load
      setHasMore(response.data.length === limit);
    } catch (err) {
      console.error("Error fetching companies:", err);
      setError("Failed to load companies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch when component mounts or search params change
  useEffect(() => {
    setCompanies([]);
    setPage(1);
    setHasMore(true);
    fetchCompanies(1, true);
  }, [searchText, industry]);

  // Load more results when page changes
  useEffect(() => {
    if (page > 1) {
      fetchCompanies(page);
    }
  }, [page]);

  // Handle load more
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Handle company click
  const handleCompanyClick = (companyId) => {
    navigate(`/company/${companyId}`);
  };

  return (
    <div className="flex justify-center bg-mainBackground gap-0 p-4">
      <main className="w-full max-w-[700px] flex-grow-0 mx-2 space-y-4">
        {/* Results count */}
        <div className="text-textActivity text-sm py-2">
          {companies.length > 0
            ? `Showing ${companies.length} results`
            : "No results found"}
        </div>

        {/* Company results */}
        <div className="bg-cardBackground rounded-lg overflow-hidden">
          {companies.map((company, index) => (
            <div
              key={company.companyId}
              className={`p-4 flex items-start gap-3 transition-colors ${
                index !== 0 ? "border-t border-cardBorder" : ""
              }`}
            >
              {/* Company logo */}
              <div
                className="flex-shrink-0"
                onClick={() => handleCompanyClick(company.companyId)}
              >
                <Avatar
                  src={company.logo || "/placeholder.svg"}
                  alt={company.name}
                  variant="square"
                  sx={{ width: 56, height: 56 }}
                />
              </div>

              {/* Company info */}
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3
                      className="text-authorName font-medium hover:underline cursor-pointer"
                      onClick={() => handleCompanyClick(company.companyId)}
                    >
                      {company.name}
                      {company.isVerified && (
                        <span className="ml-1 text-blue-500">✓</span>
                      )}
                    </h3>
                    <p className="text-authorBio text-sm">
                      {formatFollowers(company.followers)} followers
                    </p>
                    {company.description && (
                      <p className="text-authorBio text-sm mt-2 line-clamp-2">
                        {company.description}
                      </p>
                    )}
                  </div>

                  {/* Follow button - only shown if not already following */}
                  {!company.isFollowing && (
                    <button className="bg-transparent hover:bg-cardBackgroundHover text-blue-500 font-medium py-1 px-4 border border-blue-500 rounded-full transition-colors">
                      Follow
                    </button>
                  )}
                </div>
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

          {!loading && !hasMore && companies.length > 0 && (
            <div className="p-4 text-center text-textActivity">
              No more results
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CompanySearch;
