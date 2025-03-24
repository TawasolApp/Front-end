import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Aboutoverview from "./AboutOverview";
import AboutLocations from "./AboutLocations";
import LoadingPage from "../../LoadingPage/LoadingPage";
import axios from "axios";
function Aboutpage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { companyId } = useParams();
  const [company, setCompany] = useState(location.state?.company || null); //to get state passed in navigation
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
      <Aboutoverview company={company} />
      <AboutLocations company={company} />
    </div>
  );
}
export default Aboutpage;
