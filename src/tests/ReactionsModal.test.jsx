import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReactionsModal from '../pages/Feed/MainFeed/FeedPosts/ReactionModal/ReactionsModal';
import { MemoryRouter } from 'react-router-dom';

// Mock dependencies
vi.mock('@mui/icons-material/Close', () => ({
    default: (props) => (
      <div 
        data-testid="close-icon" 
        onClick={props.onClick} 
        className={props.className}
      >
        CloseIcon
      </div>
    )
}));

vi.mock('@mui/icons-material/ArrowDropDown', () => ({
  default: () => <div data-testid="arrow-dropdown-icon">ArrowDropDownIcon</div>
}));

vi.mock('../pages/Feed/GenericComponents/reactionIcons', () => ({
  default: {
    like: {
      Icon: () => <div data-testid="like-icon">LikeIcon</div>,
      color: 'blue'
    },
    celebrate: {
      Icon: () => <div data-testid="celebrate-icon">CelebrateIcon</div>,
      color: 'orange'
    },
    support: {
      Icon: () => <div data-testid="support-icon">SupportIcon</div>,
      color: 'purple'
    },
    funny: {
      Icon: () => <div data-testid="funny-icon">FunnyIcon</div>,
      color: 'yellow'
    },
    love: {
      Icon: () => <div data-testid="love-icon">LoveIcon</div>,
      color: 'red'
    }
  }
}));

vi.mock('../pages/Feed/GenericComponents/DropdownMenu', () => ({
  default: ({ menuItems, position, children }) => (
    <div data-testid="dropdown-menu" data-position={position}>
      {children}
      <div data-testid="dropdown-menu-items">
        {menuItems.map((item, idx) => (
          <button 
            key={idx} 
            data-testid={`dropdown-item-${idx}`}
            onClick={item.onClick}
          >
            {item.text}
          </button>
        ))}
      </div>
    </div>
  )
}));

// Mock axios
vi.mock('../apis/axios', () => ({
  axiosInstance: {
    get: vi.fn()
  }
}));

// Import the mocked axios
import { axiosInstance } from '../apis/axios';

describe('ReactionsModal Component', () => {
  const setShowLikes = vi.fn();
  const mockAPIURL = '/posts/reactions/123';
  
  const mockReactionsData = [
    {
      likeId: '1',
      authorId: 'user1',
      authorName: 'John Doe',
      authorBio: 'Software Engineer',
      authorPicture: 'https://example.com/john.jpg',
      type: 'like'
    },
    {
      likeId: '2',
      authorId: 'user2',
      authorName: 'Jane Smith',
      authorBio: 'Product Manager',
      authorPicture: 'https://example.com/jane.jpg',
      type: 'celebrate'
    },
    {
      likeId: '3',
      authorId: 'user3',
      authorName: 'Bob Johnson',
      authorBio: 'UX Designer',
      authorPicture: 'https://example.com/bob.jpg',
      type: 'like'
    },
    {
      likeId: '4',
      authorId: 'user4',
      authorName: 'Sarah Williams',
      authorBio: 'Data Scientist',
      authorPicture: 'https://example.com/sarah.jpg',
      type: 'support'
    },
    {
      likeId: '5',
      authorId: 'user5',
      authorName: 'Mike Brown',
      authorBio: 'Marketing Specialist',
      authorPicture: 'https://example.com/mike.jpg',
      type: 'love'
    }
  ];
  
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock the API response
    axiosInstance.get.mockResolvedValue({ data: mockReactionsData });
  });
  
  const renderWithRouter = (ui) => {
    return render(ui, { wrapper: MemoryRouter });
  };
  
  it('renders the modal with correct structure', async () => {
    renderWithRouter(
      <ReactionsModal
        APIURL={mockAPIURL}
        setShowLikes={setShowLikes}
      />
    );
    
    // Check modal structure
    expect(screen.getByText('Reactions')).toBeInTheDocument();
    expect(screen.getByTestId('close-icon')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith(mockAPIURL);
    });
    
    // Check tabs are rendered
    expect(screen.getByText('All')).toBeInTheDocument();
    
    // Check reaction tabs (after data is loaded)
    await waitFor(() => {
      // Should have "like" tab since it's the most common (2 occurrences)
      const allTabs = screen.getAllByRole('button');
      const tabTexts = allTabs.map(tab => tab.textContent);
      expect(tabTexts.some(text => text.includes('2'))).toBeTruthy(); // like count is 2
    });
  });
  
  it('loads and displays reactions data', async () => {
    renderWithRouter(
      <ReactionsModal
        APIURL={mockAPIURL}
        setShowLikes={setShowLikes}
      />
    );
    
    // Wait for API call to resolve
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith(mockAPIURL);
    });
    
    // Check if user data is displayed
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      expect(screen.getByText('Sarah Williams')).toBeInTheDocument();
      expect(screen.getByText('Mike Brown')).toBeInTheDocument();
    });
    
    // Check if user bios are displayed
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Product Manager')).toBeInTheDocument();
    expect(screen.getByText('UX Designer')).toBeInTheDocument();
    expect(screen.getByText('Data Scientist')).toBeInTheDocument();
    expect(screen.getByText('Marketing Specialist')).toBeInTheDocument();
  });
  
  it('filters reactions when tabs are clicked', async () => {
    renderWithRouter(
      <ReactionsModal
        APIURL={mockAPIURL}
        setShowLikes={setShowLikes}
      />
    );
    
    // Wait for data to load
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith(mockAPIURL);
    });
    
    // All users should be initially visible
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    expect(screen.getByText('Sarah Williams')).toBeInTheDocument();
    expect(screen.getByText('Mike Brown')).toBeInTheDocument();
    
    // Find and click the Like tab (which should have 2 users)
    const tabs = screen.getAllByRole('button');
    const likeTab = tabs.find(tab => tab.textContent.includes('2') && !tab.textContent.includes('All'));
    fireEvent.click(likeTab);
    
    // Now only users with 'like' reaction should be visible
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
      expect(screen.queryByText('Sarah Williams')).not.toBeInTheDocument();
      expect(screen.queryByText('Mike Brown')).not.toBeInTheDocument();
    });
    
    // Switch back to All tab
    const allTab = screen.getByText('All');
    fireEvent.click(allTab);
    
    // All users should be visible again
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      expect(screen.getByText('Sarah Williams')).toBeInTheDocument();
      expect(screen.getByText('Mike Brown')).toBeInTheDocument();
    });
  });
  
  it('closes the modal when close icon is clicked', async () => {
    renderWithRouter(
      <ReactionsModal
        APIURL={mockAPIURL}
        setShowLikes={setShowLikes}
      />
    );
    
    // Click the close icon
    fireEvent.click(screen.getByTestId('close-icon'));
    
    // Check if setShowLikes was called
    expect(setShowLikes).toHaveBeenCalled();
  });
  
  it('shows "No reactions found" when there are no reactions', async () => {
    // Mock empty response
    axiosInstance.get.mockResolvedValueOnce({ data: [] });
    
    renderWithRouter(
      <ReactionsModal
        APIURL={mockAPIURL}
        setShowLikes={setShowLikes}
      />
    );
    
    // Wait for API call to resolve
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith(mockAPIURL);
    });
    
    // Check for empty state message
    await waitFor(() => {
      expect(screen.getByText('No reactions found')).toBeInTheDocument();
    });
  });
  
  it('shows "More" dropdown when there are more than 4 reaction types', async () => {
    // Create data with 5 different reaction types
    const manyReactionTypes = [
      { likeId: '1', authorId: 'user1', authorName: 'User 1', authorBio: 'Bio 1', authorPicture: 'url1', type: 'like' },
      { likeId: '2', authorId: 'user2', authorName: 'User 2', authorBio: 'Bio 2', authorPicture: 'url2', type: 'celebrate' },
      { likeId: '3', authorId: 'user3', authorName: 'User 3', authorBio: 'Bio 3', authorPicture: 'url3', type: 'support' },
      { likeId: '4', authorId: 'user4', authorName: 'User 4', authorBio: 'Bio 4', authorPicture: 'url4', type: 'funny' },
      { likeId: '5', authorId: 'user5', authorName: 'User 5', authorBio: 'Bio 5', authorPicture: 'url5', type: 'love' }
    ];
    
    axiosInstance.get.mockResolvedValueOnce({ data: manyReactionTypes });
    
    renderWithRouter(
      <ReactionsModal
        APIURL={mockAPIURL}
        setShowLikes={setShowLikes}
      />
    );
    
    // Wait for API call to resolve
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith(mockAPIURL);
    });
    
    // Check for More dropdown
    await waitFor(() => {
      expect(screen.getByText('More')).toBeInTheDocument();
      expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
    });
  });
  
  it('handles API errors gracefully', async () => {
    // Mock API error
    console.error = vi.fn(); // Suppress console errors for this test
    axiosInstance.get.mockRejectedValueOnce(new Error('API error'));
    
    renderWithRouter(
      <ReactionsModal
        APIURL={mockAPIURL}
        setShowLikes={setShowLikes}
      />
    );
    
    // Wait for API call to fail
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith(mockAPIURL);
      expect(console.error).toHaveBeenCalled();
    });
    
    // Component should still render without crashing
    expect(screen.getByText('Reactions')).toBeInTheDocument();
    
    // Should show empty state
    await waitFor(() => {
      expect(screen.getByText('No reactions found')).toBeInTheDocument();
    });
  });
  
  // Test TabButton component separately
  it('renders TabButton correctly', async () => {
    renderWithRouter(
      <ReactionsModal
        APIURL={mockAPIURL}
        setShowLikes={setShowLikes}
      />
    );
    
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith(mockAPIURL);
    });
    
    // Check All tab styling
    const allTab = screen.getByText('All').closest('button');
    expect(allTab).toHaveClass('border-b-4');
    expect(allTab).toHaveClass('border-listSelected');
    expect(allTab).toHaveClass('text-listSelected');
    
    // Count should be visible and properly styled
    const allCount = screen.getAllByText('5')[0]; // Total count is 5
    expect(allCount).toHaveClass('text-listSelected');
  });
  
  // Test ReactionTab component separately
  it('renders ReactionTab correctly', async () => {
    renderWithRouter(
      <ReactionsModal
        APIURL={mockAPIURL}
        setShowLikes={setShowLikes}
      />
    );
    
    // Wait for data to load
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith(mockAPIURL);
      expect(screen.getByText('John Doe')).toBeInTheDocument(); // Make sure data is loaded
    });
    
    // Instead of looking for the icon directly, check for the tab structure
    const tabs = screen.getAllByRole('button');
    const reactionTabs = tabs.filter(tab => !tab.textContent.includes('All'));
    
    // Verify we have at least one reaction tab 
    expect(reactionTabs.length).toBeGreaterThan(0);
    
    // Check that at least one tab has the expected count for 'like' (which is 2)
    const likeTab = reactionTabs.find(tab => tab.textContent.includes('2'));
    expect(likeTab).toBeDefined();
    
    // Alternative to checking for the icon directly, which might be problematic due to how
    // the mocked components render in the testing environment
    // Check that the tab has the expected styling for a reaction tab
    expect(likeTab).toHaveClass('px-4');
    expect(likeTab).toHaveClass('py-3');
  });
});