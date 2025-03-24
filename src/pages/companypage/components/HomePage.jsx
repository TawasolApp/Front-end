import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Overviewbox from "./Overviewbox.jsx";
import Aboutpage from "./AboutPage.jsx";
import PostsSlider from "./PostsSlider.jsx";
import LoadingPage from "../../LoadingPage/LoadingPage.jsx";
import JobOpenings from "./JobOpenings.jsx";
import { axiosInstance } from "../../../apis/axios.js";
function Homepage() {
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
      {company?.overview && <Overviewbox company={company} />}
      <PostsSlider />
      <JobOpenings company={company} />
    </div>
  );
}
export default Homepage;
