import React, { useState, useEffect } from "react";
import UserAnalytics from "./UserAnalytics";
import PostAnalytics from "./PostAnalytics";
import JobAnalytics from "./JobAnalytics";
import { axiosInstance as axios } from "../../../apis/axios";
import LoadingPage from "../../LoadingScreen/LoadingPage";

function AdminAnalytics() {
  const [userAnalytics, setUserAnalytics] = useState(null);
  const [postAnalytics, setPostAnalytics] = useState(null);
  const [jobAnalytics, setJobAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const [userRes, postRes, jobRes] = await Promise.all([
          axios.get("/admin/analytics/users"),
          axios.get("/admin/analytics/posts"),
          axios.get("/admin/analytics/jobs"),
        ]);
        setUserAnalytics(userRes.data);
        setPostAnalytics(postRes.data);
        setJobAnalytics(jobRes.data);
        console.log("Job Analytics API Response:", jobRes.data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading || !userAnalytics || !postAnalytics || !jobAnalytics) {
    return (
      <div className="text-center py-10 text-lg text-gray-600">
        <LoadingPage />
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10 space-y-14">
      <div className="mb-2 pb-0">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-companyheader">
            Admin Analytics Dashboard
          </h1>
          <p className="mt-1 text-textContent text-lg">
            Track engagement, posts, and job performance across the platform.
          </p>
        </header>
        <p className="mt-2 ml-2 text-sm text-gray-500 italic text-left">
          * All analytics data reflects activity from the last 30 days.
        </p>
      </div>

      <section className="grid md:grid-cols-3 gap-6 text-white ">
        <div className="bg-blue-600 rounded-2xl p-6 shadow-lg">
          <p className="text-lg">Total Users</p>
          <h2 className="text-3xl font-extrabold">
            {userAnalytics.totalUsers.toLocaleString()}
          </h2>
        </div>
        <div className="bg-green-600 rounded-2xl p-6 shadow-lg">
          <p className="text-lg">Total Posts</p>
          <h2 className="text-3xl font-extrabold">
            {postAnalytics.totalPosts.toLocaleString()}
          </h2>
        </div>
        <div className="bg-purple-600 rounded-2xl p-6 shadow-lg">
          <p className="text-lg">Total Jobs</p>
          <h2 className="text-3xl font-extrabold">
            {jobAnalytics.totalJobs.toLocaleString()}
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
