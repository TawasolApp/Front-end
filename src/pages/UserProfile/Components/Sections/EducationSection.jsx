import React from "react";
import GenericSection from "../GenericDisplay/GenericSection";
import mockEducation from "../MockData/mockEducation";

function EducationSection({ isOwner, sectionRef, user }) {
  return (
    <div ref={sectionRef}>
      <GenericSection
        title="Education"
        type="education"
        items={user.education || []}
        isOwner={isOwner}
        user={user} // needed for PATCH
      />
    </div>
  );
}

export default EducationSection;
