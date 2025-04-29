import React from "react";
import UserAnalytics from "./UserAnalytics";
import PostAnalytics from "./PostAnalytics";
import JobAnalytics from "./JobAnalytics";

const mockAnalytics = {
  userAnalytics: {
    total_users: 1520,
    active_users: {
      daily: 123,
      weekly: 456,
      monthly: 789,
    },
  },
  postAnalytics: {
    total_posts: 3421,
    most_active_users: ["Sarah Smith", "John Doe", "Emma Green"],
    most_reported_posts: ["Post ID #123", "Post ID #456", "Post ID #789"],
  },
  jobAnalytics: {
    total_jobs: 104,
    most_applied_companies: ["TechCorp", "DesignHub", "ManageCo"],
  },
};

function AdminAnalytics() {
  const { userAnalytics, postAnalytics, jobAnalytics } = mockAnalytics;

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10 space-y-14">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-companyheader">
          📈 Admin Analytics Dashboard
        </h1>
        <p className="mt-2 text-textContent text-lg">
          Track engagement, posts, and job performance across the platform.
        </p>
      </header>

      <section className="grid md:grid-cols-3 gap-6 text-white">
        <div className="bg-blue-600 rounded-2xl p-6 shadow-lg">
          <p className="text-lg">Total Users</p>
          <h2 className="text-3xl font-extrabold">
            {userAnalytics.total_users.toLocaleString()}
          </h2>
        </div>
        <div className="bg-green-600 rounded-2xl p-6 shadow-lg">
          <p className="text-lg">Total Posts</p>
          <h2 className="text-3xl font-extrabold">
            {postAnalytics.total_posts.toLocaleString()}
          </h2>
        </div>
        <div className="bg-purple-600 rounded-2xl p-6 shadow-lg">
          <p className="text-lg">Total Jobs</p>
          <h2 className="text-3xl font-extrabold">
            {jobAnalytics.total_jobs.toLocaleString()}
          </h2>
        </div>
      </section>

      <UserAnalytics userAnalytics={userAnalytics} />
      <PostAnalytics postAnalytics={postAnalytics} />
      <JobAnalytics jobAnalytics={jobAnalytics} />
    </div>
  );
}

export default AdminAnalytics;
