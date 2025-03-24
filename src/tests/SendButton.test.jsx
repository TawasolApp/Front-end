import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SendButton from '../pages/Feed/MainFeed/FeedPosts/PostCard/Activities/SendButton';

// Mock the Material-UI icon
vi.mock('@mui/icons-material/Send', () => ({
  default: ({ sx, className }) => (
    <div data-testid="send-icon" className={className} style={sx}>
      Send Icon
    </div>
  )
}));

describe('SendButton Component', () => {
  it('renders correctly with icon and text', () => {
    render(<SendButton />);
    
    // Check if the icon is rendered
    expect(screen.getByTestId('send-icon')).toBeInTheDocument();
    
    // Check if the text is rendered
    expect(screen.getByText('Send')).toBeInTheDocument();
    
    // Check if they're inside a button element
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toContainElement(screen.getByTestId('send-icon'));
    expect(button).toContainElement(screen.getByText('Send'));
  });
  
  it('has the correct styling classes', () => {
    render(<SendButton />);
    
    const button = screen.getByRole('button');
    
    // Check button styling
    expect(button).toHaveClass('p-2');
    expect(button).toHaveClass('flex');
    expect(button).toHaveClass('items-center');
    expect(button).toHaveClass('justify-center');
    expect(button).toHaveClass('gap-1');
    expect(button).toHaveClass('group');
    expect(button).toHaveClass('hover:bg-buttonIconHover');
    
    // Check icon styling
    const icon = screen.getByTestId('send-icon');
    expect(icon).toHaveClass('text-textActivity');
    expect(icon).toHaveClass('group-hover:text-textActivityHover');
    
    // Check text styling
    const text = screen.getByText('Send').closest('span');
    expect(text).toHaveClass('text-sm');
    expect(text).toHaveClass('font-semibold');
    expect(text).toHaveClass('text-textActivity');
    expect(text).toHaveClass('group-hover:text-textActivityHover');
  });
  
  it('renders with correct icon size', () => {
    render(<SendButton />);
    
    const icon = screen.getByTestId('send-icon');
    // Check if the fontSize style was applied (from sx prop)
    expect(icon.style.fontSize).toBe('16px');
  });
  
  it('maintains accessibility standards', () => {
    render(<SendButton />);
    
    // Button should be accessible by role
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    
    // Text content should be clear and descriptive
    expect(button).toHaveTextContent('Send');
  });
});