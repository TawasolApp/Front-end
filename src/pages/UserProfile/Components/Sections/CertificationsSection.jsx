import React from "react";
import GenericSection from "../GenericDisplay/GenericSection";

function CertificationsSection({ isOwner, user, onUserUpdate }) {
  return (
    <div>
      <GenericSection
        title="Licenses & Certifications"
        type="certification"
        items={user.certification || []}
        isOwner={isOwner}
        user={user}
        onUserUpdate={onUserUpdate}
      />
    </div>
  );
}

export default CertificationsSection;
