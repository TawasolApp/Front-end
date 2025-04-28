import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../apis/axios";
import MainJobs from "./MainJobs/MainJobs";

const JobsCompanyContainer = () => {
  const {companyId} = useParams();
  const navigate = useNavigate();
  if (!companyId) navigate("/error-404");

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await axiosInstance.get(`/companies/${companyId}`);
        const data = response.data;
        setIsAdmin(data.isManager);
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    fetchCompanyData();
  }, [companyId]);


  return (
    <div className="min-w-screen min-h-screen bg-mainBackground gap-0">
      <MainJobs
        API_URL={`/companies/${companyId}/jobs`}
        enableFilter={true}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default JobsCompanyContainer;
