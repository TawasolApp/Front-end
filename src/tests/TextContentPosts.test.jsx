import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TextContent from '../pages/Feed/MainFeed/FeedPosts/PostCard/Content/TextContent/TextContent';

describe('TextContent Component', () => {
  it('renders null when content is not provided', () => {
    const { container } = render(<TextContent />);
    expect(container.firstChild).toBeNull();
  });

  it('renders short content without truncation', () => {
    const shortContent = 'This is a short content that does not need truncation.';
    render(<TextContent content={shortContent} />);
    
    expect(screen.getByText(shortContent)).toBeInTheDocument();
    expect(screen.queryByText('...more')).not.toBeInTheDocument();
  });
  
  it('truncates content that exceeds maxLines and shows more button', () => {
    const longContent = 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5';
    render(<TextContent content={longContent} />);
    
    // Only first three lines should be visible
    expect(screen.getByText('Line 1')).toBeInTheDocument();
    expect(screen.getByText('Line 2')).toBeInTheDocument();
    expect(screen.getByText('Line 3')).toBeInTheDocument();
    
    // Fourth and fifth lines should not be visible
    expect(screen.queryByText('Line 4')).not.toBeInTheDocument();
    expect(screen.queryByText('Line 5')).not.toBeInTheDocument();
    
    // "...more" button should be displayed
    expect(screen.getByText('...more')).toBeInTheDocument();
  });
  
  it('truncates content that exceeds maxChars and shows more button', () => {
    // Create a string that's over 200 characters but fits in 3 lines
    const longCharContent = 'A'.repeat(201);
    render(<TextContent content={longCharContent} />);
    
    // Should show truncated content - exactly 200 characters
    expect(screen.getByText('A'.repeat(200))).toBeInTheDocument();
    
    // "...more" button should be displayed
    expect(screen.getByText('...more')).toBeInTheDocument();
  });
  
  it('expands truncated content when "...more" button is clicked', () => {
    const longContent = 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5';
    render(<TextContent content={longContent} />);
    
    // Click the "...more" button
    fireEvent.click(screen.getByText('...more'));
    
    // All lines should now be visible
    expect(screen.getByText('Line 1')).toBeInTheDocument();
    expect(screen.getByText('Line 2')).toBeInTheDocument();
    expect(screen.getByText('Line 3')).toBeInTheDocument();
    expect(screen.getByText('Line 4')).toBeInTheDocument();
    expect(screen.getByText('Line 5')).toBeInTheDocument();
    
    // "...less" button should now be displayed
    expect(screen.getByText('...less')).toBeInTheDocument();
    // "...more" button should be gone
    expect(screen.queryByText('...more')).not.toBeInTheDocument();
  });
  
  it('collapses expanded content when "...less" button is clicked', () => {
    const longContent = 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5';
    render(<TextContent content={longContent} />);
    
    // First expand the content
    fireEvent.click(screen.getByText('...more'));
    
    // Then collapse it again
    fireEvent.click(screen.getByText('...less'));
    
    // Only first three lines should be visible again
    expect(screen.getByText('Line 1')).toBeInTheDocument();
    expect(screen.getByText('Line 2')).toBeInTheDocument();
    expect(screen.getByText('Line 3')).toBeInTheDocument();
    
    // Fourth and fifth lines should not be visible again
    expect(screen.queryByText('Line 4')).not.toBeInTheDocument();
    expect(screen.queryByText('Line 5')).not.toBeInTheDocument();
    
    // "...more" button should be displayed again
    expect(screen.getByText('...more')).toBeInTheDocument();
  });
  
  it('handles complex truncation with mixed line and character limits', () => {
    // Create content with long first and second lines, short third line
    const complexContent = 'A'.repeat(100) + '\n' + 'B'.repeat(80) + '\n' + 'C'.repeat(30) + '\n' + 'D'.repeat(50);
    
    render(<TextContent content={complexContent} />);
    
    // Should show first two lines fully, but truncate the third line
    expect(screen.getByText('A'.repeat(100))).toBeInTheDocument();
    expect(screen.getByText('B'.repeat(80))).toBeInTheDocument();
    
    // Third line should be truncated since total chars would exceed 200
    // With first two lines using 180 chars, only 20 chars remain for third line
    expect(screen.getByText('C'.repeat(20))).toBeInTheDocument();
    
    // Full third line and fourth line should not be visible
    expect(screen.queryByText('C'.repeat(30))).not.toBeInTheDocument();
    expect(screen.queryByText('D'.repeat(50))).not.toBeInTheDocument();
    
    // "...more" button should be displayed
    expect(screen.getByText('...more')).toBeInTheDocument();
    
    // Click more to see full content
    fireEvent.click(screen.getByText('...more'));
    
    // Now all content should be visible
    expect(screen.getByText('A'.repeat(100))).toBeInTheDocument();
    expect(screen.getByText('B'.repeat(80))).toBeInTheDocument();
    expect(screen.getByText('C'.repeat(30))).toBeInTheDocument();
    expect(screen.getByText('D'.repeat(50))).toBeInTheDocument();
  });
  
  it('handles empty lines correctly', () => {
    const contentWithEmptyLines = 'Line 1\n\nLine 3';
    const { container } = render(<TextContent content={contentWithEmptyLines} />);
    
    // Check for the text content
    expect(screen.getByText('Line 1')).toBeInTheDocument();
    expect(screen.getByText('Line 3')).toBeInTheDocument();
    
    // For empty lines, we need to check the rendered HTML structure
    // There should be 3 div elements (one for each line including the empty one)
    const contentDivs = container.querySelectorAll('.text-textContent');
    expect(contentDivs.length).toBe(3);
    
    // Check that the middle div represents an empty line
    // Since the non-breaking space is rendered with a React fragment,
    // we'll check if the div has any content but no visible text
    const emptyLineDiv = contentDivs[1];
    expect(emptyLineDiv.textContent).toBeTruthy(); // Has some content
    expect(emptyLineDiv.textContent.trim()).not.toBe('Line 1');
    expect(emptyLineDiv.textContent.trim()).not.toBe('Line 3');
    
    // Alternative approach: directly check the innerHTML
    // This is more implementation-specific but can help debug the issue
    expect(emptyLineDiv.innerHTML).toContain('&nbsp;');
  });
  
  it('handles single line edge case', () => {
    // A single long line that exceeds maxChars
    const singleLongLine = 'X'.repeat(250);
    render(<TextContent content={singleLongLine} />);
    
    // Should display 200 characters with ...more button
    expect(screen.getByText('X'.repeat(200))).toBeInTheDocument();
    expect(screen.getByText('...more')).toBeInTheDocument();
    
    // After expanding
    fireEvent.click(screen.getByText('...more'));
    expect(screen.getByText('X'.repeat(250))).toBeInTheDocument();
  });
});