import React, { useState } from "react";
function Overviewcomponent(props) {
  return (
    <div className="mt-4">
      <p className="font-bold">{props.title}</p>
      <p className="text-gray-500">{props.content}</p>
    </div>
  );
}
export default Overviewcomponent;
