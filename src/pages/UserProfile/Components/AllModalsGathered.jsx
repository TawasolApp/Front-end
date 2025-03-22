import React from "react";
// import SkillsSection from "./Sections/SkillsSection";
// import ExperienceSection from "./Sections/ExperienceSection";
import EducationSection from "./Sections/EducationSection";
// import CertificationsSection from "./Sections/CertificationsSection";
function AllModalsGathered() {
  return (
    <>
      {/* <ExperienceSection isOwner={true} /> */}
      <EducationSection isOwner={true} />
      {/* <CertificationsSection isOwner={true} /> */}
      {/* <SkillsSection isOwner={true} /> */}
    </>
  );
}

export default AllModalsGathered;
