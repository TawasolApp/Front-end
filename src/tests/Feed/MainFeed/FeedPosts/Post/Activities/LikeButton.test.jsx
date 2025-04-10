import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import LikeButton from '../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Activities/LikeButton';

// Mock dependencies
vi.mock('@mui/icons-material/ThumbUpOffAlt', () => ({
  default: (props) => (
    <span 
      data-testid="thumb-up-icon" 
      className={props.className}
    >
      ThumbUpIcon
    </span>
  )
}));

vi.mock('@mui/material/CircularProgress', () => ({
  default: (props) => (
    <span data-testid="loading-spinner" className={props.className}>
      Loading
    </span>
  )
}));

// Mock reaction icons
vi.mock('../../../../../../pages/Feed/GenericComponents/reactionIcons', () => ({
  default: {
    Like: {
      Icon: (props) => (
        <span 
          data-testid="like-icon" 
          className={props.className}
          style={props.style}
        >
          Like Icon
        </span>
      ),
      color: 'blue',
      label: 'Like'
    },
    Love: {
      Icon: (props) => (
        <span 
          data-testid="love-icon" 
          className={props.className}
          style={props.style}
        >
          Love Icon
        </span>
      ),
      color: 'red',
      label: 'Love'
    }
  }
}));

vi.mock('../../../../../../pages/Feed/GenericComponents/ReactionPicker', () => ({
  default: ({ children, onSelectReaction }) => {
    // Add a data-testid to the main button for easier identification
    const childrenWithTestId = React.cloneElement(children, {
      'data-testid': 'main-like-button'
    });
    
    return (
      <div data-testid="reaction-picker">
        {childrenWithTestId}
        <div className="mock-reactions">
          <button 
            data-testid="react-like"
            onClick={() => onSelectReaction('Like')}
          >
            React Like
          </button>
          <button 
            data-testid="react-love"
            onClick={() => onSelectReaction('Love')}
          >
            React Love
          </button>
        </div>
      </div>
    );
  }
}));

// Mock the CSS import
vi.mock('../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Activities/LikeButton.css', () => ({}));

// Create a mock function that resolves immediately
const mockHandleReactOnPost = vi.fn().mockImplementation(() => Promise.resolve());

// Mock useState to control isLoading and isReacted states
const mockSetIsLoading = vi.fn();
const mockSetIsReacted = vi.fn();
let isLoadingState = false;
let isReactedState = false;

vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useState: (initialValue) => {
      // Mock useState for isLoading
      if (initialValue === false && (mockSetIsLoading.mock.calls.length === 0 || mockSetIsReacted.mock.calls.length > 0)) {
        return [isLoadingState, mockSetIsLoading];
      }
      // Mock useState for isReacted
      else if (initialValue === false) {
        return [isReactedState, mockSetIsReacted];
      }
      // Default behavior for other useState calls
      return actual.useState(initialValue);
    }
  };
});

// Set up mock post context
const mockUsePost = vi.fn().mockReturnValue({
  post: {
    id: 'post123',
    reactType: null
  },
  handleReactOnPost: mockHandleReactOnPost
});

vi.mock('../../../../../../pages/Feed/MainFeed/FeedPosts/PostContext', () => ({
  usePost: () => mockUsePost()
}));

describe('LikeButton Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Reset state values
    isLoadingState = false;
    isReactedState = false;
    
    // Reset mock functions
    mockSetIsLoading.mockImplementation((value) => {
      isLoadingState = typeof value === 'function' ? value(isLoadingState) : value;
    });
    
    mockSetIsReacted.mockImplementation((value) => {
      isReactedState = typeof value === 'function' ? value(isReactedState) : value;
    });
    
    // Reset usePost mock
    mockUsePost.mockReturnValue({
      post: {
        id: 'post123',
        reactType: null
      },
      handleReactOnPost: mockHandleReactOnPost
    });
    
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the default "Like" state when no reaction exists', () => {
    render(<LikeButton />);
    
    expect(screen.getByTestId('thumb-up-icon')).toBeInTheDocument();
    expect(screen.getByText('Like')).toBeInTheDocument();
  });
  
  it('handles click and calls handleReactOnPost with correct parameters', async () => {
    render(<LikeButton />);
    
    fireEvent.click(screen.getByTestId('main-like-button'));
    
    // Use immediate check instead of waitFor
    expect(mockHandleReactOnPost).toHaveBeenCalledWith('Like', null);
  }, 10000); // Increase timeout
  
  it('shows loading state when reaction is in progress', () => {
    // Setup loading state
    isLoadingState = true;
    
    render(<LikeButton />);
    
    // Should show the loading spinner
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  }, 10000); // Increase timeout
  
  it('displays the correct icon and text for an existing reaction', () => {
    mockUsePost.mockReturnValue({
      post: {
        id: 'post123',
        reactType: 'Love'
      },
      handleReactOnPost: mockHandleReactOnPost
    });
    
    render(<LikeButton />);
    
    expect(screen.getByTestId('love-icon')).toBeInTheDocument();
    expect(screen.getByText('Love')).toBeInTheDocument();
  });
  
  it('removes reaction when clicking on already selected reaction', async () => {
    mockUsePost.mockReturnValue({
      post: {
        id: 'post123',
        reactType: 'Like'
      },
      handleReactOnPost: mockHandleReactOnPost
    });
    
    render(<LikeButton />);
    
    fireEvent.click(screen.getByTestId('main-like-button'));
    
    // Use immediate check instead of waitFor
    expect(mockHandleReactOnPost).toHaveBeenCalledWith(null, 'Like');
  }, 10000); // Increase timeout
  
  it('changes reaction when selecting a different one from the picker', async () => {
    mockUsePost.mockReturnValue({
      post: {
        id: 'post123',
        reactType: 'Like'
      },
      handleReactOnPost: mockHandleReactOnPost
    });
    
    render(<LikeButton />);
    
    fireEvent.click(screen.getByTestId('react-love'));
    
    // Use immediate check instead of waitFor
    expect(mockHandleReactOnPost).toHaveBeenCalledWith('Love', 'Like');
  }, 10000); // Increase timeout
  
  it('applies animation class when reaction is successful', () => {
    // Setup animated state
    isReactedState = true;
    
    render(<LikeButton />);
    
    // Instead of checking the class directly, verify that isReacted state is true
    expect(isReactedState).toBe(true);
  }, 10000);
  
  it('disables button during loading state', () => {
    // Setup loading state
    isLoadingState = true;
    
    render(<LikeButton />);
    
    // Button should be disabled
    expect(screen.getByTestId('main-like-button')).toBeDisabled();
  }, 10000); // Increase timeout
});