import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../../apis/axios";
import { formatDate } from "../../../../utils/dates";
import { CircularProgress, Skeleton } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DescriptionIcon from "@mui/icons-material/Description";
import { toast } from "react-toastify";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    Pending: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900", label: "Under Review" },
    Accepted: { color: "bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900", label: "Accepted" },
    Rejected: { color: "bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900", label: "Rejected" }
  };

  return (
    <span className={`px-2 py-1 text-sm rounded-full ${statusConfig[status]?.color || 'bg-gray-100 dark:bg-gray-700'}`}>
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
    if (page > 1) fetchApplicants();
  }, [page]);

  const fetchApplicants = async (newJob = false) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/jobs/${jobId}/applicants`, {
        params: { page, limit }
      });
      
      if (newJob) setApplicants(response.data.applications);
      else setApplicants(prev => [...prev, ...response.data.applications]);
      setHasMore(response.data.applications.length === limit);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch applicants');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      setUpdatingStatus(applicationId);
      await axiosInstance.patch(`/application/${applicationId}/status`, {
        status: newStatus
      });

      setApplicants(prev => prev.map(app => 
        app.applicationId === applicationId 
          ? { ...app, status: newStatus } 
          : app
      ));
      
      toast.success(`Application ${newStatus.toLowerCase()}`);
    } catch (err) {
      toast.error(`Failed to update status: ${err.response?.data?.message}`);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const renderSkeletons = () => (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div key={idx} className="border border-cardBorder rounded-lg p-4">
          <div className="flex items-center gap-4">
            <Skeleton variant="circular" width={48} height={48} />
            <div className="flex-1">
              <Skeleton width="50%" height={20} />
              <Skeleton width="30%" height={15} className="mt-2" />
              <Skeleton width="40%" height={15} className="mt-2" />
            </div>
          </div>
          <Skeleton width="100%" height={10} className="mt-4" />
        </div>
      ))}
    </div>
  );

  if (loading && applicants.length === 0) return (
    <div className="p-6">
      {renderSkeletons()}
    </div>
  );

  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 border border-cardBorder bg-cardBackground h-full">
      {/* Header Section */}
      <div className="mb-6">
        {enableReturn && (
          <button
            onClick={() => navigate(-1)}
            className="mb-4 text-textContent hover:underline hover:bg-buttonIconHover rounded-full p-1"
          >
            <ArrowBackIcon className="inline-block" sx={{ fontSize: 32 }} />
          </button>
        )}
        <h2 className="text-2xl font-semibold text-header">Applications</h2>
        <p className="text-sm text-textPlaceholder mt-2">
          {applicants.length} applicants found
        </p>
      </div>

      {/* Applicants List */}
      <div className="space-y-4">
        {applicants.map(applicant => (
          <div 
            key={applicant.applicationId}
            className="border border-cardBorder rounded-lg p-4 transition-all hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Applicant Info */}
              <div className="flex items-start gap-4 flex-1">
                <img 
                  src={applicant.applicantPicture} 
                  alt={applicant.applicantName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-semibold text-header">
                      {applicant.applicantName}
                    </h3>
                    <StatusBadge status={applicant.status} />
                  </div>
                  <p className="text-textContent">{applicant.applicantEmail}</p>
                  <p className="text-sm text-textPlaceholder mt-1">
                    Applied {formatDate(applicant.appliedDate)} ago
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleStatusUpdate(applicant.applicationId, 'Accepted')}
                  disabled={applicant.status === 'Accepted' || updatingStatus === applicant.applicationId}
                  className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm transition-colors
                    ${applicant.status === 'Accepted' 
                      ? 'bg-green-100 text-green-700 cursor-not-allowed dark:bg-green-200 dark:text-green-900' 
                      : 'hover:bg-green-200 dark:hover:bg-green-900 text-green-600 dark:text-green-300'} 
                    ${updatingStatus === applicant.applicationId ? 'opacity-50' : ''}`}
                >
                  {updatingStatus === applicant.applicationId ? (
                    <CircularProgress size={16} />
                  ) : (
                    <CheckCircleOutlineIcon fontSize="small" />
                  )}
                  Accept
                </button>
                
                <button
                  onClick={() => handleStatusUpdate(applicant.applicationId, 'Rejected')}
                  disabled={applicant.status === 'Rejected' || updatingStatus === applicant.applicationId}
                  className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm transition-colors
                    ${applicant.status === 'Rejected' 
                      ? 'bg-red-100 text-red-700 cursor-not-allowed dark:bg-red-200 dark:text-red-900' 
                      : 'hover:bg-red-200 dark:hover:bg-red-900 text-red-600 dark:text-red-300'} 
                    ${updatingStatus === applicant.applicationId ? 'opacity-50' : ''}`}
                >
                  {updatingStatus === applicant.applicationId ? (
                    <CircularProgress size={16} />
                  ) : (
                    <HighlightOffIcon fontSize="small" />
                  )}
                  Reject
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-4 pl-16 border-t border-cardBorder pt-4">
              {applicant.applicantHeadline && (
                <p className="text-textContent">{applicant.applicantHeadline}</p>
              )}
              <div className="mt-2 text-sm flex items-center gap-2">
                <p className="text-textPlaceholder">
                  Phone: {applicant.applicantPhoneNumber}
                </p>
                {applicant.resumeURL && (
                  <a
                    href={applicant.resumeURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-textContent hover:underline flex items-center gap-1"
                  >
                    <DescriptionIcon fontSize="small" />
                    View Resume
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading and Load More */}
      <div className="mt-6">
        {loading && (
          <div className="flex justify-center">
            <CircularProgress size={24} />
          </div>
        )}

        {!loading && hasMore && (
          <button
            onClick={() => setPage(prev => prev + 1)}
            className="w-full py-3 text-primary hover:bg-cardBackgroundHover rounded-lg border border-cardBorder transition-colors"
          >
            Load More Applications
          </button>
        )}

        {!hasMore && applicants.length > 0 && (
          <div className="text-center text-textPlaceholder mt-6">
            🎉 You've reviewed all applicants!
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantsList;
