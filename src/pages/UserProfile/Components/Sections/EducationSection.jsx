import React from "react";
import GenericSection from "../GenericComponent/Useless/GenericSection";
import mockEducation from "../MockData/mockEducation";

function EducationSection({ isOwner, sectionRef, user }) {
  return (
    <div ref={sectionRef}>
      <GenericSection
        title="Education"
        type="education"
        items={user.education || []}
        isOwner={isOwner}
      />
    </div>
  );
}

export default EducationSection;
