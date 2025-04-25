import JobDescription from "./MainJobs/JobDescription/JobDescription";
import { useParams } from "react-router-dom";

const SingleJob = () => {
    const { id } = useParams();
    return (
        <div className="min-h-screen bg-cardBackground">
            <JobDescription jobId={id} enableReturn={true} />
        </div>
    );
};

export default SingleJob;