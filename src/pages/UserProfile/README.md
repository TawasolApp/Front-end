---
#  UserProfile Module — Tawasol Platform

The `UserProfile` module is a core part of the Tawasol frontend. It enables users to manage and showcase their profile with dynamic sections such as experience, education, skills, certifications, and posts. It also includes functionality for editing personal information, controlling profile visibility, and interacting socially (via endorsements, messages, or connections).
---

## File and Folder Descriptions

### `profileLayout.jsx`

- **Purpose**: Acts as the layout wrapper for the user profile pages.
- **Functionality**:
  - Fetches user data based on the `userId` from the URL.
  - Passes user data and ownership status to child components via React Router's `Outlet`.

---

### `Components/`

#### **ProfilePage.jsx**

- **Purpose**: The main page for displaying the user's profile.
- **Functionality**:
  - Combines various sections like `About`, `Education`, `Experience`, `Skills`, and `Certifications`.
  - Includes the `ProfileHeader` for displaying user details and modals for editing.

#### **AboutComponents/AboutEditingModal.jsx**

- **Purpose**: Modal for editing the "About" section of the user profile.
- **Functionality**:
  - Allows users to update their bio.
  - Handles API calls for saving or deleting the bio.

#### **GenericDisplay/**

- **GenericCard.jsx**:
  - Renders individual cards for items like work experience, education, skills, and certifications.
  - Supports editing and displaying details like dates, descriptions, and logos.
- **GenericModal.jsx**:
  - A reusable modal component for editing items like experience and education and skills and certifications .
- **GenericPage.jsx**:
  - A generic page component for displaying lists of items (e.g., skills, certifications), when redirected from the generic section on main profile
- **GenericSection.jsx**:
  - A reusable section component for grouping and displaying items like education or experience appears on mian profile like education, experience and skills sections .

#### **HeaderComponents/**

- **ContactInfoModal.jsx**:
  - Modal for displaying and editing the user's contact information.
- **CoverPhoto.jsx**:
  - Component for displaying and editing the user's cover photo.
- **EditProfileModal.jsx**:
  - Modal for editing the user's profile details (e.g., name, headline).
- **ProfileHeader.jsx**:
  - Displays the user's profile picture, name, and other header details.
  - Includes modals for editing profile details, visibility, and contact info.
- **ProfilePicture.jsx**:

  - Component for displaying and editing the user's profile picture.

#### **RestrictedProfilevisibility/**

**RestrictedProfilevisibility.jsx**:

- Renders a lock message when a user without permission tries to view a private profile.
- Displays suggestions like sending a connection request if not connected.

#### **ModalFields/**

- Contains reusable components for rendering fields inside modals (e.g., experience fields, education fields).

#### **Pages/**

- **CertificationsPage.jsx**:
  - Displays a list of the user's certifications using the `GenericPage` component.
- **SkillsPage.jsx**:
  - Displays a list of the user's skills using the `GenericPage` component.

#### **Sections/**

- **AboutSection.jsx**:
  - Displays the "About" section of the user's profile.
  - Includes a button to open the `AboutEditingModal`.
- **CertificationsSection.jsx**:
  - Displays the user's certifications using the `GenericSection` component.
- **EducationSection.jsx**:
  - Displays the user's education history using the `GenericSection` component.
- **ExperienceSection.jsx**:
  - Displays the user's work experience using the `GenericSection` component.
- **SkillsSection.jsx**:
  - Displays the user's skills using the `GenericSection` component.

#### **SkillsComponents/**

- Contains components related to skills, such as endorsements.
- **SkillEndorsement.jsx**:
  - Displays current endorsement count for a skill.
  - Allows viewers to endorse skills (except their own).
  - Updates count via POST request and shows confirmation.
- **SkillEndorsersModal.jsx**:
  - Modal listing users who endorsed a skill with avatars and names.
  - Opens when clicking the endorsement count on a skill card.

#### **UserPostsSlider/**

- **UserPostsSlider.jsx**:

  - Displays a horizontal slider with up to 5 recent posts by the user.
  - Includes a “Show all posts” link that navigates to the full post page.

- **UserPostsPage.jsx**: _(Already mentioned, but you can expand it slightly)_
  - Fetches all posts made by the user using `MainFeed`.
  - Renders the full list with filtering/sorting capabilities.

---

## Flow of the User Profile Module

1. **Profile Layout**:

   - The `profileLayout.jsx` file acts as the entry point for the user profile module.
   - It fetches user data and passes it to child components via the `Outlet`.

2. **Profile Header**:

   - The `ProfileHeader` component displays the user's profile picture, name, and other details.
   - Includes modals for editing profile details, visibility, and contact info.

3. **Sections**:

   - The profile is divided into sections (e.g., About, Education, Experience, Skills, Certifications).
   - Each section uses a `GenericSection` or a custom component to display and manage data.

4. **Modals**:

   - Modals are used for editing specific sections (e.g., `EditProfileModal`, `AboutEditingModal`).
   - Fields inside modals are managed using components from the `ModalFields` directory.

5. **Pages**:

   - Pages like `SkillsPage` and `CertificationsPage` use the `GenericPage` component to display lists of items.

6. **User Posts**:
   - The `UserPostsPage` component displays a feed of the user's posts.

---

## Key Features

- **Modular Design**: Reusable components like `GenericCard`, `GenericModal`, and `GenericSection` make it easy to add or modify sections.
- **Dynamic Data**: Fetches and displays user data dynamically based on the logged-in user or the profile being viewed.
- **Editable Sections**: Users can edit their profile details, including experience, education, skills, and certifications.

---
