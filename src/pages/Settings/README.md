# Settings Module

This `Settings` folder contains components that allow users to manage their preferences on the Tawasol platform. These components handle themes, profile visibility, connection preferences, blocked users, and account deletion.

Each file in this module is focused on one specific aspect of user configuration.

---

## Components Overview

### 1. `BlockedUsersPage.jsx`

- **Purpose**: Displays a list of users blocked by the current user.
- **Key Features**:
  - Fetches blocked users using `axios.get("/security/blocked-users")`.
  - Uses `LoadingPage` for async states.
  - Allows unblocking users with confirmation using `ConfirmModal`.
  - Uses `CircularProgress`, `IconButton`, and MUI icons (`ArrowBack`, `Block`).
- **Routing**: Navigates back using `useNavigate()`.

---

### 2. `ChangeState.jsx`

- **Purpose**: Updates Redux store with the latest profile and managed companies.
- **Key Features**:
  - Fetches user profile and list of companies via two API calls:
    - `/profile`
    - `/companies/managed/list`
  - Dispatches actions like `setUserId`, `setFirstName`, `setCoverPhoto`, etc. to update Redux authentication state.
  - Shows a loader (`CircularProgress`) while fetching.
  - Uses `useDispatch`, `useNavigate`, and error handling.

---

### 3. `ConnectionRequestsManagement.jsx`

- **Purpose**: Allows users to manage who can send them connection requests.
- **Key Features**:
  - Provides three predefined options:
    - Everyone
    - Email or Imported Contacts
    - Contacts Only
  - Controlled form with `currentOption` and `savedOption`.
  - Includes UI feedback via `toast`.

---

### 4. `DeleteAccount.jsx`

- **Purpose**: Allows a user to permanently delete their account.
- **Key Features**:
  - Form with a confirmation message and back button.
  - On form submission, calls `axios.delete("/users/delete-account")`.
  - Redirects to `/auth/signin` after deletion.
  - Displays a personalized message using the user's `firstName` from Redux.

---

### 5. `ProfileVisibilityPage.jsx`

- **Purpose**: Lets users choose who can view their profile.
- **Key Features**:
  - Offers three visibility modes:
    - Public
    - Connections Only
    - Private
  - Fetches current visibility from the backend using `axios.get("/security/profile-visibility")`.
  - Sends updates via `axios.patch(...)`.
  - Loading and saving states are handled using flags like `saving`.
  - Navigation with back icon and conditional rendering for `LoadingPage`.

---

### 6. `ThemeSettings.jsx`

- **Purpose**: Allows users to switch between light and dark modes.
- **Key Features**:
  - Uses Redux to store theme via `themeSlice`.
  - Dispatches `setTheme(value)` when a theme is selected.
  - Simple UI with header, subtitle, and clickable options.
  - Checks if the user logged in via social account (`isSocialLogin`) to adjust UI if needed.
  - Routing back with `useNavigate`.

---

## Implementation Patterns

- **State Management**: Uses `useState`, `useEffect`, and Redux where necessary.
- **API**: All components rely on `axiosInstance` for RESTful communication.
- **Navigation**: All components use `useNavigate` from React Router.
- **UI Libraries**: Uses MUI (`@mui/icons-material`, `@mui/material`) and Tailwind CSS for styling.
- **Feedback**: Relies on `react-toastify` for toast notifications.

---

## Summary Table

| Component                          | Description                             |
| ---------------------------------- | --------------------------------------- |
| `BlockedUsersPage.jsx`             | View and unblock blocked users          |
| `ChangeState.jsx`                  | Refresh and dispatch profile to Redux   |
| `ConnectionRequestsManagement.jsx` | Manage who can connect with you         |
| `DeleteAccount.jsx`                | Delete your Tawasol account permanently |
| `ProfileVisibilityPage.jsx`        | Choose who can view your profile        |
| `ThemeSettings.jsx`                | Toggle between light and dark themes    |

---
