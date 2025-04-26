import React, { useState } from "react";
import ReportFilters from "./ReportFilters";
import ReportCard from "./ReportCard";
import ReportStats from "./ReportStats";

const mockReports = [
  {
    id: "1",
    type: "post",
    status: "Pending",
    reported_by: "David Miller",
    reason: "Illegal activity",
    report_detail: "Promoting sale of counterfeit goods",
    reported_at: "2025-04-21T18:39:57.140Z",
    post_content: "I am selling counterfeit products at half the price.",
    post_author: "Lisa Williams",
    post_author_role: "Business Owner",
    post_author_avatar: "/media/lisa.png",
    reporter_avatar: "/media/david.png",
  },
  {
    id: "2",
    type: "post",
    status: "Pending",
    reported_by: "Sarah Smith",
    reason: "Hate speech",
    report_detail: "Contains offensive language targeting specific groups",
    reported_at: "2025-04-20T16:30:00.000Z",
    post_content:
      "This is an inappropriate post with offensive language that violates our community guidelines.",
    post_author: "John Doe",
    post_author_role: "Software Engineer at Tech Co.",
    post_author_avatar: "/media/john.png",
    reporter_avatar: "/media/sarah.png",
  },
  {
    id: "3",
    type: "post",
    status: "Reviewed",
    reported_by: "Jane Cooper",
    reason: "Spam",
    report_detail: "Repeated promotion of a product across posts",
    reported_at: "2025-04-18T10:10:00.000Z",
    post_content: "Buy our amazing product now, 50% off for a limited time!",
    post_author: "Emma Green",
    post_author_role: "Marketing Manager",
  },
  {
    id: "4",
    type: "post",
    status: "Dismissed",
    reported_by: "Jake Long",
    reason: "Irrelevant content",
    report_detail: "Not related to professional discussion",
    reported_at: "2025-04-17T08:20:00.000Z",
    post_content: "Here’s my cat doing a funny dance!",
    post_author: "Oliver Brown",
    post_author_role: "Freelancer",
  },
  {
    id: "5",
    type: "post",
    status: "Actioned",
    reported_by: "Mia Thompson",
    reason: "Harassment",
    report_detail: "Personal attacks in the comment section",
    reported_at: "2025-04-15T13:45:00.000Z",
    post_content: "You are the dumbest person I've seen on this platform.",
    post_author: "Noah Lee",
    post_author_role: "Content Writer",
  },
];

function Reports() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filteredReports = mockReports.filter((report) => {
    const matchesStatus = filter === "All" || report.status === filter;
    const matchesSearch = report.post_content
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1 text-text">
          Reported Posts
        </h2>
        <p className="text-textContent ">
          Monitor reports of inappropriate content.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Search reported posts..."
          className="w-full sm:max-w-sm p-2 rounded-md border border-itemBorder text-text bg-inputBackground"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ReportFilters current={filter} onChange={setFilter} />
      </div>

      <p className="text-sm text-textContent">
        Showing {filteredReports.length} of {mockReports.length} reports
      </p>

      <div className="space-y-4">
        {filteredReports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>

      <ReportStats reports={mockReports} />
    </div>
  );
}

export default Reports;
