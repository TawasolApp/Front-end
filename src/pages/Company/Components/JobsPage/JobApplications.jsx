import React from "react";

const mockApplicants = {
  "job-001": [
    { id: "a1", name: "Ahmed Samir", email: "ahmed@example.com" },
    { id: "a2", name: "Fatma Gamal", email: "fatma@example.com" },
  ],
  "job-002": [{ id: "a3", name: "Lina Adel", email: "lina@example.com" }],
};

function JobApplications({ job }) {
  if (!job)
    return <div className="w-1/2 p-6">Select a job to see applicants</div>;

  const applicants = mockApplicants[job.id] || [];

  return (
    <div className="w-1/2 p-6 overflow-y-auto text-text bg-boxbackground rounded-md shadow">
      <h2 className="text-xl font-semibold mb-4">
        Applicants for {job.position}
      </h2>

      {applicants.length === 0 ? (
        <p className="text-sm text-gray-400">No applicants yet.</p>
      ) : (
        <ul className="space-y-2">
          {applicants.map((applicant) => (
            <li key={applicant.id} className="border p-3 rounded">
              <p className="font-medium">{applicant.name}</p>
              <p className="text-sm text-gray-400">{applicant.email}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default JobApplications;
