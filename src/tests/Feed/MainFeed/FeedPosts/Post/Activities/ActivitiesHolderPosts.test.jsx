import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import ActivitiesHolder from '../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Activities/ActivitiesHolder';

// Mock the button components
vi.mock('../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Activities/LikeButton', () => ({
  default: () => <button data-testid="like-button">Like</button>
}));

vi.mock('../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Activities/CommentButton', () => ({
  default: ({ setShowComments }) => (
    <button 
      data-testid="comment-button" 
      onClick={() => setShowComments && setShowComments(true)}
    >
      Comment
    </button>
  )
}));

vi.mock('../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Activities/RepostButton', () => ({
  default: () => <button data-testid="repost-button">Repost</button>
}));

vi.mock('../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Activities/SendButton', () => ({
  default: () => <button data-testid="send-button">Send</button>
}));

describe('ActivitiesHolder Component', () => {
  it('renders all four buttons', () => {
    render(<ActivitiesHolder />);
    
    expect(screen.getByTestId('like-button')).toBeInTheDocument();
    expect(screen.getByTestId('comment-button')).toBeInTheDocument();
    expect(screen.getByTestId('repost-button')).toBeInTheDocument();
    expect(screen.getByTestId('send-button')).toBeInTheDocument();
  });
  
  it('calls setShowComments when comment button is clicked', () => {
    const mockSetShowComments = vi.fn();
    render(<ActivitiesHolder setShowComments={mockSetShowComments} />);
    
    fireEvent.click(screen.getByTestId('comment-button'));
    
    expect(mockSetShowComments).toHaveBeenCalledTimes(1);
    expect(mockSetShowComments).toHaveBeenCalledWith(true);
  });
  
  it('renders with proper grid layout', () => {
    const { container } = render(<ActivitiesHolder />);
    
    // Check for grid layout classes
    const gridContainer = container.firstChild;
    expect(gridContainer).toHaveClass('grid');
    expect(gridContainer).toHaveClass('grid-cols-4');
    expect(gridContainer).toHaveClass('gap-0');
    expect(gridContainer).toHaveClass('px-4');
    expect(gridContainer).toHaveClass('py-1');
  });
  
  it('handles missing setShowComments prop gracefully', () => {
    // This shouldn't throw an error even without the setShowComments prop
    const { getByTestId } = render(<ActivitiesHolder />);
    
    // Clicking should not cause an error
    expect(() => {
      fireEvent.click(getByTestId('comment-button'));
    }).not.toThrow();
  });
  
  it('maintains proper button order', () => {
    render(<ActivitiesHolder />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);
    
    // Verify order: Like, Comment, Repost, Send
    expect(buttons[0]).toHaveTextContent('Like');
    expect(buttons[1]).toHaveTextContent('Comment');
    expect(buttons[2]).toHaveTextContent('Repost');
    expect(buttons[3]).toHaveTextContent('Send');
  });
});