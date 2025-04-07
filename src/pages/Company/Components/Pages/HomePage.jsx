import React from "react";
import { useOutletContext } from "react-router-dom";
import OverviewBox from "../HomePage/OverviewBox.jsx";
import PostsSlider from "../Slider/PostsSlider.jsx";
import LoadingPage from "../../../LoadingScreen/LoadingPage.jsx";
import JobOpenings from "../HomePage/JobOpenings.jsx";
function HomePage() {
  const { company } = useOutletContext();
  if (!company) {
    return <LoadingPage />;
  }
  return (
    <div>
      {company?.overview && <OverviewBox company={company} />}
      {/* <PostsSlider /> */}
      <JobOpenings />
    </div>
  );
}
export default HomePage;
