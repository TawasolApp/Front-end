import MainJobs from "./MainJobs/MainJobs";

const JobsContainer = () => {
  return (
    <div className="min-w-screen min-h-screen bg-mainBackground gap-0">
      <MainJobs API_URL="/jobs" enableFilter={true} />
    </div>
  );
};

export default JobsContainer;
