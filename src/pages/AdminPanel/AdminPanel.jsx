import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import Jobs from "../AdminPanel/Jobs/Jobs.jsx";
import Reports from "../AdminPanel/Reports/Reports.jsx";
import AdminAnalytics from "../AdminPanel/AdminAnalytics/AdminAnalytics.jsx";
import ReportedUsers from "./ReportedUsers/ReportedUsers.jsx";

const navItems = [
  { label: "Reported Posts", id: "reports" },
  { label: "Reported Users", id: "reportedUsers" },
  { label: "Job Listings", id: "jobs" },
  { label: "Analytics", id: "analytics" },
];

function AdminPanel() {
  const [activeTab, setActiveTab] = useState("reports");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row bg-mainBackground min-h-screen">
      {/* Mobile Navbar */}
      <div className="md:hidden flex items-center justify-between bg-boxbackground p-4 shadow-lg">
        <h1 className="text-xl font-bold text-text">Admin Panel</h1>
        <button onClick={() => setSidebarOpen((prev) => !prev)}>
          <FiMenu className="text-2xl text-text" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-boxbackground shadow-lg p-4 md:h-screen sticky md:top-0 z-10`}
      >
        <h1 className="text-2xl font-bold mb-6 text-text hidden md:block">
          Admin Panel
        </h1>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false); // auto close on mobile
              }}
              className={`w-full text-left px-4 py-2 rounded-md transition ${
                activeTab === item.id
                  ? "bg-buttonSubmitEnable text-buttonSubmitText"
                  : "hover:bg-buttonHover text-text"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-mainBackground text-text px-4 sm:px-6 md:px-8 pb-8 overflow-y-auto">
        {activeTab === "reports" && <Reports />}
        {activeTab === "jobs" && <Jobs />}
        {activeTab === "analytics" && <AdminAnalytics />}
        {activeTab === "reportedUsers" && <ReportedUsers />}
      </main>
    </div>
  );
}

export default AdminPanel;
