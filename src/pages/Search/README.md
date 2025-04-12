# Search Module Documentation

This directory contains the search functionality components for TawasolApp, providing a LinkedIn-style search experience with filters for posts, people, and companies.

## 📁 Component Structure

- **SearchContainer.jsx**: Main container component that manages search filters and results display
- **SearchPosts.jsx**: Displays post search results using the MainFeed component
- **SearchPeople.jsx**: Renders people search results with profile details
- **SearchCompany.jsx**: Shows company search results with company information and follow functionality

## 🔍 Key Features

- **Filter-based Search**: Switch between posts, people, and companies
- **Time Frame Filtering**: (SHOWN ONLY IN POST FILTER) Filter posts by recency (day, week, month, or all time)
- **Network Filtering**: (SHOWN ONLY IN POST FILTER) Option to search only within the user's network
- **Company Filtering**: (SHOWN ONLY IN PEOPLE FILTER) Option to search for users in a specific company
- **Industry Filtering**: (SHOWN ONLY IN COMPANY FILTER) Option to search for company in a specific industry

## 🔄 Data Flow

1. `SearchContainer` extracts search text from URL parameters
2. User selects desired main filter (posts, people, company) (content type, time frame, network)
3. User adds a secondary filter if wanted (posts contains recency, within network boolean while people filter has company as a secondary, etc..)
4. Appropriate search component is rendered based on selected filter and secondary filters are then passed as a prop to the component
5. Results are fetched via API calls with pagination support
6. Users can interact with results (view profiles, follow companies, etc.)

## 🧩 Component Details

### SearchContainer

- Manages filter state and selection
- Routes to appropriate search component based on filter
- Provides consistent layout and filtering UI

### SearchPosts

- Leverages the main feed component with search parameters
- Displays post results in the same format as the regular feed

### SearchPeople

- Shows person cards with name, headline, and avatar
- Supports pagination and error handling

### SearchCompany

- Displays company cards with logo, name, verification status, and follower count
- Supports following/unfollowing companies directly from search results
- Includes pagination and error handling
