import React from "react";
import { FiCheckCircle, FiFlag } from "react-icons/fi";

function JobStats({ jobs, totalItems }) {
  const count = (status) => jobs.filter((j) => j.status === status).length;
  const flagged = jobs.filter((j) => j.isFlagged).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-6 w-full">
      <StatCard icon={<FiCheckCircle />} label="All Jobs" count={totalItems} />
      <StatCard
        icon={<FiFlag />}
        label="Flagged Jobs"
        count={jobs.filter((j) => j.isFlagged).length}
      />
    </div>
  );
}

function StatCard({ icon, label, count }) {
  return (
    <div className="bg-boxbackground p-4 rounded shadow flex items-center space-x-4">
      <div className="text-2xl text-icon">{icon}</div>
      <div>
        <p className="text-sm text-textContent">{label}</p>
        <p className="text-xl font-bold text-text">{count}</p>
      </div>
    </div>
  );
}

export default JobStats;
