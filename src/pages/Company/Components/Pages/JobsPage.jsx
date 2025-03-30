import React from "react";
import OwnerView from "../JobsPage/OwnerView";
import ViewerView from "../JobsPage/ViewerView";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../../../apis/axios.js";
import LoadingPage from "../../../LoadingScreen/LoadingPage.jsx";
function JobsPage() {
  const isAdmin = true;
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
      {isAdmin ? (
        <OwnerView logo={company.logo} name={company.name} />
      ) : (
        <ViewerView logo={company.logo} name={company.name} />
      )}
    </div>
  );
}
export default JobsPage;
