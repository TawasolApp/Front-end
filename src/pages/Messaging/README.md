# Messaging Module Documentation

## Overview

The messaging module provides a comprehensive in-application messaging system with real-time capabilities, conversation management, and responsive design. It enables users to communicate privately through text messages and media attachments.

## Directory Structure

```
src/pages/Messaging/
├── MessagingPage/
│   ├── MessagingPage.jsx          # Top-level page component
│   ├── MessagingContainer.jsx     # Main layout container
│   ├── ConversationList.jsx       # List of user conversations
│   ├── ConversationView.jsx       # Individual conversation display
│   ├── MessagingFilters.jsx       # Filtering options for conversations
│   └── MessagingHeader.jsx        # Header with title and actions
├── New Message Modal/
│   ├── ProfileCard.jsx            # Recipient profile display
│   └── NewMessageModalInputs.jsx  # Message input controls
└── README.md                      # This documentation file
```

## Components

### MessagingPage

The top-level component that wraps the messaging interface in the application's layout.

**Key features:**
- Responsive container with appropriate spacing
- Handles page-level layout concerns

### MessagingContainer

The central component that orchestrates the messaging interface.

**Key features:**
- Manages active filter state
- Handles conversation selection
- Implements responsive layout for desktop and mobile
- Provides back navigation for mobile view

### ConversationList

Displays all conversations for the current user with filtering capabilities.

**Key features:**
- Renders list of conversations with preview information
- Supports filtering by "All", "Unread", etc.
- Highlights selected conversation
- Updates in real-time when new messages arrive

### ConversationView

Displays a single conversation with message history and input for new messages.

**Key features:**
- Shows conversation header with recipient information
- Displays chronological message history with read/delivered status
- Provides message input with media attachment support
- Supports real-time message updates
- Indicates message delivery status
- Handles user blocking functionality

### MessagingFilters

Provides filtering options for the conversation list.

**Key features:**
- Toggle between different conversation filters (All, Unread)
- Visually indicates active filter

### MessagingHeader

The header component for the messaging interface.

**Key features:**
- Displays section title
- May include action buttons for creating new messages

### New Message Modal Components

#### ProfileCard

Displays recipient profile information in message contexts.

**Key features:**
- Shows recipient name, headline, and profile picture
- Provides navigation to user profile

#### NewMessageModalInputs

Input component for composing new messages.

**Key features:**
- Text input for message content
- Media attachment support
- Send button functionality
- Validation and error handling

## Technical Implementation

### State Management
- Local React state for UI controls
- Redux for user identity and global state
- Real-time updates via Socket.IO

### Data Flow
1. MessagingContainer manages the overall state
2. ConversationList fetches and displays conversation previews
3. ConversationView loads and displays messages for a selected conversation
4. Real-time updates are managed through socket events

### Responsive Design
- Desktop view: Side-by-side conversation list and message view
- Mobile view: Toggle between conversation list and single conversation

### Socket Integration
- Real-time message delivery
- Read receipts and typing indicators
- Connected/disconnected status handling

## Testing

Tests are available in the parallel test directory structure:

```
src/tests/Messaging/
├── MessagingPage/
│   ├── MessagingPage.test.jsx
│   ├── MessagingContainer.test.jsx
│   ├── ConversationList.test.jsx
│   ├── ConversationView.test.jsx
│   └── ...
└── New Message Modal/
    └── ...
```

## Usage

The Messaging module is typically accessed through the main navigation of the application. It can be included in your routes configuration like:

```jsx
<Route path="/messages" element={<MessagingPage />} />
```

## Future Enhancements

- Voice/video messaging capabilities
- Message reactions and replies
- Group messaging functionality
- Enhanced media attachment handling
- Message search functionality
- End-to-end encryption