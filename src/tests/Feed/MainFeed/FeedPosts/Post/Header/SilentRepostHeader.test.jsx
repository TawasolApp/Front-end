import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SilentRepostHeader from '../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Header/SilentRepostHeader';
import { MemoryRouter } from 'react-router-dom';

// Mock Material-UI Avatar component
vi.mock('@mui/material', () => ({
  Avatar: ({ src, alt, sx }) => (
    <img 
      src={src} 
      alt={alt} 
      data-testid="avatar"
      style={sx}
    />
  )
}));

describe('SilentRepostHeader Component', () => {
  const defaultProps = {
    authorId: 'user123',
    authorPicture: 'https://example.com/profile.jpg',
    authorName: 'John Doe',
  };

  const renderWithRouter = (component) => {
    return render(
      <MemoryRouter>
        {component}
      </MemoryRouter>
    );
  };

  it('renders correctly with all props', () => {
    renderWithRouter(<SilentRepostHeader {...defaultProps} />);
    
    // Check if author name is displayed
    const authorName = screen.getByText(defaultProps.authorName);
    expect(authorName).toBeInTheDocument();
    
    // Check if "reposted this" text is displayed
    const repostText = screen.getByText('reposted this');
    expect(repostText).toBeInTheDocument();
    
    // Check if avatar is rendered with correct props
    const avatar = screen.getByTestId('avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', defaultProps.authorPicture);
    expect(avatar).toHaveAttribute('alt', defaultProps.authorName);
  });

  it('links to the correct user profile', () => {
    renderWithRouter(<SilentRepostHeader {...defaultProps} />);
    
    // Check if the link has the correct href
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/users/${defaultProps.authorId}`);
  });

  it('applies correct styling to components', () => {
    renderWithRouter(<SilentRepostHeader {...defaultProps} />);
    
    // Check container styling
    const container = screen.getByRole('link').parentElement;
    expect(container).toHaveClass('flex');
    expect(container).toHaveClass('items-center');
    expect(container).toHaveClass('bg-cardBackground');
    expect(container).toHaveClass('border-b');
    expect(container).toHaveClass('border-cardBorder');
    
    // Check author name styling
    const authorNameElement = screen.getByText(defaultProps.authorName);
    expect(authorNameElement).toHaveClass('hover:underline');
    expect(authorNameElement).toHaveClass('text-authorName');
    expect(authorNameElement).toHaveClass('font-semibold');
    
    // Check reposted text styling
    const repostedText = screen.getByText('reposted this');
    expect(repostedText).toHaveClass('text-authorBio');
    expect(repostedText).toHaveClass('font-normal');
  });

  it('renders with missing authorPicture', () => {
    const propsWithoutPicture = { 
      ...defaultProps,
      authorPicture: undefined
    };
    
    renderWithRouter(<SilentRepostHeader {...propsWithoutPicture} />);
    
    // Should still render the component with the default avatar
    const avatar = screen.getByTestId('avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).not.toHaveAttribute('src', defaultProps.authorPicture);
  });
});