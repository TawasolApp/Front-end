import MainJobs from "../Jobs/MainJobs/MainJobs";

const SearchJobs = ({ keyword, industry, location }) => {
  return (
    <div className="min-w-screen min-h-screen bg-mainBackground gap-0">
      <MainJobs
        API_URL="/jobs"
        enableFilter={false}
        keyword={keyword}
        industry={industry}
        location={location}
      />
    </div>
  );
};

export default SearchJobs;
