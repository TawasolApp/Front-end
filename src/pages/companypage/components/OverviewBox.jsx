import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Overviewbox(props) {
  const company = props.company;
  const navigate = useNavigate();
  const { companyId } = useParams();
  const [expanded, setExpanded] = useState(false);

  if (!company) {
    return null; // Return early if company is null or undefined
  }

  return (
    <div
      className="bg-white p-6 shadow-md rounded-md w-full max-w-3xl mx-auto pb-0 mb-8"
      data-testid="overview-box"
    >
      <h1 className="text-2xl font-semibold mb-2">Overview</h1>
      <p
        className={`text-gray-900 transition-all ${
          expanded ? "line-clamp-none" : "line-clamp-3"
        }`}
      >
        {company.overview}
      </p>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-gray-500 hover:underline hover:decoration-blue-500"
      >
        {expanded || (company?.overview?.length ?? 0) < 100 ? "" : "See More"}
      </button>
      <button
        className="w-full py-2 text-gray-700 border-t border-gray-300 mt-4 hover:bg-gray-200"
        onClick={() => navigate(`/company/${companyId}/about`)} // Use dynamic companyId
      >
        Show all details →
      </button>
    </div>
  );
}

export default Overviewbox;
