import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import LeftSideBar from '../../../pages/Feed/LeftSideBar/LeftSideBar';

// Mock the Redux state
const mockStore = {
  getState: () => ({
    authentication: {
      firstName: 'John',
      lastName: 'Doe',
      profilePicture: 'profile-picture.jpg',
      bio: 'Software Engineer',
      coverPhoto: 'cover-photo.jpg'
    }
  }),
  subscribe: vi.fn(),
  dispatch: vi.fn(),
};

// Mock material-ui icons
vi.mock('@mui/icons-material/Bookmark', () => ({
  default: () => <span data-testid="bookmark-icon">BookmarkIcon</span>
}));

vi.mock('@mui/icons-material/Work', () => ({
  default: () => <span data-testid="work-icon">WorkIcon</span>
}));

vi.mock('@mui/icons-material/KeyboardArrowDown', () => ({
  default: () => <span data-testid="arrow-down-icon">KeyboardArrowDownIcon</span>
}));

vi.mock('@mui/icons-material/KeyboardArrowUp', () => ({
  default: () => <span data-testid="arrow-up-icon">KeyboardArrowUpIcon</span>
}));

vi.mock('@mui/material', () => ({
  Avatar: ({ src, alt, className }) => (
    <div 
      data-testid="avatar" 
      data-src={src} 
      data-alt={alt}
      className={className}
    >
      Avatar
    </div>
  )
}));

// Mock resize event
const mockResizeEvent = (width) => {
  window.innerWidth = width;
  window.dispatchEvent(new Event('resize'));
};

// Wrapper component for providing router and store context
const renderWithProviders = (ui) => {
  return render(
    <Provider store={mockStore}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

describe('LeftSideBar', () => {
  beforeEach(() => {
    // Reset window width to desktop size by default before each test
    window.innerWidth = 1024;
  });

  it('renders the user profile information correctly', () => {
    renderWithProviders(<LeftSideBar />);
    
    // Check user name is displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    
    // Check bio is displayed
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    
    // Check avatar is displayed with correct attributes
    const avatar = screen.getByTestId('avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar.dataset.src).toBe('profile-picture.jpg');
    expect(avatar.dataset.alt).toBe('John Doe');
  });

  it('renders the cover photo with correct background image', () => {
    const { container } = renderWithProviders(<LeftSideBar />);
    
    const coverPhoto = container.querySelector('.h-20.bg-cover');
    expect(coverPhoto).toBeInTheDocument();
    expect(coverPhoto.style.backgroundImage).toBe('url(cover-photo.jpg)');
  });

  it('renders the Premium and Saved items options in desktop view', () => {
    renderWithProviders(<LeftSideBar />);
    
    expect(screen.getByText('Try Premium for EGP0')).toBeInTheDocument();
    expect(screen.getByText('Saved items')).toBeInTheDocument();
    expect(screen.getByTestId('bookmark-icon')).toBeInTheDocument();
    expect(screen.getByTestId('work-icon')).toBeInTheDocument();
  });

  it('hides the additional options and shows "Show more" button in mobile view', () => {
    // Set window width to mobile size
    mockResizeEvent(500);
    
    const { container } = renderWithProviders(<LeftSideBar />);
    
    // Check that the container for Premium and Saved items has the 'hidden' class
    const optionsContainer = container.querySelector('.py-2');
    expect(optionsContainer).toHaveClass('hidden');
    
    // Show more button should be visible
    expect(screen.getByText('Show more')).toBeInTheDocument();
    expect(screen.getByTestId('arrow-down-icon')).toBeInTheDocument();
  });

  it('toggles additional options when "Show more" is clicked in mobile view', () => {
    // Set window width to mobile size
    mockResizeEvent(500);
    
    const { container } = renderWithProviders(<LeftSideBar />);
    
    // Initially has hidden class
    const optionsContainer = container.querySelector('.py-2');
    expect(optionsContainer).toHaveClass('hidden');
    
    // Click Show more
    fireEvent.click(screen.getByText('Show more'));
    
    // After clicking, hidden class should be removed and block class should be present
    expect(optionsContainer).not.toHaveClass('hidden');
    expect(optionsContainer).toHaveClass('block');
    
    // Button text should change
    expect(screen.getByText('Show less')).toBeInTheDocument();
    expect(screen.getByTestId('arrow-up-icon')).toBeInTheDocument();
    
    // Click Show less
    fireEvent.click(screen.getByText('Show less'));
    
    // Hidden class should be back
    expect(optionsContainer).toHaveClass('hidden');
  });

  it('contains a link to saved posts', () => {
    const { container } = renderWithProviders(<LeftSideBar />);
    
    const savedPostsLink = container.querySelector('a[href="/my-items/saved-posts"]');
    expect(savedPostsLink).toBeInTheDocument();
    expect(savedPostsLink.textContent).toContain('Saved items');
  });
});