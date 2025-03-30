import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function OverviewBox({ company }) {
  const navigate = useNavigate();
  const { companyId } = useParams();
  const [expanded, setExpanded] = useState(false);

  if (!company) {
    return null;
  }

  return (
    <div
      className="bg-boxbackground p-6 shadow-md rounded-md w-full max-w-3xl mx-auto pb-0 mb-8"
      data-testid="overview-box"
    >
      <h1 className="text-2xl font-semibold mb-2 text-boxheading">Overview</h1>
      <p
        className={`text-companyheader1 transition-all ${
          expanded ? "line-clamp-none" : "line-clamp-3"
        }`}
      >
        {company.overview}
      </p>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-companysubheader hover:underline hover:decoration-blue-500"
      >
        {expanded || (company?.overview?.length ?? 0) < 100 ? "" : "See More"}
      </button>
      <button
        className="w-full py-2 text-navbuttons border-t border-gray-300 mt-4"
        onClick={() => navigate(`/company/${companyId}/about`)}
      >
        Show all details →
      </button>
    </div>
  );
}

export default OverviewBox;
