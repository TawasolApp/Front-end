import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ActorHeader from '../../../pages/Feed/GenericComponents/ActorHeader';

// Mock dependencies
vi.mock('@mui/material', () => ({
  Avatar: (props) => (
    <img
      data-testid="avatar"
      src={props.src}
      alt="Avatar"
      style={props.sx}
      className={props.className}
    />
  )
}));

vi.mock('@mui/icons-material/Public', () => ({
  default: (props) => (
    <span 
      data-testid="public-icon" 
      className={props.className}
      style={props.sx}
    >
      PublicIcon
    </span>
  )
}));

vi.mock('@mui/icons-material/People', () => ({
  default: (props) => (
    <span 
      data-testid="people-icon" 
      className={props.className}
      style={props.sx}
    >
      PeopleIcon
    </span>
  )
}));

vi.mock('../../../utils', () => ({
  formatDate: (date) => 'Formatted date'
}));

// Helper to render with Router
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('ActorHeader Component', () => {
  const defaultProps = {
    authorId: 'user123',
    authorName: 'John Doe',
    authorBio: 'Software Engineer at Tech Company',
    authorPicture: '/john-doe.jpg',
    timestamp: '2023-04-10T12:00:00Z',
    visibility: 'Public',
  };

  it('renders user information correctly', () => {
    renderWithRouter(<ActorHeader {...defaultProps} />);
    
    // Check author name and bio
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer at Tech Company')).toBeInTheDocument();
    
    // Check avatar
    const avatar = screen.getByTestId('avatar');
    expect(avatar).toHaveAttribute('src', '/john-doe.jpg');
    
    // Check the timestamp
    expect(screen.getByText(/Formatted date/)).toBeInTheDocument();
    
    // Check for public icon
    expect(screen.getByTestId('public-icon')).toBeInTheDocument();
  });

  it('truncates author bio when it exceeds 47 characters', () => {
    const longBioProps = {
      ...defaultProps,
      authorBio: 'This is a very long author bio that should be truncated because it exceeds 47 characters limit'
    };
    
    renderWithRouter(<ActorHeader {...longBioProps} />);
    
    // The bio should be truncated - use regex to match the actual truncated text
    expect(screen.getByText(/This is a very long author bio that should be t\.\.\./)).toBeInTheDocument();
  });

  it('renders text without links when enableLink is false', () => {
    renderWithRouter(<ActorHeader {...defaultProps} enableLink={false} />);
    
    // Check that the name exists but is not inside a link
    const authorName = screen.getByText('John Doe');
    expect(authorName.closest('a')).toBeNull();
    
    // Check that the avatar is still inside a link (this is the expected behavior)
    const avatar = screen.getByTestId('avatar');
    expect(avatar.closest('a')).not.toBeNull();
  });

  it('shows private visibility icon when visibility is not Public', () => {
    renderWithRouter(<ActorHeader {...defaultProps} visibility="Connections" />);
    
    // Check for people icon
    expect(screen.getByTestId('people-icon')).toBeInTheDocument();
    // Public icon should not be present
    expect(screen.queryByTestId('public-icon')).not.toBeInTheDocument();
  });

  it('shows edited indicator when isEdited is true', () => {
    renderWithRouter(<ActorHeader {...defaultProps} isEdited={true} />);
    
    // Check for edited text
    expect(screen.getByText('• Edited')).toBeInTheDocument();
  });

  it('does not show timestamp section when timestamp is not provided', () => {
    const propsWithoutTimestamp = { ...defaultProps };
    delete propsWithoutTimestamp.timestamp;
    
    renderWithRouter(<ActorHeader {...propsWithoutTimestamp} />);
    
    // Timestamp section should not be rendered
    expect(screen.queryByText(/Formatted date/)).not.toBeInTheDocument();
    expect(screen.queryByTestId('public-icon')).not.toBeInTheDocument();
  });

  it('renders square avatar for Company type', () => {
    renderWithRouter(<ActorHeader {...defaultProps} authorType="Company" />);
    
    // Check that the avatar has square border radius
    const avatar = screen.getByTestId('avatar');
    expect(avatar.style.borderRadius).toBe('0px');
  });

  it('creates correct user link path', () => {
    renderWithRouter(<ActorHeader {...defaultProps} />);
    
    // Get the author name link
    const authorNameLink = screen.getByText('John Doe').closest('a');
    expect(authorNameLink).toHaveAttribute('href', '/users/user123');
  });

  it('creates correct company link path', () => {
    renderWithRouter(<ActorHeader {...defaultProps} authorType="Company" />);
    
    // Get the author name link
    const authorNameLink = screen.getByText('John Doe').closest('a');
    expect(authorNameLink).toHaveAttribute('href', '/company/user123');
  });

  it('applies custom icon size', () => {
    renderWithRouter(<ActorHeader {...defaultProps} iconSize={64} />);
    
    // Check avatar dimensions
    const avatar = screen.getByTestId('avatar');
    expect(avatar.style.width).toBe('64px');
    expect(avatar.style.height).toBe('64px');
  });
});