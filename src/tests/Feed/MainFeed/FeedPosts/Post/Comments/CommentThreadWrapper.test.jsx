import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CommentThreadWrapper from '../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Comments/CommentThreadWrapper';

describe('CommentThreadWrapper Component', () => {
  it('renders children correctly', () => {
    render(
      <CommentThreadWrapper>
        <div data-testid="test-child">Test Content</div>
      </CommentThreadWrapper>
    );
    
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
  
  it('renders with proper padding when hasReplies is false', () => {
    const { container } = render(
      <CommentThreadWrapper>
        <div data-testid="test-child">Test Content</div>
      </CommentThreadWrapper>
    );
    
    // Should have the padding placeholder div
    const paddingElement = container.querySelector('.pl-8');
    expect(paddingElement).toBeInTheDocument();
    
    // Should not have the thread line
    expect(container.querySelector('.w-0\\.5')).not.toBeInTheDocument();
  });
  
  it('renders thread line when hasReplies is true', () => {
    const { container } = render(
      <CommentThreadWrapper hasReplies={true}>
        <div data-testid="test-child">Test Content</div>
      </CommentThreadWrapper>
    );
    
    // Should have the vertical thread line
    const threadLine = container.querySelector('.w-0\\.5.h-full');
    expect(threadLine).toBeInTheDocument();
    
    // Should not have the padding placeholder
    expect(container.querySelector('.pl-8')).not.toBeInTheDocument();
  });
  
  it('renders special L-shaped connector for last reply', () => {
    const { container } = render(
      <CommentThreadWrapper hasReplies={true} isLastReply={true}>
        <div data-testid="test-child">Test Content</div>
      </CommentThreadWrapper>
    );
    
    // Should have the L-shaped connector parts
    const verticalLine = container.querySelector('.h-full.w-0\\.5');
    const horizontalLine = container.querySelector('.h-0\\.5.w-4');
    
    expect(verticalLine).toBeInTheDocument();
    expect(horizontalLine).toBeInTheDocument();
    
    // Check if the horizontal line has the right border radius
    const horizontalLineStyle = horizontalLine.getAttribute('style');
    expect(horizontalLineStyle).toContain('border-bottom-left-radius: 4px;');
  });
  
  it('applies correct layout classes', () => {
    const { container } = render(
      <CommentThreadWrapper>
        <div>Test Content</div>
      </CommentThreadWrapper>
    );
    
    // Check for the main container class structure
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('relative');
    expect(mainContainer).toHaveClass('px-4');
    expect(mainContainer).toHaveClass('flex');
    expect(mainContainer).toHaveClass('w-full');
    
    // Check for the children container
    const childrenContainer = mainContainer.lastChild;
    expect(childrenContainer).toHaveClass('flex-1');
  });
  
  it('uses correct background color for thread lines', () => {
    const { container } = render(
      <CommentThreadWrapper hasReplies={true}>
        <div>Test Content</div>
      </CommentThreadWrapper>
    );
    
    // Check that thread line has the correct background color class
    const threadLine = container.querySelector('.w-0\\.5.h-full');
    expect(threadLine).toHaveClass('bg-mainBackground');
  });
});