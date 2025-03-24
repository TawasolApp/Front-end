import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TextModal from '../pages/Feed/MainFeed/SharePost/TextModal';

// Mock Material-UI components
vi.mock('@mui/icons-material/Public', () => ({
  default: () => <span data-testid="mock-public-icon">Public Icon</span>
}));

vi.mock('@mui/icons-material/People', () => ({
  default: () => <span data-testid="mock-people-icon">People Icon</span>
}));

vi.mock('@mui/material/Avatar', () => ({
  default: ({ src, sx, className }) => (
    <div 
      data-testid="mock-avatar" 
      className={className}
      style={sx}
    >
      <img src={src} alt="avatar" />
    </div>
  )
}));

vi.mock('@mui/icons-material/Close', () => ({
  default: () => <span data-testid="mock-close-icon">Close Icon</span>
}));

// Mock DropdownMenu component with correct path
vi.mock('../pages/Feed/GenericComponents/DropdownMenu', () => ({
  default: ({ children }) => (
    <div data-testid="mock-dropdown-menu">
      {children}
    </div>
  )
}));

describe('TextModal Component', () => {
  const mockProps = {
    currentAuthorName: 'John Doe',
    currentAuthorPicture: 'profile-picture.jpg',
    setIsModalOpen: vi.fn(),
    sharePost: vi.fn(),
    initialText: ''
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with provided props', () => {
    render(<TextModal {...mockProps} />);
    
    // Check for modal backdrop
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByTestId('mock-avatar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-close-icon')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('What do you want to talk about?')).toBeInTheDocument();
    expect(screen.getByText('Post')).toBeInTheDocument();
  });

  it('displays the initial text when provided', () => {
    render(<TextModal {...mockProps} initialText="Initial draft content" />);
    
    const textArea = screen.getByPlaceholderText('What do you want to talk about?');
    expect(textArea.value).toBe('Initial draft content');
  });

  it('updates text state when typing in the textarea', () => {
    render(<TextModal {...mockProps} />);
    
    const textArea = screen.getByPlaceholderText('What do you want to talk about?');
    fireEvent.change(textArea, { target: { value: 'New post content' } });
    
    expect(textArea.value).toBe('New post content');
  });

  it('disables the Post button when text is empty', () => {
    render(<TextModal {...mockProps} />);
    
    const postButton = screen.getByText('Post').closest('button');
    expect(postButton).toBeDisabled();
    expect(postButton).toHaveClass('bg-buttonSubmitDisable');
    expect(postButton).toHaveClass('cursor-not-allowed');
  });

  it('enables the Post button when text is not empty', () => {
    render(<TextModal {...mockProps} />);
    
    const textArea = screen.getByPlaceholderText('What do you want to talk about?');
    fireEvent.change(textArea, { target: { value: 'New post content' } });
    
    const postButton = screen.getByText('Post').closest('button');
    expect(postButton).not.toBeDisabled();
    expect(postButton).toHaveClass('bg-buttonSubmitEnable');
    expect(postButton).not.toHaveClass('cursor-not-allowed');
  });

  it('calls setIsModalOpen when close button is clicked', () => {
    render(<TextModal {...mockProps} />);
    
    const closeButton = screen.getByTestId('mock-close-icon').closest('button');
    fireEvent.click(closeButton);
    
    expect(mockProps.setIsModalOpen).toHaveBeenCalledTimes(1);
  });

  it('calls sharePost with correct arguments when form is submitted', () => {
    render(<TextModal {...mockProps} />);
    
    const textArea = screen.getByPlaceholderText('What do you want to talk about?');
    fireEvent.change(textArea, { target: { value: 'New post content' } });
    
    const form = screen.getByRole('textbox').closest('form');
    fireEvent.submit(form);
    
    expect(mockProps.sharePost).toHaveBeenCalledWith('New post content', 'Public');
    expect(mockProps.setIsModalOpen).toHaveBeenCalledTimes(1);
  });

  it('prevents form submission when text is empty', () => {
    render(<TextModal {...mockProps} />);
    
    const form = screen.getByRole('textbox').closest('form');
    fireEvent.submit(form);
    
    expect(mockProps.sharePost).not.toHaveBeenCalled();
    expect(mockProps.setIsModalOpen).not.toHaveBeenCalled();
  });

  it('shows Public icon by default', () => {
    render(<TextModal {...mockProps} />);
    
    // Get all elements containing "Public" text
    const publicElements = screen.getAllByText(/Public/i);
    
    // Check that at least one element with "Public" text exists
    expect(publicElements.length).toBeGreaterThan(0);
    
    // Check for icons
    expect(screen.getByTestId('mock-public-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-people-icon')).not.toBeInTheDocument();
  });

  it('has the correct default visibility type', () => {
    render(<TextModal {...mockProps} />);
    
    // Submit the form with some content
    const textArea = screen.getByPlaceholderText('What do you want to talk about?');
    fireEvent.change(textArea, { target: { value: 'New post content' } });
    
    const form = screen.getByRole('textbox').closest('form');
    fireEvent.submit(form);
    
    // Verify the sharePost function was called with the correct visibility
    expect(mockProps.sharePost).toHaveBeenCalledWith('New post content', 'Public');
  });
  
  it('resets text state after successful submission', () => {
    const { rerender } = render(<TextModal {...mockProps} />);
    
    // Add some text and submit
    const textArea = screen.getByPlaceholderText('What do you want to talk about?');
    fireEvent.change(textArea, { target: { value: 'New post content' } });
    
    const form = screen.getByRole('textbox').closest('form');
    fireEvent.submit(form);
    
    // Rerender the component (simulating what would happen in the real app)
    rerender(<TextModal {...mockProps} />);
    
    // Check that text field is empty
    const newTextArea = screen.getByPlaceholderText('What do you want to talk about?');
    expect(newTextArea.value).toBe('');
  });
});