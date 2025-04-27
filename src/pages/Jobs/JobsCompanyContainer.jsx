import { useParams } from "react-router-dom";
import MainJobs from "./MainJobs/MainJobs";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../apis/axios";

const JobsCompanyContainer = () => {
  const {companyId} = useParams();
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
