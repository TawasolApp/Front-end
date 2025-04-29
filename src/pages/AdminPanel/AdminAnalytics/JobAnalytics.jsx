import React from "react";
import { FaBriefcase } from "react-icons/fa";
import { useEffect, useState } from "react";
import { axiosInstance as axios } from "../../../apis/axios";

function JobAnalytics({ jobAnalytics }) {
  const job = jobAnalytics.mostAppliedJob;
  const [mostAppliedCompanyDetails, setMostAppliedCompanyDetails] =
    useState(null);

  const formatDate = (timestamp) =>
    new Date(timestamp).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get(
          `/companies/${jobAnalytics.mostAppliedCompany._id}`
        );
        setMostAppliedCompanyDetails(res.data);
      } catch (err) {
        console.error("Failed to fetch company details:", err);
      }
    };

    if (jobAnalytics.mostAppliedCompany?._id) {
      fetchCompany();
    }
  }, [jobAnalytics]);

  return (
    <section className="bg-white border border-gray-200 rounded-xl shadow-md p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <FaBriefcase className="text-purple-600" />
          Job Analytics
        </h3>
        <p className="text-2xl font-bold text-purple-600">
          {jobAnalytics.totalJobs.toLocaleString()} Jobs
        </p>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-2 text-gray-700">
          Most Applied Company
        </h4>
        {mostAppliedCompanyDetails ? (
          <div className="flex items-center gap-4 bg-boxbackground border border-itemBorder rounded-xl p-4 shadow-md">
            <img
              src={mostAppliedCompanyDetails.logo || "/default-logo.png"}
              alt="Company Logo"
              className="w-14 h-14 rounded-lg object-cover"
            />
            <div>
              <p className="text-text font-semibold">
                {mostAppliedCompanyDetails.name}
              </p>
              <p className="text-sm text-gray-500">
                Applications Received:{" "}
                <span className="text-purple-600 font-semibold">
                  {jobAnalytics.mostAppliedCompany.applicationCount}
                </span>
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">
            Loading company info...
          </p>
        )}
      </div>

      <hr className="border-t border-gray-300" />

      {/* Most Applied Job Card */}
      <div className="space-y-2 text-gray-700">
        <h4 className="text-lg font-semibold">Most Applied Job</h4>
        {job ? (
          <div className="bg-boxbackground border border-itemBorder rounded-xl p-4 shadow-md space-y-2">
            <div className="flex items-center gap-4">
              <img
                src={job.companyLogo}
                alt="company logo"
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <p className="font-semibold text-text">{job.companyName}</p>
                <p className="text-xs text-gray-500">{job.companyLocation}</p>
              </div>
            </div>
            <p className="text-sm font-medium text-textContent">
              {job.position} • {job.experienceLevel} • {job.employmentType}
            </p>
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {job.description}
            </p>
            <p className="text-xs text-gray-500">
              Posted at: {formatDate(job.postedAt)}
            </p>
            <p className="text-xs text-purple-600">
              Applications: {job.applicants}
            </p>
          </div>
        ) : (
          <p className="text-sm italic text-gray-500">No job data available.</p>
        )}
      </div>

      {/* Reported Job Count */}
      <div className="text-m text-red-600">
        Jobs Reported: {jobAnalytics.jobReportedCount}
      </div>
    </section>
  );
}

export default JobAnalytics;
