import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../../apis/axios";
import { formatDate } from "../../../../utils/dates";
import { FaExternalLinkAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import LinkIcon from "@mui/icons-material/Link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FlagIcon from "@mui/icons-material/Flag";
import DropdownMenu from "../../../Feed/GenericComponents/DropdownMenu";
import JobApplyModal from "../Apply/JobApplyModal";

const SkeletonLoader = () => (
  <div className="animate-pulse p-6 border border-cardBorder bg-cardBackground space-y-4">
    {/* Header Skeleton */}
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-200" />
        <div className="h-4 bg-gray-200 rounded w-32" />
      </div>
      <div className="w-8 h-8 bg-gray-200 rounded-full" />
    </div>

    {/* Title Skeleton */}
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />

    {/* Info Skeleton */}
    <div className="flex gap-2">
      <div className="h-4 bg-gray-200 rounded w-24" />
      <div className="h-4 bg-gray-200 rounded w-4" />
      <div className="h-4 bg-gray-200 rounded w-32" />
      <div className="h-4 bg-gray-200 rounded w-4" />
      <div className="h-4 bg-gray-200 rounded w-24" />
    </div>

    {/* Employment Box Skeleton */}
    <div className="bg-gray-100 p-4 rounded-lg space-y-3">
      <div className="flex gap-4">
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-24" />
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-24" />
        </div>
      </div>
    </div>

    {/* Button Skeleton */}
    <div className="flex gap-3">
      <div className="h-10 bg-gray-200 rounded-full w-24" />
      <div className="h-10 bg-gray-200 rounded-full w-20" />
    </div>

    {/* Content Skeleton */}
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
      <div className="h-4 bg-gray-200 rounded w-4/5" />
    </div>
  </div>
);

const ErrorDisplay = ({ error, onRetry }) => (
  <div className="border border-red-200 bg-red-50/20 rounded-lg p-6 text-center">
    <div className="mb-4 flex justify-center">
      <svg
        className="w-12 h-12 text-red-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-red-600 mb-2">
      Oops! Something went wrong
    </h3>
    <p className="text-red-500 mb-4">{error}</p>
    <button
      onClick={onRetry}
      className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors"
    >
      Try Again
    </button>
  </div>
);

const StatusBadge = ({ status }) => {
  const statusConfig = {
    Pending: { color: "bg-yellow-100 text-yellow-800", label: "Under Review", dot: "fill-yellow-500" },
    Accepted: { color: "bg-green-100 text-green-800", label: "Accepted", dot: "fill-green-500" },
    Rejected: { color: "bg-red-100 text-red-800", label: "Not Selected", dot: "fill-red-500" }
  };

  const config = statusConfig[status] || { color: "bg-gray-100 text-gray-800", label: status, dot: "fill-gray-500" };

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
      <svg className={`w-2 h-2 mr-2 ${config.dot}`} viewBox="0 0 8 8">
        <circle cx="4" cy="4" r="3" />
      </svg>
      {config.label}
    </div>
  );
};

const JobDescription = ({ jobId, enableReturn }) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const fetchJob = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/jobs/${jobId}`);
      setJob(response.data);
    } catch (err) {
      setError(err.message || "Failed to fetch job details");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyJob = async () => {
    await navigator.clipboard.writeText(
      `${window.location.origin}/jobs/${jobId}`,
    );
    toast.success("Link copied to clipboard.", {
      position: "bottom-left",
      autoClose: 3000,
    });
  };

  const handleSaveJob = async () => {
    try {
      setSaving(true);
      if (job.isSaved) {
        await axiosInstance.delete(`/jobs/${job.jobId}/unsave`);
        toast.success("Job unsaved");
      } else {
        await axiosInstance.post(`/jobs/${job.jobId}/save`);
        toast.success("Job saved");
      }
      setJob(prev => ({ ...prev, isSaved: !prev.isSaved }));
    } catch (err) {
      toast.error("Failed to save job, please try again.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const menuItems = [
    {
      text: "Copy link to post",
      onClick: () => handleCopyJob(),
      icon: LinkIcon,
    },
    {
      text: "Flag job",
      onClick: () => console.log("Flag job"),
      icon: FlagIcon,
    },
  ];

  if (loading) return <SkeletonLoader />;
  if (error) return <ErrorDisplay error={error} onRetry={fetchJob} />;
  if (!job) return <ErrorDisplay error="Job not found" onRetry={fetchJob} />;

  return (
    <div className="relative p-6 border border-cardBorder bg-cardBackground h-full">
      {/* Back button */}
      {enableReturn && (
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-textContent hover:underline hover:bg-buttonIconHover rounded-full p-1"
        >
          <ArrowBackIcon className="inline-block" sx={{ fontSize: 32 }} />
        </button>
      )}

      {/* Company Header with Status */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Link
            to={`/company/${job.companyId}`}
            className="flex items-center gap-3 group"
          >
            <img
              src={job.companyLogo}
              alt={job.companyName}
              className="w-8 h-8"
            />
            <span className="text-sm font-semibold text-header group-hover:underline">
              {job.companyName}
            </span>
          </Link>
          {job.status && <StatusBadge status={job.status} />}
        </div>

        <DropdownMenu menuItems={menuItems} position="right-0">
          <button className="hover:bg-buttonIconHover rounded-full p-1">
            <MoreHorizIcon className="text-icon" sx={{ fontSize: 32 }} />
          </button>
        </DropdownMenu>
      </div>

      {/* Position Title */}
      <h1 className="text-2xl font-semibold text-header mb-2 hover:underline transition-all">
        {job.position}
      </h1>

      {/* Job Details */}
      <div className="flex items-center gap-2 mb-4 text-sm font-normal">
        {job.companyLocation && (
          <>
            <span className="text-textPlaceholder">{job.companyLocation}</span>
            <span className="text-textPlaceholder">·</span>
          </>
        )}
        {job.postedAt && (
          <>
            <span className="text-textPlaceholder">
              Reposted {formatDate(job.postedAt)} ago
            </span>
            <span className="text-textPlaceholder">·</span>
          </>
        )}
        <span className="text-green-600 font-bold">{job.applicants} clicked apply</span>
      </div>

      {/* Employment Details */}
      <div className="bg-cardBackground rounded-lg p-4 mb-6 border border-cardBorder">
        <div className="flex gap-4">
          <div>
            <h3 className="text-sm text-textPlaceholder">Employment type</h3>
            <p className="font-medium text-header">{job.employmentType}</p>
          </div>
          <div>
            <h3 className="text-sm text-textPlaceholder">Location type</h3>
            <p className="font-medium text-header">{job.locationType}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-8">
        <button
          className={`${job.status ? "bg-buttonSubmitDisable cursor-not-allowed" : "bg-buttonSubmitEnable hover:bg-buttonSubmitEnableHover"} text-buttonSubmitText
                    px-6 py-2 rounded-full transition-colors font-semibold text-base flex items-center gap-2`}
          disabled={job.status}
          onClick={() => setShowApplyModal(true)}
        >
          <FaExternalLinkAlt className="w-4 h-4" />
          Apply
        </button>
        
        <button
          className="border border-buttonSubmitEnable hover:border-buttonSubmitEnableHover
                   text-buttonSubmitEnable hover:text-buttonSubmitEnableHover
                   bg-cardBackground hover:bg-cardBackgroundHover
                   px-6 py-2 rounded-full transition-colors flex items-center justify-center gap-2
                   disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
          onClick={handleSaveJob}
          disabled={saving}
        >
          {saving ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              {job.isSaved ? "Unsaving..." : "Saving..."}
            </>
          ) : (
            job.isSaved ? "Unsave" : "Save"
          )}
        </button>
      </div>

      {/* Job Description */}
      {job.description && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-header mb-4">About the job</h2>
          <p className="text-textContent whitespace-pre-wrap">{job.description}</p>
        </div>
      )}

      {showApplyModal && (
        <JobApplyModal
          isOpen={showApplyModal}
          onClose={() => setShowApplyModal(false)}
          jobId={jobId}
          companyName={job.companyName}
        />
      )}
    </div>
  );
};

export default JobDescription;
