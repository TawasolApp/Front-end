import React from "react";
import OverviewComponent from "./OverviewComponent.jsx";
import { useOutletContext } from "react-router-dom";
function AboutOverview() {
  const { company } = useOutletContext();
  return (
    <div
      className="bg-boxbackground p-6 shadow-md rounded-md w-full max-w-3xl mx-auto pb-4 mb-8 relative"
      data-testid="about-overview"
    >
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold mb-2 text-boxheading">
          Overview
        </h1>
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
        <OverviewComponent title="Phone" content={company.contactNumber} />
      )}
      {company?.isVerified && company?.verification_date && (
        <OverviewComponent
          title="Verified Page"
          content={company.verification_date}
        />
      )}
      {company?.industry && (
        <OverviewComponent title="Industry" content={company.industry} />
      )}

      {company?.companySize && (
        <OverviewComponent
          title="Company Size"
          content={`${company.companySize}+ employees`}
        />
      )}

      {company?.address && (
        <OverviewComponent title="Headquarters" content={company.address} />
      )}

      {company?.companyType && (
        <OverviewComponent title="Type" content={company.companyType} />
      )}
      {company?.founded && (
        <OverviewComponent title="Founded" content={company.founded} />
      )}
    </div>
  );
}
export default AboutOverview;
