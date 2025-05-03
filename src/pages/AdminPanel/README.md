---

## File Descriptions

### AdminPanel.jsx
- *Purpose*: Serves as the main entry point for the admin panel.
- *Functionality*:
  - Provides a sidebar navigation for switching between different admin functionalities (e.g., Reports, Jobs, Analytics).
  - Manages the active tab state and renders the corresponding component dynamically.
  - Includes a responsive design with a collapsible sidebar for mobile devices.
- *Key Features*:
  - Navigation items: Reported Posts, Reported Users, Job Listings, Analytics.
  - Uses useState for managing the active tab and sidebar visibility.
  - Integrates with components like Reports, Jobs, AdminAnalytics, and ReportedUsers.

---

### AdminAnalytics/

#### _AdminAnalytics.jsx_

- _Purpose_: The main dashboard for viewing platform analytics.
- _Functionality_:
  - Fetches and displays analytics data for users, posts, and jobs.
  - Integrates with UserAnalytics, PostAnalytics, and JobAnalytics components for detailed insights.
- _Key Features_:
  - Displays total users, posts, and jobs in a summary section.
  - Uses axios to fetch analytics data from the backend.
  - Handles loading states with a LoadingPage component.

#### _UserAnalytics.jsx_

- _Purpose_: Displays analytics related to user activity.
- _Functionality_:
  - Shows the most active users and their activity scores.
  - Displays the most reported user and their profile details.
- _Key Features_:
  - Uses a bar chart (recharts) to visualize user activity.
  - Fetches user profiles for the most active and most reported users.

#### _PostAnalytics.jsx_

- _Purpose_: Displays analytics related to posts.
- _Functionality_:
  - Shows the post with the most interactions and the most reported post.
  - Displays a bar chart for post activity (e.g., shares, comments, reacts).
- _Key Features_:
  - Fetches post details for the most interacted and most reported posts.
  - Uses PostCard to display post details.

#### _JobAnalytics.jsx_

- _Purpose_: Displays analytics related to job postings.
- _Functionality_:
  - Shows the most applied job and the company with the most applications.
  - Displays the total number of jobs and reported jobs.
- _Key Features_:
  - Fetches job and company details for analytics.
  - Uses axios for API calls and handles loading states.

#### _PostCard.jsx_

- _Purpose_: A reusable component for displaying post details.
- _Functionality_:
  - Displays the post content, media, and report count (if applicable).
- _Key Features_:
  - Formats timestamps for display.
  - Handles optional report count display.

---

### Jobs/

#### _Jobs.jsx_

- _Purpose_: Displays and manages job listings.
- _Functionality_:
  - Fetches and displays a list of jobs with filters and search functionality.
  - Allows administrators to delete or ignore flagged jobs.
- _Key Features_:
  - Pagination for job listings.
  - Filters for flagged jobs and search by job title.
  - Uses JobCard for individual job details.

#### _JobCard.jsx_

- _Purpose_: Displays details of a single job listing.
- _Functionality_:
  - Shows job details such as position, company, location, and status.
  - Provides actions for deleting or ignoring flagged jobs.
- _Key Features_:
  - Handles loading states for delete and ignore actions.
  - Uses axios for API calls to delete or ignore jobs.

#### _JobFilters.jsx_

- _Purpose_: Provides filters for job listings.
- _Functionality_:
  - Allows filtering jobs by "All" or "Flagged" status.
- _Key Features_:
  - Uses buttons for toggling between filter options.
  - Calls the onChange callback with the selected filter.

---

### ReportedUsers/

#### _ReportedUsers.jsx_

- _Purpose_: Displays and manages reports of inappropriate user behavior.
- _Functionality_:
  - Fetches and displays a list of reported users.
  - Allows administrators to resolve reports by ignoring or suspending users.
- _Key Features_:
  - Filters reports by status (e.g., Pending, Actioned, Dismissed).
  - Displays reporter and reported user details.
  - Uses ReportStats for a summary of report statuses.

---

### Reports/

#### _Reports.jsx_

- _Purpose_: Displays and manages reports of inappropriate posts.
- _Functionality_:
  - Fetches and displays a list of reported posts.
  - Allows administrators to resolve reports by deleting posts or ignoring reports.
- _Key Features_:
  - Filters reports by status (e.g., Pending, Actioned, Dismissed).
  - Uses ReportCard for individual report details.
  - Displays a summary of report statuses using ReportStats.

#### _ReportCard.jsx_

- _Purpose_: Displays details of a single report.
- _Functionality_:
  - Shows the reported post, reporter details, and report reason.
  - Provides actions for resolving the report (e.g., delete post, ignore report).
- _Key Features_:
  - Handles loading states for resolving actions.
  - Uses axios for API calls to resolve reports.

#### _ReportFilters.jsx_

- _Purpose_: Provides filters for reports.
- _Functionality_:
  - Allows filtering reports by "All," "Pending," "Actioned," or "Dismissed" status.
- _Key Features_:
  - Uses buttons for toggling between filter options.
  - Calls the onChange callback with the selected filter.

#### _ReportStats.jsx_

- _Purpose_: Displays a summary of report statuses.
- _Functionality_:
  - Shows the count of reports in each status (e.g., Pending, Actioned, Dismissed).
- _Key Features_:
  - Uses a grid layout for displaying status counts.
  - Dynamically calculates counts based on the provided reports.

---

## Flow of the Admin Panel Module

1. _Admin Panel Layout_:

   - The AdminPanel.jsx file acts as the entry point for the module.
   - Provides a sidebar navigation for switching between different admin functionalities.

2. _Reports Management_:

   - The Reports.jsx component fetches and displays reported posts.
   - Administrators can resolve reports by deleting posts or ignoring reports.

3. _Reported Users Management_:

   - The ReportedUsers.jsx component fetches and displays reported users.
   - Administrators can resolve reports by suspending or ignoring users.

4. _Job Listings Management_:

   - The Jobs.jsx component fetches and displays job listings.
   - Administrators can delete or ignore flagged jobs.

5. _Analytics Dashboard_:
   - The AdminAnalytics.jsx component displays analytics for users, posts, and jobs.
   - Integrates with UserAnalytics, PostAnalytics, and JobAnalytics for detailed insights.

---

## Key Features

- _Centralized Dashboard_:

  - Provides a single interface for managing reports, jobs, and analytics.

- _Responsive Design_:

  - Fully responsive layout with a collapsible sidebar for mobile devices.

- _Filters and Search_:

  - Includes filters and search functionality for reports and job listings.

- _Analytics Visualization_:

  - Uses charts (recharts) to visualize user, post, and job analytics.

- _Actionable Reports_:
  - Allows administrators to take actions on reports (e.g., delete posts, suspend users).
