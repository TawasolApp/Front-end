import React from "react";
import { FiCheckCircle, FiAlertCircle, FiTrash2, FiFlag } from "react-icons/fi";

function JobStats({ jobs }) {
  const count = (status) => jobs.filter((j) => j.status === status).length;
  const flagged = jobs.filter((j) => j.flagged).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
      <StatCard
        icon={<FiCheckCircle />}
        label="Active Jobs"
        count={count("Active")}
      />
      <StatCard
        icon={<FiAlertCircle />}
        label="Pending Review"
        count={count("Pending Review")}
      />
      <StatCard
        icon={<FiTrash2 />}
        label="Inactive Jobs"
        count={count("Inactive")}
      />
      <StatCard icon={<FiFlag />} label="Flagged Jobs" count={flagged} />
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
