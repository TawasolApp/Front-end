import ApplicantsList from "./MainJobs/ApplicantsList/ApplicantsList";
import { useParams } from "react-router-dom";

const SingleApplicants = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-mainBackground">
      <div className="mx-0 px-0 md:max-w-3xl md:mx-auto md:px-4 md:py-8">
        <ApplicantsList jobId={id} enableReturn={true} />
      </div>
    </div>
  );
};

export default SingleApplicants;
