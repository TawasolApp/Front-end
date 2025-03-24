import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostContent from '../pages/Feed/MainFeed/FeedPosts/PostCard/Content/PostContent';

// Mock the TextContent component
vi.mock('../pages/Feed/MainFeed/FeedPosts/PostCard/Content/TextContent/TextContent', () => ({
  default: ({ content }) => <div data-testid="text-content">{content}</div>
}));

describe('PostContent Component', () => {
  it('renders TextContent with the provided content', () => {
    const testContent = 'Test post content';
    render(<PostContent content={testContent} />);
    
    // Verify TextContent receives and displays the content
    const textContent = screen.getByTestId('text-content');
    expect(textContent).toBeInTheDocument();
    expect(textContent).toHaveTextContent(testContent);
  });
  
  it('renders TextContent with empty content', () => {
    render(<PostContent content="" />);
    
    // Verify TextContent is rendered even with empty content
    const textContent = screen.getByTestId('text-content');
    expect(textContent).toBeInTheDocument();
    expect(textContent).toHaveTextContent('');
  });
  
  it('handles undefined content gracefully', () => {
    render(<PostContent />);
    
    // Verify TextContent is rendered with undefined content
    const textContent = screen.getByTestId('text-content');
    expect(textContent).toBeInTheDocument();
    expect(textContent).toHaveTextContent('');
  });
  
  it('accepts a media prop (for future implementation)', () => {
    // Even though media isn't used yet, the component accepts it
    // This test ensures we don't break existing code when implementing media
    const testMedia = [{ type: 'image', url: 'test.jpg' }];
    render(<PostContent content="Test content" media={testMedia} />);
    
    // Basic check that component renders at all with the media prop
    expect(screen.getByTestId('text-content')).toBeInTheDocument();
  });
});