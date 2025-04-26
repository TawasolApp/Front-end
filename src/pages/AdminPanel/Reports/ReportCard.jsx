import React from "react";

function ReportCard({ report }) {
  return (
    <div className="bg-boxbackground border border-itemBorder rounded-md p-4 space-y-6 md:space-y-0 md:grid md:grid-cols-3 gap-6 items-start">
      {/* Post Info */}
      <div className="md:col-span-2 flex flex-col sm:flex-row gap-4">
        {report.post_author_avatar && (
          <img
            src={report.post_author_avatar}
            alt="Author"
            className="w-10 h-10 rounded-full"
          />
        )}
        <div className="space-y-1">
          <div className="text-sm text-companyheader font-semibold">
            {report.post_author}
            <span className="text-textContent pl-2 block sm:inline">
              •{" "}
              {new Date(report.reported_at).toLocaleString("en-US", {
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
            {report.post_author_role}
          </div>
          <p className="text-text mt-2">{report.post_content}</p>
        </div>
      </div>

      {/* Report Meta */}
      <div className="bg-cardBackground p-4 rounded-md shadow-sm border border-card space-y-2 w-full">
        <div className="flex flex-wrap justify-between items-center text-sm text-companyheader font-semibold">
          REPORT DETAILS
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full mt-2 sm:mt-0">
            {report.status}
          </span>
        </div>
        <div className="text-sm space-y-2">
          <div>
            <h3 className="text-companysubheader">Reported by</h3>
            <div className="flex items-center gap-2 pt-1">
              {report.reporter_avatar && (
                <img
                  src={report.reporter_avatar}
                  alt="Reporter"
                  className="w-6 h-6 rounded-full"
                />
              )}
              <p className="text-text text-[15px]">{report.reported_by}</p>
            </div>
          </div>
          <div>
            <h3 className="text-companysubheader">Reason</h3>
            <p className="text-text font-medium text-[15px] pt-1">
              {report.reason}
            </p>
            <p className="text-companysubheader pt-1">{report.report_detail}</p>
          </div>
        </div>

        <div className="space-y-2 pt-3">
          <button className="w-full bg-buttonSubmitEnable text-white py-1 rounded-md text-sm">
            Delete Post
          </button>
          <button className="w-full border border-itemBorder py-1 rounded-md text-sm">
            Ignore
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportCard;
