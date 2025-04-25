import { useState, useEffect } from "react";
import { axiosInstance } from "../../../../apis/axios";
import { formatDate } from "../../../../utils/dates";
import { CircularProgress } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const ApplicantsList = ({ jobId, enableReturn }) => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/jobs/${jobId}/applications`, {
        params: { page, limit },
      });

      setApplicants((prev) => [...prev, ...response.data]);
      setHasMore(response.data.length === limit);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch applicants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [page]);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await axiosInstance.patch(`/application/${applicationId}/status`, {
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
    }
  };

  if (loading && applicants.length === 0)
    return <div className="p-6">Loading applicants...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 border border-cardBorder bg-cardBackground h-full">
      <h2 className="text-2xl font-semibold text-header mb-6">Applications</h2>

      <div className="space-y-4">
        {applicants.map((applicant) => (
          <div
            key={applicant.applicationId}
            className="border border-cardBorder rounded-lg p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <img
                  src={applicant.applicantPicture}
                  alt={applicant.applicantName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-header">
                    {applicant.applicantName}
                  </h3>
                  <p className="text-textContent">{applicant.applicantEmail}</p>
                  <p className="text-sm text-textPlaceholder mt-1">
                    {formatDate(applicant.appliedDate)}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    handleStatusUpdate(applicant.applicationId, "Accepted")
                  }
                  className={`px-4 py-2 rounded-full flex items-center gap-1 ${
                    applicant.status === "Accepted"
                      ? "bg-green-100 text-green-700"
                      : "hover:bg-green-50 text-green-600"
                  }`}
                  disabled={applicant.status === "Accepted"}
                >
                  <CheckCircleOutlineIcon fontSize="small" />
                  Accept
                </button>
                <button
                  onClick={() =>
                    handleStatusUpdate(applicant.applicationId, "Rejected")
                  }
                  className={`px-4 py-2 rounded-full flex items-center gap-1 ${
                    applicant.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : "hover:bg-red-50 text-red-600"
                  }`}
                  disabled={applicant.status === "Rejected"}
                >
                  <HighlightOffIcon fontSize="small" />
                  Reject
                </button>
              </div>
            </div>

            <div className="mt-4 pl-16 border-t border-cardBorder pt-4">
              <p className="text-textContent">{applicant.applicantHeadline}</p>
              <p className="text-textPlaceholder mt-1">
                Phone: {applicant.applicantPhoneNumber}
              </p>
              {applicant.resumeURL && (
                <a
                  href={applicant.resumeURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline mt-2 inline-block"
                >
                  View Resume
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center mt-4">
          <CircularProgress size={24} />
        </div>
      )}

      {!loading && hasMore && (
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="w-full mt-4 py-2 text-primary hover:bg-cardBackgroundHover rounded-lg"
        >
          Load More Applications
        </button>
      )}
    </div>
  );
};

export default ApplicantsList;
