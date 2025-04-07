import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";

function OverviewBox() {
  const navigate = useNavigate();
  const { companyId } = useParams();
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const { company } = useOutletContext();
  const textRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      setIsOverflowing(el.scrollHeight > el.clientHeight);
    }
  }, [company?.overview]);

  if (!company) return null;

  return (
    <div
      className="bg-boxbackground p-6 shadow-md rounded-md w-full max-w-3xl mx-auto pb-0 mb-8"
      data-testid="overview-box"
    >
      <h1 className="text-2xl font-semibold mb-2 text-boxheading">Overview</h1>
      <p
        ref={textRef}
        className={`text-companyheader1 transition-all ${
          expanded ? "line-clamp-none" : "line-clamp-3"
        }`}
      >
        {company.overview}
      </p>

      {isOverflowing && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="text-companysubheader hover:underline hover:decoration-blue-500"
        >
          See More
        </button>
      )}

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
