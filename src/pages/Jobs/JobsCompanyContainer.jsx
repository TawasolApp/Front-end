import { useParams } from "react-router-dom";
import MainJobs from "./MainJobs/MainJobs";

const JobsCompanyContainer = () => {
  const companyId = useParams();
  const isAdmin = useParams();

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
