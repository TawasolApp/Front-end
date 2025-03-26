import React, { useState } from "react";
function Overviewcomponent(props) {
  return (
    <div className="mt-4">
      <p className="font-bold text-text">{props.title}</p>
      <p className="text-overviewcomponenttext">{props.content}</p>
    </div>
  );
}
export default Overviewcomponent;
