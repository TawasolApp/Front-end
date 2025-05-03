# Privacy Module

The `Privacy` folder is responsible for handling user interactions related to reporting and blocking content or users. It provides modals for various report types and integrates with the backend to submit these reports securely and efficiently. This module supports reporting posts, users, jobs, and also blocking users through a consistent and accessible interface.

---

## Components Overview

### 1. `PostReportModal.jsx`

This component renders a modal allowing users to report a specific post. It supports:

- Selecting from predefined reasons such as spam, inappropriate content, etc.
- Providing a custom reason when "Something else..." is selected.
- Submitting the report via an API call to the backend.
- Validating input to ensure a reason is selected before submission.
- Displaying success or error toasts using `react-toastify`.

### 2. `ReportBlockModal.jsx`

This dual-purpose modal handles both:

- **Blocking** a user permanently from the current viewer’s perspective.
- **Reporting** a user for abuse, impersonation, or other violations.

It toggles between block confirmation and reporting states and provides visual feedback upon successful operations. It also uses:

- `onBlocked` and `onReported` callbacks.
- Modal transitions and UI state control using internal state.

### 3. `ReportJobModal.jsx`

Allows users to report job listings. Features include:

- Predefined reasons like misleading job info, fake postings, or harassment.
- Optional custom input if “Other” is selected.
- API integration to send the report reason with the target job ID.
- Form validation and error handling for missing reasons.
- Use of loading state (`isSubmitting`) for UX responsiveness.

### 4. `UserReportModal.jsx`

Dedicated modal to report user profiles. It contains:

- A dropdown of report reasons related to user behavior or account issues.
- Option to enter a custom reason.
- Uses API POST requests to `/report/user` or similar endpoint.
- Loading feedback during submission and error handling.
- Emits a callback `onSubmitComplete` after successful submission.

---

## Shared Behavior and Best Practices

- All modals use **controlled form inputs** and **state hooks** for managing input and transitions.
- Common elements include:
  - `<textarea>` for detailed reasons.
  - Buttons with conditional states (`disabled`, `loading`).
  - Validation logic before API submission.
- They import:
  - `axiosInstance` for HTTP calls.
  - `react-toastify` for toast notifications.
- UI feedback is immediate, and the DOM state is cleaned up on modal close.

---
