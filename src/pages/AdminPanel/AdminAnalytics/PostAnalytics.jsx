import { React, useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { FaFileAlt } from "react-icons/fa";
import { axiosInstance as axios } from "../../../apis/axios";
import PostCard from "./PostCard";

function PostAnalytics({ postAnalytics }) {
  const postActivityData = [
    { name: "Shares", count: postAnalytics.totalShares },
    { name: "Comments", count: postAnalytics.totalComments },
    { name: "Reacts", count: postAnalytics.totalReacts },
  ];

  const [mostInteractedPost, setMostInteractedPost] = useState(null);
  const [mostReportedPost, setMostReportedPost] = useState(null);
  useEffect(() => {
    const fetchPosts = async () => {
      const companyId = "680e3213a0fd57504643a43c";
      try {
        const [interactedRes, reportedRes] = await Promise.all([
          axios.get(
            `/posts/${companyId}/${postAnalytics.postWithMostInteractions}`
          ),
          axios.get(`/posts/${companyId}/${postAnalytics.mostReportedPost}`),
        ]);

        setMostInteractedPost(interactedRes.data);
        setMostReportedPost(reportedRes.data);
      } catch (err) {
        console.error("Failed to fetch post details:", err);
      }
    };

    if (
      postAnalytics.postWithMostInteractions &&
      postAnalytics.mostReportedPost
    ) {
      fetchPosts();
    }
  }, [postAnalytics]);

  return (
    <section className="bg-white border border-gray-200 rounded-xl shadow-md p-6 space-y-8">
      {/* Top Summary Card */}
      <div className="flex items-center justify-between">
        <h4 className="text-xl font-semibold text-companyheader flex items-center gap-2">
          <FaFileAlt className="w-5 h-5 text-green-600" />
          Post Analytics
        </h4>
        <p className="text-2xl font-bold text-green-600">
          {postAnalytics.totalPosts?.toLocaleString() ?? "N/A"} Posts
        </p>
      </div>

      {/* Chart */}
      <div>
        <h4 className="text-lg font-semibold mb-3 text-gray-700">
          Posts Activity Overview
        </h4>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={postActivityData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#10b981" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Divider */}
      <hr className="border-t border-gray-300" />

      {/* Details */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Post With Most Interactions */}
        <div>
          <h4 className="text-lg font-semibold mb-3 text-gray-700">
            Post With Most Interactions
          </h4>
          {mostInteractedPost ? (
            <PostCard post={mostInteractedPost} />
          ) : (
            <p className="text-sm text-gray-500 italic">
              Post ID: {postAnalytics.postWithMostInteractions}
            </p>
          )}
        </div>

        {/* Most Reported Post */}
        <div>
          <h4 className="text-lg font-semibold mb-3 text-gray-700">
            Most Reported Post
          </h4>
          {mostReportedPost ? (
            <PostCard
              post={mostReportedPost}
              reportCount={postAnalytics.postReportedCount}
            />
          ) : (
            <p className="text-sm text-gray-500 italic">
              Post ID: {postAnalytics.mostReportedPost}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default PostAnalytics;
