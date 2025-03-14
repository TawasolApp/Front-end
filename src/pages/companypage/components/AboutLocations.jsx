import React, { useState } from "react";
import company from "../testdata";
function Aboutlocations() {
  return (
    <div className="bg-white p-6 shadow-md rounded-md w-full max-w-3xl mx-auto pb-0 mb-8">
      <h1 className="text-2xl font-semibold mb-2">Location</h1>
      <a
        href={company.mapsloc}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-700 hover:underline"
      >
        Get directions
      </a>
      <div>{company.mapsimg}</div>
    </div>
  );
}
export default Aboutlocations;
