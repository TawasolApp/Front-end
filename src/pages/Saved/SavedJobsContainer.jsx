import MainJobs from "../Jobs/MainJobs/MainJobs";
import SavedBar from "./SavedBar";

const SavedJobsContainer = () => {

  return (
    <div className="min-h-screen bg-mainBackground">
      <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row justify-center px-0 sm:px-2 md:px-4 lg:px-4 xl:px-6">

          <div className="w-full md:w-full lg:w-52 xl:w-56 flex-shrink-0 mt-6">
            <div className="md:top-4 md:h-fit">
              <div className="bg-cardBackground rounded-none sm:rounded-lg border border-cardBorder">
                <SavedBar />
              </div>
            </div>
          </div>
          <div className="min-w-screen min-h-screen bg-mainBackground gap-0">
            <MainJobs API_URL="/jobs/saved" enableFilter={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedJobsContainer;
