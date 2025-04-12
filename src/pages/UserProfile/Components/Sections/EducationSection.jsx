import React from "react";
import GenericSection from "../GenericDisplay/GenericSection";

function EducationSection({ isOwner, sectionRef, user, onUserUpdate }) {
  return (
    <div ref={sectionRef}>
      <GenericSection
        title="Education"
        type="education"
        items={user.education || []}
        isOwner={isOwner}
        user={user}
        onUserUpdate={onUserUpdate}
      />
    </div>
  );
}

export default EducationSection;
