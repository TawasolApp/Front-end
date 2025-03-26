import React from "react";
function OverviewComponent({ title, content }) {
  return (
    <div className="mt-4">
      <p className="font-bold text-text">{title}</p>
      <p className="text-overviewcomponenttext">{content}</p>
    </div>
  );
}
export default OverviewComponent;
