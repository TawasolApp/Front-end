---

## File and Folder Descriptions

### `CompanyLayout.jsx`
- **Purpose**: Acts as the layout wrapper for the company-related pages.
- **Functionality**:
  - Fetches company data based on the `companyId` from the URL.
  - Handles loading states and redirects if the company is not found.
  - Passes company data and admin status to child components via React Router's `Outlet`.

---

### `Components/`

#### **AboutPage/**

- **AboutLocations.jsx**:
  - Displays the company's location with a Google Maps embed and a "Get Directions" link.
- **AboutOverview.jsx**:
  - Displays an overview of the company, including details like industry, size, and headquarters.
- **OverviewComponent.jsx**:
  - A reusable component for rendering individual pieces of company information.

#### **CreateCompanyPage/**

- **CreateCompanyPage.jsx**:
  - A page for creating a new company profile.
  - Includes form validation, file uploads (e.g., logo), and API integration for creating a company.

#### **GenericComponents/**

- **CompanyHeader.jsx**:
  - Displays the company's header, including the logo, banner, and navigation buttons.
  - Includes admin-specific actions like editing the company profile or adding managers.
- **Footer.jsx**:
  - A footer component for the company pages.

#### **HomePage/**

- **ImageEnlarge.jsx**:
  - A modal for enlarging the company's banner image.
- **JobOpenings.jsx**:
  - Displays a slider of recent job openings posted by the company.
- **OverviewBox.jsx**:
  - Displays a brief overview of the company with a "See More" option.

#### **JobsPage/**

- **AddJobModal.jsx**:
  - A modal for adding new job postings.
- **Analytics.jsx**:
  - Displays analytics for job postings, such as the number of applicants.
- **ApplyModal.jsx**:
  - A modal for applying to a job posting.
- **JobApplications.jsx**:
  - Displays a list of applicants for a specific job posting.
- **JobCard.jsx**:
  - A card component for displaying individual job postings.
- **JobDetails.jsx**:
  - Displays detailed information about a selected job posting.
- **JobsList.jsx**:
  - Displays a list of job postings in a scrollable panel.

#### **Modals/**

- **AddManagerModal.jsx**:
  - A modal for adding managers to the company.
- **EditAboutModal.jsx**:
  - A modal for editing the company's "About" section.
- **FollowersModal.jsx**:
  - A modal for displaying the list of followers of the company.
- **UnfollowModal.jsx**:
  - A modal for confirming the action to unfollow the company.

#### **Pages/**

- **AboutPage.jsx**:
  - Displays the company's "About" section, including the overview and locations.
- **HomePage.jsx**:
  - The main page for the company, displaying the overview, posts, and job openings.
- **JobsPage.jsx**:
  - Displays the company's job postings and allows admins to manage them.
- **PostsPage.jsx**:
  - Displays a feed of posts made by the company.

#### **Slider/**

- **PostsSlider.jsx**:
  - A slider component for displaying posts made by the company.

---

## Flow of the Company Module

1. **Company Layout**:

   - The `CompanyLayout.jsx` file acts as the entry point for the company module.
   - It fetches company data and passes it to child components via the `Outlet`.

2. **Company Header**:

   - The `CompanyHeader` component displays the company's logo, banner, and navigation buttons.
   - Includes admin-specific actions like editing the company profile or adding managers.

3. **Pages**:

   - The module includes pages for the company's home, about, jobs, and posts sections.
   - Each page fetches and displays relevant data dynamically.

4. **Modals**:

   - Modals are used for specific actions like editing the company profile, adding managers, or applying to jobs.

5. **Job Management**:

   - The `JobsPage` and its related components handle job postings, applications, and analytics.

6. **Posts and Followers**:
   - The `PostsPage` displays a feed of posts made by the company.
   - The `FollowersModal` displays a list of users following the company.

---

## Key Features

- **Dynamic Data**: Fetches and displays company data dynamically based on the `companyId` in the URL.
- **Admin Controls**: Provides admin-specific actions like editing the company profile, managing jobs, and adding managers.
- **Job Management**: Allows companies to post jobs, view applications, and analyze job performance.
- **User Interaction**: Enables users to follow companies, view job postings, and apply for jobs.
- **Responsive Design**: Components are designed to work seamlessly across different screen sizes.

---

This `README.md` provides an overview of the `Company` module, its structure, and its functionality.
