import React from "react";
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

function PostAnalytics({ postAnalytics }) {
  const postActivityData = [
    {
      name: "Active Posts",
      count:
        postAnalytics.total_posts - postAnalytics.most_reported_posts.length,
    },
    {
      name: "Reported Posts",
      count: postAnalytics.most_reported_posts.length,
    },
  ];

  return (
    <section className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <FaFileAlt className="text-green-600" /> Post Analytics
      </h3>

      {/* Post Count Summary */}
      <div className="mb-6">
        <p className="text-lg text-gray-700 font-semibold">
          Total Posts:{" "}
          <span className="text-green-600 font-bold">
            {postAnalytics.total_posts.toLocaleString()}
          </span>
        </p>
      </div>

      {/* Horizontal Bar Chart */}
      <div className="mb-10">
        <h4 className="text-lg font-semibold mb-3 text-gray-700">
          Post Activity
        </h4>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={postActivityData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
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

      {/* Lists */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Most Active Users */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">
            Most Active Users
          </h4>
          <ul className="list-disc list-inside text-gray-600">
            {postAnalytics.most_active_users.map((user, index) => (
              <li key={index}>{user}</li>
            ))}
          </ul>
        </div>

        {/* Most Reported Posts */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">
            Most Reported Posts
          </h4>
          <ul className="list-disc list-inside text-red-500">
            {postAnalytics.most_reported_posts.map((post, index) => (
              <li key={index}>{post}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default PostAnalytics;
