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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FaUsers } from "react-icons/fa";

const COLORS = ["#0a66c2", "#4ba3f2", "#9bcdfc"];

function UsersAnalytics({ userAnalytics }) {
  const activeUsersData = [
    { period: "Daily", users: userAnalytics.active_users.daily },
    { period: "Weekly", users: userAnalytics.active_users.weekly },
    { period: "Monthly", users: userAnalytics.active_users.monthly },
  ];

  const pieData = activeUsersData.map(({ period, users }) => ({
    name: period,
    value: users,
  }));

  return (
    <div className="bg-boxbackground border border-itemBorder rounded-2xl p-6 shadow-md space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-companyheader flex items-center gap-2">
          <FaUsers className="w-5 h-5 text-blue-600" />
          User Analytics
        </h3>
        <p className="text-2xl font-bold text-[#0a66c2]">
          {userAnalytics.total_users.toLocaleString()} Users
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={activeUsersData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="users" fill="#0a66c2" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              dataKey="value"
            >
              {pieData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default UsersAnalytics;
