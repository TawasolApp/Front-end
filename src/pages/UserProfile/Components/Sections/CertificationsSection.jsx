import React from "react";
import GenericSection2 from "../GenericComponent/OLDWAYS/GenericSection2";
import mockCertifications from "../MockData/mockCertifications";

function CertificationsSection({ isOwner }) {
  return (
    <div>
      <GenericSection2
        title="Licenses & Certifications"
        type="certifications"
        items={mockCertifications}
        isOwner={isOwner}
      />
    </div>
  );
}

export default CertificationsSection;
