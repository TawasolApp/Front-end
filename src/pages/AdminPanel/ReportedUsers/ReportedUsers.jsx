import React, { useState } from "react";
import ReportFilters from "../Reports/ReportFilters";
import ReportStats from "../Reports/ReportStats";

const mockUserReports = [
  {
    id: "u1",
    status: "Pending",
    reported_user: "Jake Ryan",
    reported_user_role: "Product Designer",
    reported_user_avatar: "/media/jake.png",
    reported_by: "Lily Adams",
    reporter_avatar: "/media/lily.png",
    reason: "Inappropriate profile content",
    report_detail: "Profile contains offensive language",
    reported_at: "2025-04-22T14:25:00.000Z",
  },
  {
    id: "u2",
    status: "Reviewed",
    reported_user: "Ava Brooks",
    reported_user_role: "Team Lead",
    reported_user_avatar: "/media/ava.png",
    reported_by: "Noah Evans",
    reporter_avatar: "/media/noah.png",
    reason: "Impersonation",
    report_detail: "Claiming to be someone they're not",
    reported_at: "2025-04-20T10:45:00.000Z",
  },
];

function ReportedUsers() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filteredReports = mockUserReports.filter((report) => {
    const matchesStatus = filter === "All" || report.status === filter;
    const matchesSearch = report.reported_user
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1 text-text">
          Reported Users
        </h2>
        <p className="text-textContent">
          Monitor reports of inappropriate user behavior.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Search reported users..."
          className="w-full sm:max-w-sm p-2 rounded-md border border-itemBorder text-text bg-inputBackground"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ReportFilters current={filter} onChange={setFilter} />
      </div>

      <p className="text-sm text-textContent">
        Showing {filteredReports.length} of {mockUserReports.length} reports
      </p>

      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-boxbackground border border-itemBorder rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-start md:justify-between gap-6"
          >
            {/* Reported User Info */}
            <div className="w-full md:w-[25%] space-y-2">
              <h4 className="text-xs text-companysubheader uppercase">
                Reported User
              </h4>
              <div className="flex items-center gap-3">
                <img
                  src={report.reported_user_avatar}
                  alt="Reported User"
                  className="w-10 h-10 rounded-full border border-itemBorder"
                />
                <div>
                  <p className="text-sm font-semibold text-companyheader">
                    {report.reported_user}
                  </p>
                  <p className="text-xs text-companysubheader">
                    {report.reported_user_role}
                  </p>
                </div>
              </div>
            </div>

            {/* Reporter Info */}
            <div className="w-full md:w-[45%] space-y-2">
              <h4 className="text-xs text-companysubheader uppercase">
                Reported By
              </h4>
              <div className="flex items-center gap-3">
                <img
                  src={report.reporter_avatar}
                  alt="Reporter"
                  className="w-10 h-10 rounded-full border border-itemBorder"
                />
                <div>
                  <p className="text-sm font-medium text-text">
                    {report.reported_by}
                  </p>
                  <p className="text-xs text-companysubheader">
                    Filed the report
                  </p>
                </div>
              </div>

              <div className="pt-1">
                <h5 className="text-xs text-companysubheader uppercase">
                  Reason
                </h5>
                <p className="text-sm font-medium text-text">{report.reason}</p>
                <p className="text-xs text-companysubheader">
                  {report.report_detail}
                </p>
              </div>
            </div>

            {/* Actions + Status */}
            <div className="w-full md:w-[25%] space-y-2">
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium">
                {report.status}
              </span>
              <button className="w-full text-sm text-white bg-buttonSubmitEnable hover:bg-blue-700 transition rounded-md px-3 py-1">
                Suspend User
              </button>
              <button className="w-full text-sm border border-itemBorder rounded-md px-3 py-1 text-text">
                Ignore
              </button>
            </div>
          </div>
        ))}
      </div>

      <ReportStats reports={mockUserReports} />
    </div>
  );
}

export default ReportedUsers;
