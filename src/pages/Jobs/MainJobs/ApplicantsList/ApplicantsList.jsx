import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CircularProgress, Skeleton } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DescriptionIcon from "@mui/icons-material/Description";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import { axiosInstance } from "../../../../apis/axios";
import { formatDate } from "../../../../utils/dates";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    Pending: { color: "bg-yellow-100 text-yellow-800", label: "Under Review" },
    Accepted: { color: "bg-green-100 text-green-800", label: "Accepted" },
    Rejected: { color: "bg-red-100 text-red-800", label: "Rejected" },
  };

  return (
    <span
      className={`px-2 py-1 text-xs md:text-sm rounded-full ${statusConfig[status]?.color || "bg-gray-100"}`}
    >
      {statusConfig[status]?.label || status}
    </span>
  );
};

const ApplicantsList = ({ jobId, enableReturn }) => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const limit = 10;
  const navigate = useNavigate();

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchApplicants(true);
  }, [jobId]);

  useEffect(() => {
    if (page !== 1) {
      fetchApplicants(false);
    }
  }, [page]);

  const fetchApplicants = async (newJob = false) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/jobs/${jobId}/applicants`, {
        params: { page, limit },
      });

      if (newJob) setApplicants(response.data.applications);
      else setApplicants((prev) => [...prev, ...response.data.applications]);

      setHasMore(response.data.applications.length === limit);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch applicants");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      setUpdatingStatus(applicationId);
      await axiosInstance.patch(`/jobs/applications/${applicationId}/status`, {
        status: newStatus,
      });

      setApplicants((prev) =>
        prev.map((app) =>
          app.applicationId === applicationId
            ? { ...app, status: newStatus }
            : app,
        ),
      );

      toast.success(`Application ${newStatus.toLowerCase()}`);
    } catch (err) {
      toast.error(`Failed to update status: ${err.response?.data?.message}`);
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (loading && applicants.length === 0) {
    return (
      <div className="p-4 md:p-6 space-y-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="border border-cardBorder rounded-lg p-4">
            <div className="flex items-start gap-4">
              <Skeleton variant="circular" width={48} height={48} />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="30%" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="p-4 md:p-6 text-red-500 text-sm md:text-base">{error}</div>;
  }

  return (
    <div className="p-4 md:p-6 border border-cardBorder bg-cardBackground h-full">
      {/* Header */}
      <div className="mb-4 md:mb-6">
        {enableReturn && (
          <button
            onClick={() => navigate(-1)}
            className="mb-2 md:mb-4 text-textContent hover:underline hover:bg-buttonIconHover rounded-full p-1"
          >
            <ArrowBackIcon className="inline-block" sx={{ fontSize: 32 }} />
          </button>
        )}
        <h2 className="text-xl md:text-2xl font-semibold text-header">Applications</h2>
        <p className="text-xs md:text-sm text-textPlaceholder mt-1 md:mt-2">
          {applicants.length} applicants found
        </p>
      </div>

      {/* Applicants List */}
      <div className="space-y-3 md:space-y-4">
        {applicants.map((applicant) => (
          <div
            key={applicant.applicationId}
            className="border border-cardBorder rounded-lg p-3 md:p-4 transition-all hover:shadow-md"
          >
            {/* Top Section */}
            <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-4">
              <img
                src={applicant.applicantPicture}
                alt={applicant.applicantName}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <h3 className="text-base md:text-lg font-semibold text-header truncate">
                    {applicant.applicantName}
                  </h3>
                  <StatusBadge status={applicant.status} />
                </div>
                <p className="text-sm md:text-base text-textContent truncate mt-1">
                  {applicant.applicantEmail}
                </p>
                <p className="text-xs md:text-sm text-textPlaceholder mt-1">
                  Applied {formatDate(applicant.appliedDate)} ago
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-3 md:mt-4 flex flex-col xs:flex-row gap-2">
              <button
                onClick={() => handleStatusUpdate(applicant.applicationId, "Accepted")}
                disabled={applicant.status === "Accepted" || updatingStatus === applicant.applicationId}
                className={`flex-1 px-4 py-2 rounded-full flex items-center justify-center gap-2 text-sm
                  ${applicant.status === "Accepted" 
                    ? "bg-green-100 text-green-700 cursor-not-allowed" 
                    : "hover:bg-green-200 dark:hover:bg-green-900 text-green-600"}
                  ${updatingStatus === applicant.applicationId ? "opacity-50" : ""}`}
              >
                {updatingStatus === applicant.applicationId ? (
                  <CircularProgress size={16} />
                ) : (
                  <CheckCircleOutlineIcon fontSize="small" />
                )}
                <span className="hidden xs:inline">Accept</span>
              </button>

              <button
                onClick={() => handleStatusUpdate(applicant.applicationId, "Rejected")}
                disabled={applicant.status === "Rejected" || updatingStatus === applicant.applicationId}
                className={`flex-1 px-4 py-2 rounded-full flex items-center justify-center gap-2 text-sm
                  ${applicant.status === "Rejected" 
                    ? "bg-red-100 text-red-700 cursor-not-allowed" 
                    : "hover:bg-red-200 dark:hover:bg-red-900 text-red-600"}
                  ${updatingStatus === applicant.applicationId ? "opacity-50" : ""}`}
              >
                {updatingStatus === applicant.applicationId ? (
                  <CircularProgress size={16} />
                ) : (
                  <HighlightOffIcon fontSize="small" />
                )}
                <span className="hidden xs:inline">Reject</span>
              </button>
            </div>

            {/* Details Section */}
            <div className="mt-3 md:mt-4 pt-3 border-t border-cardBorder">
              {applicant.applicantHeadline && (
                <p className="text-sm md:text-base text-textContent truncate">
                  {applicant.applicantHeadline}
                </p>
              )}
              <div className="mt-2 flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                <p className="text-xs md:text-sm text-textPlaceholder">
                  Phone: {applicant.applicantPhoneNumber}
                </p>
                {applicant.resumeURL && (
                  <a
                    href={applicant.resumeURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs md:text-sm text-textContent hover:underline inline-flex items-center gap-1"
                  >
                    <DescriptionIcon fontSize="small" />
                    <span>View Resume</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Section */}
      <div className="mt-4 md:mt-6">
        {loading && (
          <div className="flex justify-center">
            <CircularProgress size={24} />
          </div>
        )}

        {!loading && hasMore && (
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="w-full py-2 md:py-3 text-primary hover:bg-cardBackgroundHover rounded-lg border border-cardBorder transition-colors text-sm md:text-base"
          >
            Load More Applications
          </button>
        )}

        {!loading && !hasMore && applicants.length > 0 && (
          <div className="flex flex-col items-center justify-center mt-4 md:mt-6 text-textPlaceholder">
            <SentimentDissatisfiedIcon fontSize="large" />
            <p className="mt-2 text-sm md:text-base">No more applications to show</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantsList;
