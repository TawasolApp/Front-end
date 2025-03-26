import React from "react";
function OverviewComponent(props) {
  return (
    <div className="mt-4">
      <p className="font-bold text-text">{props.title}</p>
      <p className="text-overviewcomponenttext">{props.content}</p>
    </div>
  );
}
export default OverviewComponent;
