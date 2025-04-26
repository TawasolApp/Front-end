import React from "react";

const tabs = ["All", "Flagged"];

function JobFilters({ current, onChange }) {
  return (
    <div className="flex space-x-6 border-b border-itemBorder text-normaltext font-medium">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`pb-2 border-b-2 transition ${
            current === tab
              ? "border-buttonSubmitEnable text-buttonSubmitEnable"
              : "border-transparent"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export default JobFilters;
