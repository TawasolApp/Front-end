import React from "react";
import GenericSection2 from "../GenericComponent/OLDWAYS/GenericSection2";
import mockEducation from "../MockData/mockEducation";

function EducationSection({ isOwner, sectionRef, user }) {
  return (
    <div ref={sectionRef}>
      <GenericSection2
        title="Education"
        type="education"
        items={user.education || []}
        isOwner={isOwner}
      />
    </div>
  );
}

export default EducationSection;
