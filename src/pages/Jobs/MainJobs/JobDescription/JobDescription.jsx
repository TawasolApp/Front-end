import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../../../apis/axios';
import { formatDate } from '../../../../utils/dates';
import { FaExternalLinkAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import LinkIcon from "@mui/icons-material/Link";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FlagIcon from "@mui/icons-material/Flag";
import DropdownMenu from '../../../Feed/GenericComponents/DropdownMenu';

const JobDescription = ({ jobId, enableReturn }) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCopyJobLink = async () => {
    await navigator.clipboard.writeText(
      `${window.location.origin}/jobs/${jobId}`,
    );
    toast.success("Link copied to clipboard.", {
      position: "bottom-left",
      autoClose: 3000,
    });
  };

    const handleSaveJob = async () => {
      if (job.isSaved) {
        await axiosInstance.delete(`/jobs/${job.jobId}/unsave`);
        toast.success("Job unsaved.", {
            position: "bottom-left",
            autoClose: 3000,
        });
      } else {
        await axiosInstance.post(`/jobs/${job.jobId}/save`);
        toast.success("Job saved.", {
            position: "bottom-left",
            autoClose: 3000,
        });
      }
    }

  const menuItems = [
    {
        text: "Copy link to post",
        onClick: () => handleCopyJobLink(),
        icon: LinkIcon,
    },
    {
        text: "Flag job",
        onClick: () => console.log("Flag job"),
        icon: FlagIcon,
    }
  ];

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/jobs/${jobId}`);
        setJob(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!job) return null;

  return (
    <div className="relative p-6 border border-cardBorder bg-cardBackground">
      {/* Back button */}
      {enableReturn && (
        <button 
          onClick={() => navigate(-1)}
          className="mb-4 text-textContent hover:underline hover:bg-buttonIconHover rounded-full p-1"
        >
          <ArrowBackIcon
            className="inline-block"
            sx={{ fontSize: 32 }}
          />
        </button>
      )}

      {/* Company Header */}
      <div className="flex items-center justify-between mb-6">
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
        
        <DropdownMenu menuItems={menuItems} position="right-0">
          <button className="hover:bg-buttonIconHover rounded-full p-1">
            <MoreHorizIcon
                className="text-icon"
                sx={{ fontSize: 32 }}
            />
          </button>
        </DropdownMenu>
      </div>

      {/* Position Title */}
      <h1 className="text-2xl font-semibold text-header mb-2 hover:underline transition-all">
        {job.position}
      </h1>

      {/* Location and Applicants */}
      <div className="flex items-center gap-2 mb-4 text-sm font-normal">
        <span className="text-textPlaceholder">{job.companyLocation}</span>
        <span className="text-textPlaceholder">·</span>
        <span className="text-textPlaceholder">Reposted {formatDate(job.postedAt)} ago</span>
        <span className="text-textPlaceholder">·</span>
        <span className="text-green-600 font-bold">{job.applicants} clicked apply</span>
      </div>

      {/* Employment Type Box */}
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
        <button className="bg-buttonSubmitEnable hover:bg-buttonSubmitEnableHover text-buttonSubmitText px-6 py-2 rounded-full transition-colors font-semibold text-base flex items-center gap-2">
          <>
            Apply
            <FaExternalLinkAlt className="w-4 h-4" />
          </>
        </button>
        <button
            className="border border-buttonSubmitEnable hover:border-buttonSubmitEnableHover text-buttonSubmitEnable hover:text-buttonSubmitEnableHover px-6 py-2 rounded-full transition-colors"
            onClick={handleSaveJob}
        >
          {job.isSaved ? (
            <>
              Unsave
            </>
          ) : (
            <>
              Save
            </>
          )}
        </button>
      </div>

      {/* About the Job */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-header mb-4">About the job</h2>
        <p className="text-textContent whitespace-pre-wrap">{job.description}</p>
      </div>
    </div>
  );
};

export default JobDescription;
