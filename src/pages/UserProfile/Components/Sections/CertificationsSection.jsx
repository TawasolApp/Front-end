import React from "react";
import GenericSection from "../GenericComponent/Useless/GenericSection";
import mockCertifications from "../MockData/mockCertifications";

function CertificationsSection({ isOwner, user }) {
  return (
    <div>
      <GenericSection
        title="Licenses & Certifications"
        type="certifications"
        items={user.certifications || []}
        isOwner={isOwner}
        user={user} // needed for PATCH
      />
    </div>
  );
}

export default CertificationsSection;
