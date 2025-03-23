import { Outlet, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios"; // Re-added axios import
import CompanyHeader from "./CompanyHeader.jsx";
import Footer from "./Footer.jsx";
import LoadingPage from "../../LoadingPage/LoadingPage.jsx";

function CompanyLayout() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [defaultCompanyId, setDefaultCompanyId] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state

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
        .finally(() => setLoading(false)); // Ensure loading is set to false
    } else {
      setLoading(false); // If companyId exists, stop loading
    }
  }, [companyId, navigate]);

  if (loading) {
    return <LoadingPage />; // Display loading message
  }

  return (
    <div className="bg-gray-200 pt-4 pb-4">
      <CompanyHeader companyId={companyId || defaultCompanyId} />
      <div className="max-w-6xl mx-auto mt-4">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}

export default CompanyLayout;
