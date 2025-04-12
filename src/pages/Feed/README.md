# Feed Component Documentation

This directory contains the News Feed feature of the TawasolApp application, which handles displaying posts, interacting with content, and managing the overall feed experience.

## 📁 Directory Structure

```
Feed/
├── FeedContainer.jsx               # Main container for the feed page
├── MainFeed/                       # Core feed functionality
│   ├── MainFeed.jsx                # Handles post fetching and infinite scrolling
│   ├── FeedPosts/                  # Post display components
│   │   ├── FeedPosts.jsx           # Renders the list of posts
│   │   ├── PostContainer.jsx       # Context provider for individual posts
│   │   ├── PostContext.jsx         # Context for post data and actions
│   │   ├── Post/                   # Individual post components
│   │   │   ├── PostCard.jsx        # Main post card component
│   │   │   ├── PostModal.jsx       # Expanded post view
│   │   │   ├── Content/            # Post content components (text, media)
│   │   │   ├── Header/             # Post header components
│   │   │   ├── Activities/         # Like, comment, repost buttons
│   │   │   ├── Comments/           # Comment components and threads
│   │   │   ├── Metrics/            # Engagement metrics display
│   │   │   └── MediaCarousel/      # Media viewer components
│   │   ├── ReactionModal/          # Displays post reactions
│   │   └── DeleteModal/            # Confirms post deletion
│   └── SharePost/                  # Post creation components
├── LeftSideBar/                    # User profile and navigation sidebar
├── RightSideBar/                   # Additional content sidebar
├── SinglePost.jsx                  # Single post view page
└── RepostsContainer.jsx            # Displays reposted content
```

## 🔍 Key Components

### Containers In General

- FeedContainer
- RepostContainer
- SavedPostContainer
  All are the main layout component that calls the MainFeed component which handles all types of the feed.

### MainFeed

Contains both the feed display and share post display, also handles displaying all types of scenarios (no more pagination, no posts at all, loading..)
This component is the main manipulator for the Feed, it can be manipulated by giving different parameters to be used anywhere, it is used in the main feed, the saved feed, the search feed, the reposts feed, the company feed and the user's feed

### PostContainer, PostContext, PostCard and PostModal

The post are propped down to post container, this container constructs the context of the post, and inside of it create 2 views for the post (card which appears by default on the feed, and modal which is shown after clicking on a media)
PostContext provides the context for individual posts, it includes all API endpoints, and the general states (post, comments, replies)

### Post Components

Handle the display and interactions for individual posts:

- **Header**: the header of any post and allows navigation to users and company, also silentRepostHeader which is shown if a silent repost was made
- **Content**: both the text content and and the media display (all types)
- **Metrics**: the metrics of the post (reactions, commentsCount, and replies)
- **Activities**: Like, comment, repost, and share buttons
- **Comments**: comments and replies
- **Carousel**: used only in posts modal, it displays the media of the post in posts modal
- **TextModal**: Created in share post, but it is a generic component for sharing, editing posts, it handles media adding and user tagging, takes initial text, and initial tagged users and initial media for editing

### Generic Components

- **ReactionsModal**: this modal takes the API and fetches the reactions and display them with pagination and filtering
- **TextEditor**: Allows both posts, commenting and replying to have the same editor so adding markups for tagging could be in only one place and all other components use it
- **TextViewer**: Takes the text, the tagged users, and maximum number of characters, removes the markups and create a hyperlink for any link or tagged users, while also slice the text if greater than max number of chars and shows "...more" or "...less"
- **DropdownMenu**: a generic item that takes an array of a json that includes a text, icon and on click function, each json is then mapped, enables clean coding
- **DropdownUsers**: Dropdown menu but for the users, used in tagging
- **ReactionPicker**: a very generic component, it opens when the user hover on the children of this component, it is a list of reactions that reacts on clicking on any of them, handles its own logic (removed after not being on it for certain amount of time, the hovering reactions, etc..)
- **ReactionIcons**: a json just to save the icons, colors and labels in one place

## 🚀 Features

- **Infinite Scrolling**: Automatically loads more posts as the user scrolls down
- **Post Creation**: Create and share new posts with text, images, videos or documents
- **Reactions**: Like/react to posts with various emoji reactions
- **Comments**: Add, edit, delete comments and replies
- **Media Support**: Display images, videos and PDF documents in posts
- **User Mentions**: Tag other users in posts and comments
- **Responsive Design**: Adapts to different screen sizes

## 🔄 Data Flow

1. `MainFeed` fetches posts from the API based on provided parameters
2. `FeedPosts` renders the posts using `PostContainer` components
3. Each `PostContainer` wraps a post in a `PostContext.Provider`
4. User interactions trigger handlers defined in the `PostContext`

The feed component has comprehensive test coverage, ensuring reliability and functionality.
