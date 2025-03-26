import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import AboutOverview from "../AboutPage/AboutOverview.jsx";
import AboutLocations from "../AboutPage/AboutLocations.jsx";
import LoadingPage from "../../../LoadingPage/LoadingPage.jsx";
import { axiosInstance } from "../../../../apis/axios.js";
function AboutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { companyId } = useParams();
  const [company, setCompany] = useState(location.state?.company || null); //to get state passed in navigation
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
      <AboutOverview company={company} />
      <AboutLocations company={company} />
    </div>
  );
}
export default AboutPage;
