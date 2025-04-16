# 🔄 MyNetwork Module Documentation

This directory contains components for managing a user's professional network in TawasolApp, including connections, followers, and network recommendations.

## 📁 Directory Structure

```
MyNetwork/
├── Connections/                    # Connection management components
│   ├── ConnectionPage.jsx          # Main connections page
│   └── ConnectionCard.jsx          # Individual connection display card
├── BlockedPage.jsx                 # Page for viewing and managing blocked users
├── FollowPage.jsx                  # Page for managing followers and following
├── ManageConnections.jsx           # Component for handling connection invitations
├── NetworkBox.jsx                  # Main network dashboard component
└── RecommendedUsers.jsx            # Component for displaying and interacting with recommended users
```

## 🔍 Key Components

### Network Management

- **NetworkBox.jsx**:

  - Main dashboard showing invitations, recommendations, and premium features
  - Handles connection requests with accept/ignore functionality
  - Entry point for network management workflows

- **ManageConnections.jsx**:
  - Provides detailed invitation management with tabs for received/sent requests
  - Supports infinite scrolling for pagination of requests

### Connections

- **ConnectionPage.jsx**:

  - Displays all established connections
  - Provides sorting options (recently added, first name, last name)
  - Enables messaging and connection management

- **ConnectionCard.jsx**:
  - Individual card displaying connection details
  - Includes profile image, name, headline, and interaction options

### Following System

- **FollowPage.jsx**:

  - Manages followers and following relationships with tabbed interface
  - Supports follow/unfollow actions with confirmation modals
  - Implements infinite scroll for pagination

- **BlockedPage.jsx**:
  - Displays and manages blocked users
  - Allows unblocking of previously blocked users

### User Discovery

- **RecommendedUsers.jsx**:
  - Displays algorithmically suggested connections
  - Supports connection requests with tracking for pending status
  - Features expandable view with infinite scrolling for more recommendations

## 🔄 Data Flow

1. **Network Dashboard**:

   - Network data is fetched and displayed in NetworkBox.jsx
   - Provides navigation to more detailed network management components

2. **Connection Management**:

   - ManageConnections.jsx handles incoming and outgoing connection requests
   - Actions in this component affect the Redux store and trigger API calls

3. **Following System**:

   - FollowPage.jsx manages the follow/follower relationships
   - Follows a similar pattern with API-connected actions for follow/unfollow

4. **User Discovery**:
   - RecommendedUsers.jsx presents potential new connections
   - API-backed recommendations with pagination for endless discovery

## 🚀 Key Features

- **Real-time Status Updates**: Connection and follow requests reflect current status
- **Infinite Scrolling**: Implemented throughout for smooth pagination
- **Responsive Design**: Components adapt to different screen sizes
- **Contextual Actions**: Different options based on connection status
- **User Navigation**: Profile linking throughout for easy network exploration
- **Confirmation Flows**: Modal confirmations for critical actions like unfollowing

## ✨ UI Components

- Consistent use of tailored card designs for network entities
- Tab navigation for switching between related network views
- Loading indicators during API operations
- Empty state handling when no data is available

## 🔌 Integration

The MyNetwork components integrate with:

- Authentication system for protected actions
- User profile system for displaying user details
- Redux store for managing network-related state
- Backend APIs for all network operations

---

This module provides a comprehensive set of tools for users to build, manage, and navigate their professional network within the TawasolApp platform.
