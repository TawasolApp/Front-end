import React, { useState, useEffect } from "react";
import { axiosInstance as axios } from "../../../apis/axios";
import ReportFilters from "./ReportFilters";
import ReportCard from "./ReportCard";
import ReportStats from "./ReportStats";
import LoadingPage from "../../LoadingScreen/LoadingPage";

function Reports() {
  const [reports, setAllReports] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const updateReport = (updatedReport) => {
    setAllReports((prevReports) =>
      prevReports.map((r) => (r.id === updatedReport.id ? updatedReport : r))
    );
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/admin/reports/posts");
        setAllReports(res.data);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const filteredReports =
    filter === "All" ? reports : reports.filter((r) => r.status === filter);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1 text-text">
          Reported Posts
        </h2>
        <p className="text-textContent">
          Monitor reports of inappropriate content.
        </p>
      </div>

      <div className="flex justify-end">
        <ReportFilters current={filter} onChange={setFilter} />
      </div>

      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <p className="text-sm text-textContent">
            Showing {filteredReports.length} of {reports.length} reports
          </p>

          <div className="space-y-4">
            {filteredReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onResolve={updateReport}
              />
            ))}
          </div>

          <ReportStats reports={reports} />
        </>
      )}
    </div>
  );
}

export default Reports;
