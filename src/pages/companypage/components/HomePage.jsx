import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Overviewbox from "./Overviewbox.jsx";
import Aboutpage from "./AboutPage.jsx";
import PostsSlider from "./PostsSlider.jsx";
import LoadingPage from "../../LoadingPage/LoadingPage.jsx";
import axios from "axios";
import JobOpenings from "./JobOpenings.jsx";
function Homepage() {
  const location = useLocation();
  const { companyId } = useParams();
  const [company, setCompany] = useState(location.state?.company || null);
  const [loading, setLoading] = useState(!company);
  useEffect(() => {
    if (!company) {
      setLoading(true);
      axios
        .get(`http://localhost:5000/companies/${companyId}`)
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
      <Overviewbox company={company} />
      <PostsSlider />
      <JobOpenings company={company} />
    </div>
  );
}
export default Homepage;
