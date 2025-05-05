import React, { useState, useEffect } from "react";
import ReportFilters from "../Reports/ReportFilters";
import ReportStats from "../Reports/ReportStats";
import { axiosInstance as axios } from "../../../apis/axios";
import LoadingPage from "../../LoadingScreen/LoadingPage";

function ReportedUsers() {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState({
    reportId: null,
    type: null,
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("/admin/reports/users");
        setReports(res.data);
      } catch (err) {
        console.error("Failed to fetch reported users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);
  const resolveReport = async (reportId, action) => {
    try {
      setLoadingAction({ reportId, type: action });
      await axios.patch(`/admin/reports/${reportId}/resolve`, {
        action,
        comment: "",
      });

      const res = await axios.get("/admin/reports/users");
      setReports(res.data);
    } catch (error) {
      console.error(`Failed to ${action} report ${reportId}`, error);
    } finally {
      setLoadingAction({ reportId: null, type: null });
    }
  };

  const filteredReports = reports.filter((report) => {
    return filter === "All" || report.status === filter;
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

      <div className="flex justify-end">
        <ReportFilters current={filter} onChange={setFilter} />
      </div>

      <p className="text-sm text-textContent">
        Showing {filteredReports.length} of {reports.length} reports
      </p>

      {loading ? (
        <LoadingPage />
      ) : (
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
                    src={report.reportedUserAvatar}
                    alt="Reported User"
                    className="w-10 h-10 rounded-full border border-itemBorder"
                  />
                  <div>
                    <p className="text-sm font-semibold text-companyheader">
                      {report.reportedUser}
                    </p>
                    <p className="text-xs text-companysubheader">
                      {report.reportedUserRole}
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
                    src={report.reporterAvatar}
                    alt="Reporter"
                    className="w-10 h-10 rounded-full border border-itemBorder"
                  />
                  <div>
                    <p className="text-sm font-medium text-text">
                      {report.reportedBy}
                    </p>
                  </div>
                </div>

                <div className="pt-1">
                  <h5 className="text-xs text-companysubheader uppercase">
                    Reason
                  </h5>
                  <p className="text-sm font-medium text-text">
                    {report.reason}
                  </p>
                  <p className="text-xs text-companysubheader">
                    Reported at {new Date(report.reportedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Actions + Status */}
              <div className="w-full md:w-[25%] relative min-h-[160px]">
                {/* Status badge at top-right */}
                <span className="absolute top-2 right-2 text-sm bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium z-10">
                  {report.status}
                </span>

                {/* Action buttons pinned to bottom-right side */}
                {report.status === "Pending" && (
                  <div className="absolute bottom-2 left-2 right-2 space-y-2">
                    <button
                      onClick={() => resolveReport(report.id, "ignore")}
                      disabled={
                        loadingAction.reportId === report.id &&
                        loadingAction.type === "ignore"
                      }
                      className={`w-full text-sm border border-itemBorder rounded-md px-3 py-1 text-text bg-gray-300 ${
                        loadingAction.reportId === report.id &&
                        loadingAction.type === "ignore"
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {loadingAction.reportId === report.id &&
                      loadingAction.type === "ignore"
                        ? "Ignoring..."
                        : "Ignore"}
                    </button>

                    <button
                      onClick={() => resolveReport(report.id, "suspend_user")}
                      disabled={
                        loadingAction.reportId === report.id &&
                        loadingAction.type === "suspend_user"
                      }
                      className={`w-full text-sm text-white bg-red-600 hover:bg-red-700 transition rounded-md px-3 py-1 ${
                        loadingAction.reportId === report.id &&
                        loadingAction.type === "suspend_user"
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {loadingAction.reportId === report.id &&
                      loadingAction.type === "suspend_user"
                        ? "Suspending..."
                        : "Suspend User"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ReportStats reports={reports} />
    </div>
  );
}

export default ReportedUsers;
