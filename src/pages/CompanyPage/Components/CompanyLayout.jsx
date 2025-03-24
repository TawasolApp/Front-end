import { Outlet, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import CompanyHeader from "./CompanyHeader.jsx";
import Footer from "./Footer.jsx";
import LoadingPage from "../../LoadingPage/LoadingPage.jsx";
import jobs from "../jobs.js";

function CompanyLayout() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [defaultCompanyId, setDefaultCompanyId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) {
      axios
        .get("http://localhost:5000/companies")
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
    <div className="bg-gray-200 pt-4 pb-4">
      <CompanyHeader companyId={companyId || defaultCompanyId} />
      <div className="max-w-6xl mx-auto mt-4">
        <Outlet context={{ jobs }} /> {/* Pass jobs via context if needed */}
      </div>
      <Footer />
    </div>
  );
}

export default CompanyLayout;
