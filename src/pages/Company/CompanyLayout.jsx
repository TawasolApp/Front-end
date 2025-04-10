import { Outlet, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CompanyHeader from "./Components/GenericComponents/CompanyHeader.jsx";
import Footer from "./Components/GenericComponents/Footer.jsx";
import LoadingPage from "../LoadingScreen/LoadingPage.jsx";
import { axiosInstance } from "../../apis/axios.js";

function CompanyLayout() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [defaultCompanyId, setDefaultCompanyId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminIcons, setShowAdminIcons] = useState(false);
  useEffect(() => {
    if (companyId) {
      // Fetch specific company by ID
      axiosInstance
        .get(`/companies/${companyId}`)
        .then((response) => {
          setCompanyData(response.data);
          setIsAdmin(response.data.isManager);
        })
        .catch((error) => {
          console.error("❌ Error fetching company:", error);
          navigate("/404");
        })
        .finally(() => setLoading(false));
    } else {
      // Fetch first available company
      axiosInstance
        .get("/companies?page=1&limit=1&name=y")
        .then((response) => {
          if (response.data.length > 0) {
            const firstCompany = response.data[0];
            setDefaultCompanyId(firstCompany.companyId);
            setCompanyData(firstCompany);
            navigate(`/company/${firstCompany.companyId}/home`, {
              replace: true,
            });
          }
        })
        .catch((error) => {
          console.error("❌ Error fetching companies:", error);
          navigate("/404");
        })
        .finally(() => setLoading(false));
    }
  }, [companyId, navigate]);
  useEffect(() => {
    setShowAdminIcons(isAdmin);
  }, [isAdmin]);
  if (loading) {
    return <LoadingPage />;
  }
  return (
    <div className="bg-mainBackground pt-4 pb-4">
      <CompanyHeader
        company={companyData}
        setCompanyData={setCompanyData}
        showAdminIcons={showAdminIcons}
        setShowAdminIcons={setShowAdminIcons}
        isAdmin={isAdmin}
      />
      <div className="max-w-6xl mx-auto mt-4">
        {/* Pass companyData to the Outlet as context */}
        <Outlet
          context={{
            company: companyData,
            setCompanyData,
            showAdminIcons,
            setShowAdminIcons,
          }}
        />
      </div>
      <Footer company={companyData} />
    </div>
  );
}

export default CompanyLayout;
