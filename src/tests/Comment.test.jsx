import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Comment from '../pages/Feed/MainFeed/FeedPosts/PostCard/Comments/Comment';

// Mock dependencies - IMPORTANT: These vi.mock calls are hoisted to the top of the file
// so any variables they reference must be defined within the factory function

// Mock axios with a factory function that returns the mock implementation
vi.mock('../apis/axios', () => {
  const mockAxios = {
    axiosInstance: {
      post: vi.fn().mockResolvedValue({}),
      patch: vi.fn().mockResolvedValue({})
    }
  };
  return mockAxios;
});

// Import the mock so we can make assertions on it
import { axiosInstance } from '../apis/axios';

// Mock icons
vi.mock('@mui/icons-material/MoreHoriz', () => ({
  default: () => <div data-testid="more-icon">MoreHorizIcon</div>
}));

vi.mock('@mui/icons-material/Flag', () => ({
  default: () => <div data-testid="flag-icon">FlagIcon</div>
}));

vi.mock('@mui/icons-material/Edit', () => ({
  default: () => <div data-testid="edit-icon">EditIcon</div>
}));

vi.mock('@mui/icons-material/Delete', () => ({
  default: () => <div data-testid="delete-icon">DeleteIcon</div>
}));

// Mock utils
vi.mock('../utils', () => ({
  formatDate: (date) => 'Formatted Date'
}));

// Mock child components
vi.mock('../pages/Feed/GenericComponents/ActorHeader', () => ({
  default: ({ authorName, authorBio, authorPicture }) => (
    <div data-testid="actor-header">
      <span data-testid="author-name">{authorName}</span>
      <span data-testid="author-bio">{authorBio}</span>
      <img data-testid="author-picture" src={authorPicture} alt="Profile" />
    </div>
  )
}));

vi.mock('../pages/Feed/GenericComponents/DropdownMenu', () => ({
  default: ({ children, menuItems, position }) => (
    <div data-testid="dropdown-menu" data-position={position}>
      {children}
      <div data-testid="menu-items">
        {menuItems.map((item, index) => (
          <button 
            key={index} 
            data-testid={`menu-item-${index}`}
            onClick={item.onClick}
          >
            {item.text}
            {item.icon && <item.icon />}
          </button>
        ))}
      </div>
    </div>
  )
}));

vi.mock('../pages/Feed/MainFeed/FeedPosts/PostCard/Comments/ActivitiesHolder', () => ({
  default: ({ initReactValue, reactions, onReactionChange, setShowReactions, replies }) => (
    <div data-testid="activities-holder">
      <button 
        data-testid="reaction-button" 
        onClick={() => onReactionChange('like', null)}
      >
        React
      </button>
      <button 
        data-testid="show-reactions-button" 
        onClick={setShowReactions}
      >
        Show Reactions
      </button>
      <span data-testid="replies-count">{replies}</span>
    </div>
  )
}));

vi.mock('../pages/Feed/MainFeed/FeedPosts/PostCard/Comments/CommentThreadWrapper', () => ({
  default: ({ children }) => <div data-testid="comment-thread-wrapper">{children}</div>
}));

vi.mock('../pages/Feed/MainFeed/FeedPosts/ReactionModal/ReactionsModal', () => ({
  default: ({ APIURL, setShowLikes }) => (
    <div data-testid="reactions-modal" data-api-url={APIURL}>
      <button data-testid="close-reactions" onClick={setShowLikes}>Close</button>
    </div>
  )
}));

vi.mock('../pages/Feed/MainFeed/FeedPosts/PostCard/Comments/AddForm', () => ({
  default: ({ handleAddFunction, initialText, close, type }) => (
    <div data-testid="add-form" data-type={type}>
      <textarea 
        data-testid="edit-textarea" 
        defaultValue={initialText}
      ></textarea>
      <button 
        data-testid="submit-edit" 
        onClick={() => handleAddFunction('Edited comment text')}
      >
        Submit
      </button>
      <button 
        data-testid="cancel-edit" 
        onClick={close}
      >
        Cancel
      </button>
    </div>
  )
}));

describe('Comment Component', () => {
  const mockHandleDeleteComment = vi.fn();
  
  // Sample comment data
  const ownComment = {
    id: '123',
    content: 'This is a test comment',
    authorId: 'mohsobh', // Same as currentAuthorId in component
    authorName: 'Mohamed Sobh',
    authorBio: 'Test Bio',
    authorPicture: 'test-pic-url',
    timestamp: '2023-01-01T12:00:00Z',
    reactType: null,
    reactions: {
      like: 5,
      celebrate: 2,
      support: 1
    },
    replies: ['reply1', 'reply2']
  };
  
  const otherUserComment = {
    ...ownComment,
    authorId: 'otheruser', // Different from currentAuthorId
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders the comment correctly in view mode', () => {
    render(
      <Comment 
        comment={ownComment} 
        handleDeleteComment={mockHandleDeleteComment}
      />
    );
    
    // Check if the comment content is rendered
    expect(screen.getByText('This is a test comment')).toBeInTheDocument();
    
    // Check if actor header is rendered with correct props
    expect(screen.getByTestId('actor-header')).toBeInTheDocument();
    expect(screen.getByTestId('author-name')).toHaveTextContent('Mohamed Sobh');
    
    // Check if the timestamp is rendered
    expect(screen.getByText('Formatted Date')).toBeInTheDocument();
    
    // Check if activities holder is rendered
    expect(screen.getByTestId('activities-holder')).toBeInTheDocument();
    
    // Check if more options button is rendered
    expect(screen.getByTestId('more-icon')).toBeInTheDocument();
  });
  
  it('shows all menu options for own comments', () => {
    render(
      <Comment 
        comment={ownComment} 
        handleDeleteComment={mockHandleDeleteComment}
      />
    );
    
    // Check for menu items
    expect(screen.getByTestId('menu-item-0')).toHaveTextContent('Report post');
    expect(screen.getByTestId('menu-item-1')).toHaveTextContent('Edit comment');
    expect(screen.getByTestId('menu-item-2')).toHaveTextContent('Delete comment');
    
    // Total of 3 menu items
    expect(screen.getAllByTestId(/menu-item-\d+/).length).toBe(3);
  });
  
  it('shows only report option for other users\' comments', () => {
    render(
      <Comment 
        comment={otherUserComment} 
        handleDeleteComment={mockHandleDeleteComment}
      />
    );
    
    // Check for menu items
    expect(screen.getByTestId('menu-item-0')).toHaveTextContent('Report post');
    
    // Only 1 menu item
    expect(screen.getAllByTestId(/menu-item-\d+/).length).toBe(1);
    expect(screen.queryByText('Edit comment')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete comment')).not.toBeInTheDocument();
  });
  
  it('switches to edit mode when Edit comment is clicked', async () => {
    render(
      <Comment 
        comment={ownComment} 
        handleDeleteComment={mockHandleDeleteComment}
      />
    );
    
    // Click on the Edit comment menu item
    fireEvent.click(screen.getByTestId('menu-item-1'));
    
    // Check if edit form is shown
    await waitFor(() => {
      expect(screen.getByTestId('add-form')).toBeInTheDocument();
      expect(screen.getByTestId('edit-textarea')).toBeInTheDocument();
    });
  });
  
  it('submits edited comment correctly', async () => {
    render(
      <Comment 
        comment={ownComment} 
        handleDeleteComment={mockHandleDeleteComment}
      />
    );
    
    // Click on the Edit comment menu item
    fireEvent.click(screen.getByTestId('menu-item-1'));
    
    // Submit the edited comment
    fireEvent.click(screen.getByTestId('submit-edit'));
    
    // Check if axios patch was called correctly
    await waitFor(() => {
      expect(axiosInstance.patch).toHaveBeenCalledWith('/posts/comments/123', {
        content: 'Edited comment text',
        tagged: []
      });
    });
    
    // Check if the component switched back to view mode
    await waitFor(() => {
      expect(screen.queryByTestId('add-form')).not.toBeInTheDocument();
      expect(screen.getByText('Edited comment text')).toBeInTheDocument();
    });
  });
  
  it('cancels edit mode correctly', async () => {
    render(
      <Comment 
        comment={ownComment} 
        handleDeleteComment={mockHandleDeleteComment}
      />
    );
    
    // Click on the Edit comment menu item
    fireEvent.click(screen.getByTestId('menu-item-1'));
    
    // Cancel editing
    fireEvent.click(screen.getByTestId('cancel-edit'));
    
    // Check if the component switched back to view mode with original content
    await waitFor(() => {
      expect(screen.queryByTestId('add-form')).not.toBeInTheDocument();
      expect(screen.getByText('This is a test comment')).toBeInTheDocument();
    });
  });
  
  it('handles delete comment correctly', () => {
    render(
      <Comment 
        comment={ownComment} 
        handleDeleteComment={mockHandleDeleteComment}
      />
    );
    
    // Click on the Delete comment menu item
    fireEvent.click(screen.getByTestId('menu-item-2'));
    
    // Check if handleDeleteComment was called with the correct ID
    expect(mockHandleDeleteComment).toHaveBeenCalledWith('123');
  });
  
  it('handles reactions correctly', async () => {
    render(
      <Comment 
        comment={ownComment} 
        handleDeleteComment={mockHandleDeleteComment}
      />
    );
    
    // Click on the reaction button
    fireEvent.click(screen.getByTestId('reaction-button'));
    
    // Check if axios post was called correctly
    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith('posts/react/123', {
        reactions: { like: 1 },
        postType: "Comment"
      });
    });
  });
  
  it('shows reactions modal when reactions count is clicked', async () => {
    render(
      <Comment 
        comment={ownComment} 
        handleDeleteComment={mockHandleDeleteComment}
      />
    );
    
    // Initially, reactions modal should not be visible
    expect(screen.queryByTestId('reactions-modal')).not.toBeInTheDocument();
    
    // Click on the show reactions button
    fireEvent.click(screen.getByTestId('show-reactions-button'));
    
    // Check if reactions modal is shown with correct API URL
    await waitFor(() => {
      expect(screen.getByTestId('reactions-modal')).toBeInTheDocument();
      expect(screen.getByTestId('reactions-modal')).toHaveAttribute('data-api-url', '/posts/reactions/123');
    });
    
    // Close reactions modal
    fireEvent.click(screen.getByTestId('close-reactions'));
    
    // Check if reactions modal is closed
    await waitFor(() => {
      expect(screen.queryByTestId('reactions-modal')).not.toBeInTheDocument();
    });
  });
  
  it('displays the correct number of replies', () => {
    render(
      <Comment 
        comment={ownComment} 
        handleDeleteComment={mockHandleDeleteComment}
      />
    );
    
    // Check if the replies count is correct
    expect(screen.getByTestId('replies-count')).toHaveTextContent('2');
  });
});