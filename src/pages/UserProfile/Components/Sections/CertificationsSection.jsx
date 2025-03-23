import React from "react";
import GenericSection from "../GenericComponent/Useless/GenericSection";
import mockCertifications from "../MockData/mockCertifications";

function CertificationsSection({ isOwner }) {
  return (
    <div>
      <GenericSection
        title="Licenses & Certifications"
        type="certifications"
        items={mockCertifications}
        isOwner={isOwner}
      />
    </div>
  );
}

export default CertificationsSection;
