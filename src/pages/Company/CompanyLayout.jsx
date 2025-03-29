import { Outlet, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CompanyHeader from "./Components/GenericComponents/CompanyHeader.jsx";
import Footer from "./Components/GenericComponents/Footer.jsx";
import LoadingPage from "../LoadingScreen/LoadingPage.jsx";
import jobs from "./jobs.js";
import { axiosInstance } from "../../apis/axios.js";

function CompanyLayout() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [defaultCompanyId, setDefaultCompanyId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) {
      axiosInstance
        .get("/companies")
        .then((response) => {
          if (response.data.length > 0) {
            const firstCompany = response.data[0];
            setDefaultCompanyId(firstCompany.companyId);
            navigate(`/company/${firstCompany.companyId}/home`, {
              replace: true,
            });
          }
        })
        .catch((error) => console.error("❌ Error fetching companies:", error))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [companyId, navigate]);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="bg-background pt-4 pb-4">
      <CompanyHeader companyId={companyId || defaultCompanyId} />
      <div className="max-w-6xl mx-auto mt-4">
        <Outlet context={{ jobs }} />
      </div>
      <Footer />
    </div>
  );
}

export default CompanyLayout;
