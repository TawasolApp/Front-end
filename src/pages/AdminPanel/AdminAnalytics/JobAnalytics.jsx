import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { FaBriefcase } from "react-icons/fa";

const COLORS = ["#8b5cf6", "#a78bfa", "#c4b5fd"];

function JobAnalytics({ jobAnalytics }) {
  // Create chart data with value = 1 to evenly split if no counts provided
  const jobData = jobAnalytics.most_applied_companies.map((company) => ({
    name: company,
    value: 1,
  }));

  return (
    <section className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <FaBriefcase className="text-purple-600" /> Job Analytics
      </h3>

      {/* Total Jobs */}
      <p className="text-lg text-gray-700 font-semibold mb-6">
        Total Jobs:{" "}
        <span className="text-purple-600 font-bold">
          {jobAnalytics.total_jobs.toLocaleString()}
        </span>
      </p>

      {/* Donut Chart + List */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Donut Chart */}
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={jobData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {jobData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        {/* Company List */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">
            Most Applied Companies
          </h4>
          <ul className="list-disc list-inside text-gray-600">
            {jobAnalytics.most_applied_companies.map((company, index) => (
              <li key={index} className="mb-1">
                {company}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default JobAnalytics;
