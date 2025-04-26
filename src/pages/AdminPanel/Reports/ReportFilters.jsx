import React from "react";

const tabs = ["All", "Pending", "Reviewed", "Actioned", "Dismissed"];

function ReportFilters({ current, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-4 py-1 rounded-md border transition text-sm ${
            current === tab
              ? "bg-buttonSubmitEnable text-buttonSubmitText"
              : "border border-itemBorder text-text hover:bg-buttonHover"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export default ReportFilters;
