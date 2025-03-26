import React, { useState } from "react";
import Overviewbox from "./Overviewbox.jsx";
import Overviewcomponent from "./Overviewcomponent.jsx";
function Aboutoverview(props) {
  // const isAdmin = true;
  const company = props.company;
  return (
    <div
      className="bg-boxbackground p-6 shadow-md rounded-md w-full max-w-3xl mx-auto pb-4 mb-8 relative"
      data-testid="about-overview"
    >
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold mb-2 text-boxheading">
          Overview
        </h1>
        {/* {isAdmin && (
          <button
            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md border border-gray-300 hover:bg-gray-100 transition"
            onClick={() => alert("Edit Overview")}
          >
            <FiEdit className="text-gray-600 w-5 h-5" />
          </button>
        )} */}
      </div>
      <p className="text-overview">{company.overview}</p>
      {company?.website && (
        <div className="mt-4">
          <p className="font-bold text-text">Website</p>
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-semibold hover:underline"
          >
            {company.website}
          </a>
        </div>
      )}
      {company?.contactNumber && (
        <Overviewcomponent title="Phone" content={company.contactNumber} />
      )}
      {company?.isVerified && company?.verification_date && (
        <Overviewcomponent
          title="Verified Page"
          content={company.verification_date}
        />
      )}
      {company?.industry && (
        <Overviewcomponent title="Industry" content={company.industry} />
      )}

      {company?.companySize && (
        <Overviewcomponent
          title="Company Size"
          content={`${company.companySize}+ employees`}
        />
      )}

      {company?.address && (
        <Overviewcomponent title="Headquarters" content={company.address} />
      )}

      {company?.companyType && (
        <Overviewcomponent title="Type" content={company.companyType} />
      )}
      {company?.founded && (
        <Overviewcomponent title="Founded" content={company.founded} />
      )}
    </div>
  );
}
export default Aboutoverview;
