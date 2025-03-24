import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostCardHeader from '../pages/Feed/MainFeed/FeedPosts/PostCard/Header/PostCardHeader';

// Mock dependencies
vi.mock('@mui/icons-material/MoreHoriz', () => ({
  default: () => <div data-testid="more-horiz-icon">MoreHorizIcon</div>
}));

vi.mock('../pages/Feed/GenericComponents/ActorHeader', () => ({
  default: ({ authorId, authorName, authorBio, authorPicture, timestamp, visibility }) => (
    <div data-testid="actor-header">
      <span data-testid="author-id">{authorId}</span>
      <span data-testid="author-name">{authorName}</span>
      <span data-testid="author-bio">{authorBio}</span>
      <img data-testid="author-picture" src={authorPicture} alt="Profile" />
      <span data-testid="timestamp">{timestamp}</span>
      <span data-testid="visibility">{visibility}</span>
    </div>
  )
}));

vi.mock('../pages/Feed/GenericComponents/DropdownMenu', () => ({
  default: ({ menuItems, position, children }) => (
    <div data-testid="dropdown-menu" data-position={position}>
      <div data-testid="dropdown-trigger">{children}</div>
      <div data-testid="menu-items">
        {menuItems && menuItems.map((item, index) => (
          <div key={index} data-testid={`menu-item-${index}`}>
            {item.text}
          </div>
        ))}
      </div>
    </div>
  )
}));

describe('PostCardHeader Component', () => {
  const defaultProps = {
    authorId: 'user123',
    authorName: 'Jane Doe',
    authorBio: 'Software Engineer at Tech Inc.',
    authorPicture: 'https://example.com/profile.jpg',
    timestamp: '2023-03-15T12:00:00Z',
    visibility: 'Anyone',
    menuItems: [
      { text: 'Edit post' },
      { text: 'Delete post' },
      { text: 'Report post' }
    ]
  };
  
  it('renders the component with all necessary parts', () => {
    render(<PostCardHeader {...defaultProps} />);
    
    // Check if the ActorHeader is rendered
    expect(screen.getByTestId('actor-header')).toBeInTheDocument();
    
    // Check if the dropdown menu is rendered
    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
    
    // Check if the more options button is rendered with the icon
    expect(screen.getByTestId('more-horiz-icon')).toBeInTheDocument();
  });
  
  it('passes correct props to ActorHeader', () => {
    render(<PostCardHeader {...defaultProps} />);
    
    // Check that all props are correctly passed to ActorHeader
    expect(screen.getByTestId('author-id')).toHaveTextContent(defaultProps.authorId);
    expect(screen.getByTestId('author-name')).toHaveTextContent(defaultProps.authorName);
    expect(screen.getByTestId('author-bio')).toHaveTextContent(defaultProps.authorBio);
    expect(screen.getByTestId('author-picture')).toHaveAttribute('src', defaultProps.authorPicture);
    expect(screen.getByTestId('timestamp')).toHaveTextContent(defaultProps.timestamp);
    expect(screen.getByTestId('visibility')).toHaveTextContent(defaultProps.visibility);
  });
  
  it('passes correct menu items to DropdownMenu', () => {
    render(<PostCardHeader {...defaultProps} />);
    
    // Check if all menu items are rendered
    defaultProps.menuItems.forEach((item, index) => {
      expect(screen.getByTestId(`menu-item-${index}`)).toHaveTextContent(item.text);
    });
    
    // Check if correct position is passed
    expect(screen.getByTestId('dropdown-menu')).toHaveAttribute('data-position', 'right-0');
  });
  
  it('renders with correct structure and styling classes', () => {
    const { container } = render(<PostCardHeader {...defaultProps} />);
    
    // Check the main container has relative positioning
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('relative');
    
    // Check ActorHeader container has correct padding classes
    const actorHeaderContainer = container.querySelector('.pr-16.pl-3.pt-3.mb-2');
    expect(actorHeaderContainer).toBeInTheDocument();
    
    // Check dropdown menu container has correct positioning classes
    const menuContainer = container.querySelector('.absolute.right-3.top-1');
    expect(menuContainer).toBeInTheDocument();
    
    // Check the more options button has correct styling
    const moreButton = container.querySelector('button');
    expect(moreButton).toHaveClass('text-iconBase');
    expect(moreButton).toHaveClass('hover:bg-buttonIconHover');
    expect(moreButton).toHaveClass('rounded-full');
    expect(moreButton).toHaveClass('p-1');
  });
  
  it('handles missing menu items gracefully', () => {
    const propsWithoutMenu = { ...defaultProps, menuItems: undefined };
    render(<PostCardHeader {...propsWithoutMenu} />);
    
    // Component should still render without errors
    expect(screen.getByTestId('actor-header')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
  });
});