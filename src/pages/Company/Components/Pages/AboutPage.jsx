import React from "react";
import { useOutletContext } from "react-router-dom";
import AboutOverview from "../AboutPage/AboutOverview.jsx";
import AboutLocations from "../AboutPage/AboutLocations.jsx";
import LoadingPage from "../../../LoadingScreen/LoadingPage.jsx";
function AboutPage() {
  const { company } = useOutletContext();

  if (!company) {
    return <LoadingPage />;
  }
  return (
    <div>
      <AboutOverview />
      {company?.location && <AboutLocations />}
    </div>
  );
}
export default AboutPage;
