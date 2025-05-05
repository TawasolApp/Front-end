## Saved Module — In-Depth Documentation

The **Saved** module centralizes content that users have bookmarked for later—both jobs and posts. It provides interfaces for viewing and managing saved jobs and posts. This guide details:

- Directory and file structure
- Core containers and routing
- Saved jobs workflow
- Saved posts workflow
- Shared UI components
- State management and data flows
- Testing coverage and extension points

### 📁 Directory Structure
```text
src/pages/Saved/
├── SavedBar.jsx                # Tab bar to switch between saved jobs and saved posts
├── AppliedJobsContainer.jsx    # Displays jobs the user has applied to
├── SavedJobsContainer.jsx      # Displays jobs the user has saved/bookmarked
└── SavedPostsContainer.jsx     # Displays posts the user has saved/bookmarked
```

## Core Container: SavedBar.jsx
- **Role:** Provides navigation tabs between "Saved Jobs", "Applied Jobs", and "Saved Posts".
- **Props:**
  - `activeTab`: `'jobs' | 'applied' | 'posts'`
  - `onTabChange(tab)`: callback to parent to switch view
- **UI:** Renders a horizontal bar with three buttons; highlights the selected tab.

### Routing Integration
- The application’s router integrates SavedBar in `/saved` path:
  ```jsx
  <Route path="/saved" element={<SavedContainer />}>
    <Route index element={<SavedJobsContainer />} />
    <Route path="applied" element={<AppliedJobsContainer />} />
    <Route path="posts" element={<SavedPostsContainer />} />
  </Route>
  ```
- **SavedContainer** composes `<SavedBar>` and `<Outlet>`.

## Saved Jobs: SavedJobsContainer.jsx
- **State:**
  ```ts
  interface SavedJobsState {
    savedJobs: JobType[];
    loading: boolean;
    error: string | null;
  }
  ```
- **Effects:**
  - On mount, fetch saved jobs via `GET /users/{userId}/saved/jobs`.
- **Render:**
  ```jsx
  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;
  return (
    <JobsListing jobs={savedJobs} onAction={toggleSave} />
  );
  ```
- **Actions:**
  - `toggleSave(jobId)`: `POST /jobs/{jobId}/toggle-save` removes or adds bookmark; updates `savedJobs` state.
- **UI Components:** Reuses `JobsListing` and `JobItem` from the Jobs module.

## Applied Jobs: AppliedJobsContainer.jsx
- **State:**
  ```ts
  interface AppliedJobsState {
    appliedJobs: JobType[];
    loading: boolean;
    error: string | null;
  }
  ```
- **Effects:**
  - On mount, `GET /users/{userId}/applied/jobs` to retrieve list.
- **Render:**
  ```jsx
  return (
    <JobsListing jobs={appliedJobs} disableSaveAction />
  );
  ```
- **Features:**
  - Disables save/un-save action, shows application date badge.

## Saved Posts: SavedPostsContainer.jsx
- **State:**
  ```ts
  interface SavedPostsState {
    savedPosts: PostType[];
    loading: boolean;
    error: string | null;
  }
  ```
- **Effects:**
  - On mount, fetch saved posts via `GET /users/{userId}/saved/posts`.
- **Render:**
  ```jsx
  return (
    <FeedPosts
      posts={savedPosts}
      onUnsave={postId => toggleUnsave(postId)}
    />
  );
  ```
- **Actions:**
  - `toggleUnsave(postId)`: `POST /posts/{postId}/toggle-save`; updates context state to remove.
- **Components:** Reuses `FeedPosts`, `PostContainer`, and Generic Feed UI components.

## Shared UI & Utilities
- **JobsListing/JobItem** from **Jobs** module for job display.
- **FeedPosts/PostContainer** and related **GenericComponents** for post display.
- **Spinner**, **ErrorMessage**: common loading/error indicators.
- **SavedBar**: tab navigation with accessible keyboard controls.

## Testing & Coverage
- **Vitest** tests in `src/tests/Saved/` cover:
  - Rendering each container under loading, empty, and populated states.
  - Tab switching in `SavedBar` with keyboard and click events.
  - Bookmark toggle actions with MSW-mocked API responses.

## Extension Points
- **Filter Saved Content:** Add date or type filters (e.g., posts vs. articles).
- **Bulk Actions:** Select multiple entries to remove or export bookmarks.
- **Pagination:** For large saved lists, implement infinite scroll or page numbers.
