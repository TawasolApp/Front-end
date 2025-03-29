import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import OverviewBox from "../HomePage/OverviewBox.jsx";
import PostsSlider from "../Slider/PostsSlider.jsx";
import LoadingPage from "../../../LoadingScreen/LoadingPage.jsx";
import JobOpenings from "../HomePage/JobOpenings.jsx";
import { axiosInstance } from "../../../../apis/axios.js";
function HomePage() {
  const location = useLocation();
  const { companyId } = useParams();
  const [company, setCompany] = useState(location.state?.company || null);
  const [loading, setLoading] = useState(!company);
  useEffect(() => {
    if (!company) {
      setLoading(true);
      axiosInstance
        .get(`/companies/${companyId}`)
        .then((response) => {
          setCompany(response.data);
        })
        .catch((error) => console.error("Error fetching company:", error))
        .finally(() => setLoading(false));
    }
  }, [company, companyId]);

  if (loading) {
    return <LoadingPage />;
  }
  return (
    <div>
      {company?.overview && <OverviewBox company={company} />}
      <PostsSlider />
      <JobOpenings company={company} />
    </div>
  );
}
export default HomePage;
