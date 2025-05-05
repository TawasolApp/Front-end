import React, { useState } from "react";
import { axiosInstance as axios } from "../../../apis/axios";

function ReportCard({ report, onResolve }) {
  const [localReport, setLocalReport] = useState(report);
  const isPending = localReport.status === "Pending";
  const isAuthorUser = localReport.postAuthorType !== "Company";
  const [loadingAction, setLoadingAction] = useState({
    reportId: null,
    type: null,
  });
  const companyId = "6812a3dd1579ad02236101e0";
  const resolveReport = async (actionType) => {
    try {
      setLoadingAction({ reportId: report.id, type: actionType });

      await axios.patch(`/admin/reports/${report.id}/resolve`, {
        action: actionType,
        comment: "",
      });
      if (actionType === "delete_post") {
        // Manually notify parent to remove the report
        onResolve({ ...localReport, status: "Deleted" });
      } else {
        const res = await axios.get(`/admin/reports/posts`);
        const updated = res.data.find((r) => r.id === report.id);
        if (updated) {
          setLocalReport(updated);
          onResolve(updated);
        }
      }
    } catch (err) {
      console.error(`Failed to ${actionType} report`, err);
    } finally {
      setLoadingAction({ reportId: null, type: null });
    }
  };

  return (
    <div className="bg-boxbackground border border-itemBorder rounded-md p-4 space-y-6 md:space-y-0 md:grid md:grid-cols-3 gap-6 items-start">
      {/* Post Info */}
      <div className="md:col-span-2 flex flex-col sm:flex-row gap-4">
        {localReport.postAuthorAvatar && (
          <img
            src={localReport.postAuthorAvatar}
            alt="Author"
            className={`w-10 h-10 ${isAuthorUser ? "rounded-full" : "rounded"}`}
          />
        )}

        <div className="space-y-1">
          <div className="text-sm text-companyheader font-semibold">
            {localReport.postAuthor}
            <span className="text-textContent pl-2 block sm:inline">
              •{" "}
              {new Date(localReport.reportedAt).toLocaleString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </div>
          <div className="text-sm text-companysubheader">
            {localReport.postAuthorRole}
          </div>
          <p className="text-text mt-2">{localReport.postContent}</p>
          {localReport.postMedia && (
            <div className="mt-3 w-full">
              <img
                src={localReport.postMedia}
                alt="Post Media"
                className="w-full h-[300px] object-cover rounded-xl border border-itemBorder"
              />
            </div>
          )}
        </div>
      </div>

      {/* Report Meta */}
      <div className="bg-cardBackground p-4 rounded-md shadow-sm border border-card space-y-2 w-full">
        <div className="flex flex-wrap justify-between items-center text-sm text-companyheader font-semibold">
          REPORT DETAILS
          <span className="bg-yellow-100 text-yellow-800 text-sm px-2 py-1 rounded-full mt-2 sm:mt-0">
            {localReport.status}
          </span>
        </div>
        <div className="text-sm space-y-2">
          <div>
            <h3 className="text-companysubheader">Reported by</h3>
            <div className="flex items-center gap-2 pt-1">
              {localReport.reporterAvatar && (
                <img
                  src={localReport.reporterAvatar}
                  alt="Reporter"
                  className="w-6 h-6 rounded-full"
                />
              )}
              <p className="text-text text-[15px]">{localReport.reportedBy}</p>
            </div>
          </div>
          <div>
            <h3 className="text-companysubheader">Reason</h3>
            <p className="text-text font-medium text-[15px] pt-1">
              {localReport.reason}
            </p>
          </div>
        </div>

        {/* Buttons: only show when status is Pending */}
        {isPending && (
          <div className="space-y-2 pt-3">
            <button
              onClick={() => resolveReport("delete_post")}
              disabled={
                loadingAction.reportId === localReport.id &&
                loadingAction.type === "delete_post"
              }
              className={`w-full bg-buttonSubmitEnable text-white py-1 rounded-md text-sm ${
                loadingAction.reportId === localReport.id &&
                loadingAction.type === "delete_post"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {loadingAction.reportId === localReport.id &&
              loadingAction.type === "delete_post"
                ? "Deleting..."
                : "Delete Post"}
            </button>

            <button
              onClick={() => resolveReport("ignore")}
              disabled={
                loadingAction.reportId === localReport.id &&
                loadingAction.type === "ignore"
              }
              className={`w-full border border-itemBorder bg-gray-300 py-1 rounded-md text-sm ${
                loadingAction.reportId === localReport.id &&
                loadingAction.type === "ignore"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {loadingAction.reportId === localReport.id &&
              loadingAction.type === "ignore"
                ? "Ignoring..."
                : "Ignore"}
            </button>

            {isAuthorUser && (
              <button
                onClick={() => resolveReport("suspend_user")}
                disabled={
                  loadingAction.reportId === localReport.id &&
                  loadingAction.type === "suspend_user"
                }
                className={`w-full bg-red-600 text-white py-1 rounded-md text-sm ${
                  loadingAction.reportId === localReport.id &&
                  loadingAction.type === "suspend_user"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {loadingAction.reportId === localReport.id &&
                loadingAction.type === "suspend_user"
                  ? "Suspending..."
                  : "Suspend User"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportCard;
