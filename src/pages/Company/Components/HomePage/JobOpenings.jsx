import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { axiosInstance } from "../../../../apis/axios";
import LoadingPage from "../../../LoadingScreen/LoadingPage";

function JobOpenings() {
  const navigate = useNavigate();
  const { companyId } = useParams();
  const sliderRef = useRef(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { company } = useOutletContext();
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(
          `/companies/${companyId}/jobs?page=1&limit=10`,
        );
        setJobs(res.data.slice(0, 6));
      } catch (err) {
        console.error("Failed to fetch job openings:", err);
      } finally {
        setLoading(false);
      }
    };

    if (companyId) fetchJobs();
  }, [companyId]);

  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const scrollDistance = 350;
      sliderRef.current.scrollBy({
        left: direction === "right" ? scrollDistance : -scrollDistance,
        behavior: "smooth",
      });
    }
  };
  if (loading) {
    return <LoadingPage />;
  }
  if (jobs.length === 0) return null;
  return (
    <div
      className="relative bg-boxbackground p-4 shadow-md rounded-md w-full max-w-3xl mx-auto pb-0 mb-8 mt-8"
      data-testid="job-openings"
    >
      {/* Header with Navigation Arrows */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-text">
          Recent Job Openings
        </h1>
        {jobs.length > 3 && (
          <div className="flex space-x-2">
            <button
              className="bg-modalbackground p-2 rounded-full hover:bg-sliderbutton transition border border-white shadow-sm"
              onClick={() => handleScroll("left")}
              aria-label="scroll-left"
            >
              <AiOutlineLeft size={20} className="text-text" />
            </button>
            <button
              className="bg-modalbackground p-2 rounded-full hover:bg-sliderbutton transition border border-white shadow-sm"
              onClick={() => handleScroll("right")}
              aria-label="scroll-right"
            >
              <AiOutlineRight size={20} className="text-text" />
            </button>
          </div>
        )}
      </div>

      {/* Slider */}
      <div className="relative overflow-hidden">
        <div
          ref={sliderRef}
          className="flex space-x-4 overflow-x-scroll scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {/* Hide scrollbar for WebKit */}
          <style>
            {`
              .no-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>

          <div className="flex gap-4 no-scrollbar">
            {jobs.map((job) => (
              <div
                key={job.jobId}
                className="flex-shrink-0 w-[260px] min-h-[260px] bg-boxbackground border border-gray-700 rounded-xl shadow-sm p-4"
              >
                <img
                  src={
                    company.logo ||
                    "https://media.licdn.com/dms/image/D4E12AQFuCmxN72C2yQ/article-cover_image-shrink_720_1280/0/1702503196049?e=2147483647&v=beta&t=9HHff4rJDnxuWrqfzPqX9j2dncDBKQeShXf2Wt5nrUc"
                  }
                  alt="Company Logo"
                  className="w-20 h-20 object-contain mb-2"
                />
                <h2 className="text-text font-semibold text-md mb-1">
                  {job.position}
                </h2>
                <p className="text-sm text-normaltext">
                  {company.name?.toUpperCase()}
                </p>
                <p className="text-sm text-companysubheader">{job.location}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-3 space-x-2">
        {jobs.slice(0, 4).map((_, index) => (
          <button
            key={index}
            className="h-2 w-2 rounded-full bg-gray-400 transition-all duration-300"
          />
        ))}
      </div>

      {/* Show All Jobs Button */}
      <button
        className="w-full py-2 text-navbuttons border-t border-gray-300 mt-4"
        onClick={() => navigate(`/company/${companyId}/jobs`)}
      >
        Show all jobs →
      </button>
    </div>
  );
}

export default JobOpenings;
