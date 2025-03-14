import React, { useState } from "react";
import company from "../testdata";
import Overviewbox from "./Overviewbox.jsx";
// import { FiEdit } from "react-icons/fi";
import Overviewcomponent from "./Overviewcomponent.jsx";
function Aboutoverview() {
  // const isAdmin = true;
  return (
    <div className="bg-white p-6 shadow-md rounded-md w-full max-w-3xl mx-auto pb-4 mb-8 relative">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold mb-2">Overview</h1>
        {/* {isAdmin && (
          <button
            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md border border-gray-300 hover:bg-gray-100 transition"
            onClick={() => alert("Edit Overview")}
          >
            <FiEdit className="text-gray-600 w-5 h-5" />
          </button>
        )} */}
      </div>
      <p className="text-gray-900">{company.overview}</p>
      <div className="mt-4">
        <p className="font-bold">Website</p>
        <a
          href={company.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 font-semibold hover:underline"
        >
          {company.website}
        </a>
      </div>
      <Overviewcomponent title="Phone" content={company.number} />
      {company.verified && (
        <Overviewcomponent
          title="Verified Page"
          content={company.verification_date}
        />
      )}
      <Overviewcomponent title="Industry" content={company.Industry} />
      <Overviewcomponent
        title="Company Size"
        content={`${company.employees}+ employees`}
      />

      <Overviewcomponent title="Headquarters" content={company.address} />
      <Overviewcomponent title="Type" content={company.Type} />
      <Overviewcomponent title="Founded" content={company.Founded} />
    </div>
  );
}
export default Aboutoverview;
