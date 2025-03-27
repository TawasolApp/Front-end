import React from "react";
import GenericSection from "../GenericDisplay/GenericSection";

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
