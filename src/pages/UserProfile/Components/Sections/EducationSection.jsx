import React from "react";
import GenericSection2 from "../GenericComponent/OLDWAYS/GenericSection2";
import mockEducation from "../MockData/mockEducation";

function EducationSection({ isOwner, sectionRef }) {
  return (
    <div ref={sectionRef}>
      <GenericSection2
        title="Education"
        type="education"
        items={mockEducation}
        isOwner={isOwner}
      />
    </div>
  );
}

export default EducationSection;
