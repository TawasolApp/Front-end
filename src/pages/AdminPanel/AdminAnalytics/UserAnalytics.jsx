import React, { useEffect, useState } from "react";
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
import { FaUsers } from "react-icons/fa";
import { axiosInstance as axios } from "../../../apis/axios";
import LoadingPage from "../../../pages/LoadingScreen/LoadingPage";

function UsersAnalytics({ userAnalytics }) {
  const [activeProfiles, setActiveProfiles] = useState([]);
  const [reportedUserProfile, setReportedUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        // Fetch most active user profiles
        const activePromises = userAnalytics.mostActiveUsers.map((user) =>
          axios.get(`/profile/${user.userId}`)
        );
        const activeResponses = await Promise.all(activePromises);
        const activeProfilesData = activeResponses.map((res, index) => ({
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          fullName: `${res.data.firstName} ${res.data.lastName}`,
          profilePicture: res.data.profilePicture,
          activityScore: userAnalytics.mostActiveUsers[index].activityScore,
        }));
        setActiveProfiles(activeProfilesData);

        // Fetch most reported user profile
        if (userAnalytics.mostReportedUser) {
          const reportedRes = await axios.get(
            `/profile/${userAnalytics.mostReportedUser}`
          );
          setReportedUserProfile(reportedRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch user profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [userAnalytics]);

  if (loading) return <LoadingPage />;

  return (
    <div className="bg-boxbackground border border-itemBorder rounded-2xl p-6 shadow-md space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-companyheader flex items-center gap-2">
          <FaUsers className="w-5 h-5 text-blue-600" />
          User Analytics
        </h3>
        <p className="text-2xl font-bold text-[#0a66c2]">
          {userAnalytics.totalUsers?.toLocaleString() ?? "N/A"} Users
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* Left column: Chart + Most Reported User */}
        <div className="space-y-6">
          {/* Chart */}
          <div>
            <h4 className="text-lg font-medium text-text mb-2">
              Most Active Users & Their Scores
            </h4>
            <ResponsiveContainer width="100%" height={340}>
              <BarChart
                data={activeProfiles}
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="firstName"
                  interval={0}
                  height={40}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="activityScore"
                  fill="#0a66c2"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Most Reported User */}
          <div className="space-y-4 text-sm text-textContent border-t-2 border-t-itemBorder pt-2">
            <h4 className="text-lg font-medium text-text">
              Most Reported User Details
            </h4>
            <div className="bg-boxbackground p-4 rounded-lg border border-itemBorder shadow">
              {reportedUserProfile ? (
                <div className="flex items-start gap-4">
                  <img
                    src={reportedUserProfile.profilePicture}
                    alt="profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-base font-semibold text-blue-600">
                      {reportedUserProfile.firstName}{" "}
                      {reportedUserProfile.lastName}
                    </p>
                    <p className="text-sm text-textContent italic mt-1">
                      {reportedUserProfile.bio || "No bio available"}
                    </p>
                    <p className="mt-2">
                      <span className="font-medium">Reports Received:</span>{" "}
                      {userAnalytics.userReportedCount ?? 0}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="italic text-textContent">No reported user data</p>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Most Active Users */}
        <div>
          <h4 className="text-lg font-medium text-text mb-4">
            Most Active Users Details
          </h4>
          <ul className="space-y-4">
            {activeProfiles.map((profile, idx) => (
              <li key={idx} className="flex items-center gap-4">
                <img
                  src={profile.profilePicture}
                  alt={profile.fullName}
                  className="w-10 h-10 rounded-full object-cover border border-white"
                />
                <div>
                  <p className="text-sm font-semibold text-text">
                    {profile.fullName}
                  </p>
                  <p className="text-xs text-textContent">
                    Activity Score: {profile.activityScore}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UsersAnalytics;
