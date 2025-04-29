## Search Module — In-Depth Documentation

The **Search** module enables users to find content across the app: companies, jobs, people, and posts. This guide covers:

- Directory layout and routing
- Core container and subviews
- Component breakdowns with props, state, and API calls
- Data flow diagrams
- State management and actions
- Testing coverage and extensibility

### 📁 Directory Structure
```text
src/pages/Search/
├── SearchContainer.jsx        # Main container: handles query input and tab routing
├── SearchCompany.jsx          # Displays company search results
├── SearchJobs.jsx             # Displays job search results
├── SearchPeople.jsx           # Displays people search results
├── SearchPosts.jsx            # Displays post search results
└── README.md                  # (this in-depth documentation)
```

## Core Container: SearchContainer.jsx
- **Role:** Centralizes search input, query state, and tab-based result views.
- **State:**
  ```ts
  interface SearchState {
    query: string;
    activeTab: 'companies' | 'jobs' | 'people' | 'posts';
    loading: boolean;
    error: string | null;
  }
  ```
- **UI Elements:**
  - Search bar with controlled `input.value = query` and `onChange` handler.
  - Tab navigation: four tabs corresponding to subviews.
- **Effects:**
  - On `query` or `activeTab` change: debounced effect (300ms) invokes `performSearch()`.
- **Methods:**
  ```js
  const performSearch = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/search/${activeTab}`, { params: { q: query } });
      setResults(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  ```
- **Render Pattern:**
  ```jsx
  return (
    <>
      <SearchBar value={query} onChange={setQuery} />
      <TabNav active={activeTab} onChange={setTab} />
      {loading ? <Spinner /> : error ? <Error message={error} /> : <Outlet data={results} />}
    </>
  );
  ```

## Subview Components

All subviews receive `results` array via props or React Router’s `useOutletContext()`.

### SearchCompany.jsx
- **Props/Context:** `results: CompanyType[]`
- **Render:**
  ```jsx
  return results.length
    ? results.map(c => <CompanyCard key={c.companyId} company={c} />)
    : <EmptyState message="No companies found" />;
  ```
- **CompanyCard:** shows logo, name, industry, location, follow button invoking `POST /companies/{id}/toggle-follow`.

### SearchJobs.jsx
- **Props/Context:** `results: JobType[]`
- **Render:** reuse `JobsListing` and `JobItem` from Jobs module with `jobs={results}`.
- **Actions:** clicking job navigates to detail.

### SearchPeople.jsx
- **Props/Context:** `results: UserType[]`
- **Render:** list of `<UserCard key={user.id} user={user} />` showing avatar, name, headline, connect button (`POST /connections`).
- **Stateful UI:** button toggles between "Connect" / "Pending" / "Connected" based on `user.connectionStatus`.

### SearchPosts.jsx
- **Props/Context:** `results: PostType[]`
- **Render:** reuse `FeedPosts` with `posts={results}` and disabled infinite scroll.
- **Actions:** all interactions (react, comment) remain functional.

## Data Flow & Lifecycle
```mermaid
flowchart TB
  SC[SearchContainer] -->|GET /search/{tab}?q=| API[/search endpoints]
  API --> SC{search results}
  SC --> SC[TabNav & SearchBar]
  SC -->|pass| Subview[Active Tab Component]
  Subview -->|render| Card/List
  List -->|action| API (e.g., follow, apply, react)
  API --> Subview (update local state)
```
1. **User input** updates `query` state.
2. **Debounced effect** triggers `performSearch()`.
3. **API** returns JSON results array.
4. **Subview** renders list; user actions call respective APIs.

## API Endpoints
| Endpoint               | Method | Description                                  |
|------------------------|--------|----------------------------------------------|
| `/search/companies`    | GET    | Search companies by name, industry           |
| `/search/jobs`         | GET    | Search jobs by keywords                      |
| `/search/people`       | GET    | Search users by name, headline               |
| `/search/posts`        | GET    | Search posts by content                      |

## State Management
- SearchContainer uses local component state.
- No Redux or Context; lightweight and isolated.
- Each subview leverages shared UI but manages its own action state (e.g., follow status).

## Testing & Coverage
- Tests under `src/tests/Search/`:
  - **SearchContainer.test.jsx**: renders input, tabs, mock API responses.
  - **SearchCompany.test.jsx**: renders company cards, follow button behavior.
  - **SearchJobs.test.jsx**: listing rendering and navigation.
  - **SearchPeople.test.jsx**: user list and connect workflow.
  - **SearchPosts.test.jsx**: posts display and disabled infinite scroll.
- API calls mocked via MSW in tests, asserting correct request URLs and params.

## Extension Points
- **Advanced Filters:** add filter panel (e.g., location, date) toggled next to search bar.
- **Recent Searches:** persist and display user’s recent queries below input.
- **Search Suggestions:** live autocomplete via `GET /search/suggestions?q=`.
