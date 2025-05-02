import React from "react";

function ReportStats({ reports }) {
  const getCount = (status) =>
    reports.filter((r) => r.status === status).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
      {["Pending", "Actioned", "Dismissed"].map((status) => (
        <div
          key={status}
          className="bg-boxbackground p-4 rounded-md border border-itemBorder text-center"
        >
          <div className="text-sm text-companysubheader">{status}</div>
          <div className="text-xl font-bold text-text">{getCount(status)}</div>
        </div>
      ))}
    </div>
  );
}

export default ReportStats;
