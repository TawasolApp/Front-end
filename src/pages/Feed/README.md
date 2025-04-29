## Feed Module — In-Depth Documentation

The **Feed** module is the heart of TawasolApp, responsible for presenting and interacting with posts across various contexts (main feed, saved feeds, user’s personal feed, company feed, search results, and repost stream). This document details every component, its responsibilities, data flow, and state management strategies.

### 📁 Directory Structure

```text
src/pages/Feed/
├── FeedContainer.jsx           # Entry point: chooses between feed variants
├── SinglePost.jsx              # Dedicated post view for shareable links
├── RepostsContainer.jsx        # Filters feed to repost-only entries
├── LeftSideBar/                # Profile summary & nav links
│   └── LeftSideBar.jsx
├── RightSideBar/               # Suggested content & promotions
│   └── RightSideBar.jsx
├── MainFeed/                   # Core feed mechanics & share UI
│   ├── MainFeed.jsx            # Infinite scroll logic & state
│   ├── FeedPosts/              # Post list rendering
│   │   ├── FeedPosts.jsx       # Receives `posts[]`, maps to PostContainer
│   │   ├── PostContainer.jsx   # Wraps each post with context
│   │   ├── PostContext.jsx     # React Context: post data + action hooks
│   │   ├── Post/               # Granular post display & interactions
│   │   │   ├── Header/         # PostCardHeader.jsx, SilentRepostHeader.jsx
│   │   │   ├── Content/        # PostContent.jsx (text), MediaContent (MediaItem, MediaDisplay, PdfViewer)
│   │   │   ├── Activities/     # LikeButton.jsx, CommentButton.jsx, RepostButton.jsx, SendButton.jsx, ActivitiesHolder.jsx
│   │   │   ├── Metrics/        # EngagementMetrics.jsx (counts, reaction summary)
│   │   │   ├── PostCard.jsx    # Collapsed post view for feed
│   │   │   └── PostModal.jsx   # Overlay with carousel, comments thread
│   │   ├── ReactionModal/      # ReactionsModal.jsx: paginated reactors list
│   │   └── DeleteModal/        # DeletePostModal.jsx: confirm deletion
│   └── SharePost/              # Post-creation UI components
│       ├── SharePost.jsx       # Input bar + media attachments
│       └── TextModal.jsx       # Rich editor: text, tagging, media
└── GenericComponents/          # Reusable UI across module
    ├── ActorHeader.jsx         # Renders avatar + actor link + timestamp
    ├── DropdownMenu.jsx        # Configurable action dropdown
    ├── DropdownUsers.jsx       # User search dropdown for mentions
    ├── ReactionPicker.jsx      # Hover-triggered emoji palette
    ├── TextEditor.jsx          # Controlled editor for posts/comments
    ├── TextViewer.jsx          # Parses markup, handles truncation
    └── reactionIcons.js        # Reaction type → icon/color mapping
```

## Component Breakdown

#### FeedContainer.jsx
- **Role:** Wraps the entire page in layout grid: `LeftSideBar | Main Content | RightSideBar`.
- **Logic:**
  - Reads React Router params (e.g., `/feed`, `/feed/saved`, `/post/:id`, `/company/:id`, `/reposts`).
  - Conditionally renders:
    - `<MainFeed filter={...} />`
    - `<SinglePost postId={id} />`
    - `<RepostsContainer userId={...} />`
- **Props passed:**
  - `filter` object: `{ type: 'main' | 'saved' | 'company' | 'user', id?: string }`
  - Pagination settings (pageSize, defaultPage)

#### LeftSideBar/LeftSideBar.jsx
- **Displays:**
  - Current user’s avatar, name, headline (pulled from Redux store).
  - Navigation links: "My Feed", "My Network", "Jobs", "Messaging", "Notifications".
- **Data:** Uses `useSelector` to get user profile state.

#### RightSideBar/RightSideBar.jsx
- **Displays:**
  - Suggested job listings, trending hashtags, sponsored posts.
- **Fetches:** via `useEffect` on mount:
  ```js
  axios.get('/suggestions').then(setSuggestions)
  ```
- **Props:** optional `context` to vary sidebar (e.g., on `/company/:id`).

#### MainFeed/MainFeed.jsx
- **State:**
  ```ts
  interface MainFeedState {
    posts: PostType[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    page: number;
  }
  ```
- **Effects:**
  - On mount and when `filter` changes, resets `posts`, `page=1`, fetches first batch.
  - Scroll listener (throttled) calls `loadMore()` when `window.innerHeight + scrollY >= document.body.offsetHeight - 200`.
- **Methods:**
  - `fetchPosts(page)`: `GET /posts?filterType=...&id=...&page=&pageSize=`
  - `loadMore()`: if `hasMore && !loading` → increment `page` and fetch.
- **Render:**
  ```jsx
  return (
    <>  
      <SharePost onPostCreated={prependToPosts} />
      {posts.length === 0 && !loading ? <EmptyState /> : <FeedPosts posts={posts} />}
      {loading && <Spinner />}
      {!hasMore && <EndOfFeed />}  
    </>
  );
  ```

#### FeedPosts/FeedPosts.jsx
- **Props:** `posts: PostType[]`
- **Function:** Maps `posts.map(post => <PostContainer key={post.id} post={post} />)`.
- **Edge Cases:** If no posts, propagates empty state.

#### FeedPosts/PostContainer.jsx
- **Props:** `post: PostType`
- **Context Provider:** Wraps children in `<PostContext.Provider value={...}>`:
  - `postData`, `comments`, `reactions`
  - `actions`: `addComment`, `toggleReaction`, `deletePost`, `fetchComments`, etc.
- **Render:**
  ```jsx
  <ActorHeader actor={post.author} />
  <PostCard />
  <PostModal />  
  <DeleteModal />  
  <ReactionModal />
  ```

#### FeedPosts/PostContext.jsx
- Defines:
  - `PostContext` using `createContext<PostContextType>(...)`
  - `usePostContext()` hook for children.
- On mount, preloads: `fetchReactions()`, `fetchComments()`.

#### FeedPosts/Post/PostCard.jsx
- **Collapsed display:**
  - `Header`: `<PostCardHeader post={postData} />`
  - `Content`: `<PostContent content={postData.content} media={postData.media} />`
  - `Metrics`: `<EngagementMetrics meta={postData.meta} />`
  - `Activities`: `<ActivitiesHolder actions={context.actions} meta={postData.meta} />`
- **Interactions:** Clicking media opens `PostModal`; clicking metrics opens `ReactionModal`.

#### FeedPosts/Post/PostModal.jsx
- **Overlay:** Full-screen modal.
- **Features:**
  - `MediaCarousel`: `<MediaCarousel items={postData.media} />`
  - `CommentsContainer`: nested `<Comment />` and `<Reply />` threads.
  - Inline share metrics + activities bar.
  - Close on backdrop click or ESC key.

#### SharePost/SharePost.jsx
- **UI:** Input bar with placeholder "Start a post"; icons for media types.
- **Behavior:** Clicking triggers `TextModal open`.
- **Callback:** `onPostCreated(newPost)` prepends to parent `posts`.

#### SharePost/TextModal.jsx
- **Editor:** `<TextEditor initialText=... initialMedia=... onSubmit={submitPost} />`
- **submitPost:** calls `POST /posts`, returns saved post, closes modal, triggers parent callback.


## GenericComponents

| Component         | Responsibility                                                                                 |
|-||
| ActorHeader.jsx   | Displays avatar, name → user/company route, timestamp via `date-fns`.                            |
| DropdownMenu.jsx  | Accepts `items: { icon, text, onClick }[]`, renders popover list.                                |
| DropdownUsers.jsx | Searchable list of users (tags) via `GET /users?search=`, highlights match.                      |
| ReactionPicker.jsx| On hover over child, shows emoji row; selects reaction → invokes context action.              |
| TextEditor.jsx    | Rich-text + markdown-like tagging; exposes `value` and `onChange` hooks.                         |
| TextViewer.jsx    | Renders stored markup (e.g. `@[userId]`) into links; truncates long text with "…more/less".    |
| reactionIcons.js  | Exports mapping of reaction names → { Icon, color, label } adjusted for dark/light mode.        |


## Data Flow & Lifecycle

```mermaid
flowchart TB
  subgraph FetchSequence
    MF[MainFeed] -->|GET /posts| API[Backend API]
    API -->|posts[]| MF
  end

  subgraph RenderSequence
    MF --> FP[FeedPosts]
    FP --> PC[PostContainer]
    PC --> M[PostCard & PostModal]
  end

  subgraph InteractionSequence
    M -->|like/comment/delete| PC
    PC -->|POST /comments| API
    PC -->|PATCH /posts/:id/reaction| API
    API --> PC
  end
```

1. **Initialization**: `MainFeed` fetches posts.
2. **Render**: Posts list flows through `FeedPosts` → `PostContainer` → `PostCard`.
3. **Interaction**: UI events call `PostContext.actions` → API calls → context updates → UI re-renders only that post.


## Testing & Coverage
- Each component under `src/pages/Feed/` has corresponding Vitest tests in `src/tests/Feed/...` covering:
  - Rendering under various props
  - Interactive behaviors (hover, click)
  - API-mocking via MSW for `axios` calls


## Extension Points
- **Theme Integration**: reactionIcons adapts to dark/light mode on `root` class.
- **Filtering**: `MainFeed` can accept additional filter props (e.g., hashtags).
- **Pagination**: Swap infinite scroll for page-numbered nav via toggling a prop.

