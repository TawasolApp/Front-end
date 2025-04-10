import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function Analytics({ jobs }) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const chartData = jobs.map((job) => ({
    name: job.position,
    applicants: job.applicants ?? 0,
  }));

  return (
    <div className="bg-boxbackground p-4 shadow-md rounded-md w-full max-w-3xl mx-auto mt-8">
      <h2 className="text-xl font-semibold text-text mb-4">Job Analytics</h2>

      {jobs.length === 0 ? (
        <p className="text-sm text-companysubheader">No jobs available.</p>
      ) : (
        <>
          {/* Chart Section */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgb(var(--companysubheader))"
                />
                <XAxis
                  dataKey="name"
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={60}
                  tick={{
                    fill: "rgb(var(--companysubheader))",
                    fontSize: 12,
                  }}
                />
                <YAxis
                  tick={{
                    fill: "rgb(var(--companysubheader))",
                    fontSize: 12,
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgb(var(--boxbackground))",
                    border: "1px solid rgb(var(--companysubheader))",
                    color: "rgb(var(--text))",
                    fontSize: "0.875rem",
                  }}
                  labelStyle={{ color: "rgb(var(--text))" }}
                />
                <Bar dataKey="applicants" fill="rgb(59, 130, 246)" />{" "}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* List Summary */}
          <ul className="space-y-3 mt-6">
            {jobs.map((job) => (
              <li
                key={job.jobId}
                className="flex items-center justify-between border border-companysubheader rounded-md px-4 py-3 bg-boxbackground"
              >
                <span className="text-text font-medium">{job.position}</span>
                <span className="text-sm font-semibold text-blue-400">
                  {job.applicants ?? 0} applicants
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Analytics;
