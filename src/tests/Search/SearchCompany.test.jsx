import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CompanySearch from '../../pages/Search/SearchCompany';
import { axiosInstance } from '../../apis/axios';

// Mock dependencies
vi.mock('../../apis/axios', () => ({
  axiosInstance: {
    get: vi.fn()
  }
}));

// Mock navigate function
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// Mock Avatar component from MUI
vi.mock('@mui/material', () => ({
  Avatar: ({ children, src, alt, variant, sx }) => (
    <div className="mock-avatar" data-testid="company-logo" data-src={src} data-alt={alt}>
      {children}
    </div>
  )
}));

describe('CompanySearch', () => {
  const mockCompanies = [
    {
      companyId: 'company1',
      name: 'Google',
      logo: 'google-logo.png',
      followers: 15000000,
      description: 'Search engine and tech company',
      isVerified: true,
      isFollowing: false
    },
    {
      companyId: 'company2',
      name: 'Microsoft',
      logo: 'microsoft-logo.png',
      followers: 5000000,
      description: 'Software and cloud company',
      isVerified: true,
      isFollowing: true
    },
    {
      companyId: 'company3',
      name: 'LinkedIn',
      logo: null, // Test the fallback case
      followers: 950,
      description: 'Professional networking platform',
      isVerified: false,
      isFollowing: false
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Default successful response
    axiosInstance.get.mockResolvedValue({ data: mockCompanies });
  });

  const renderComponent = (props = {}) => {
    return render(
      <MemoryRouter>
        <CompanySearch searchText="tech" industry="" {...props} />
      </MemoryRouter>
    );
  };

  it('renders the component and fetches companies on mount', async () => {
    renderComponent();

    // Should show loading initially
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for companies to load
    await waitFor(() => {
      expect(screen.getByText('Google')).toBeInTheDocument();
    });

    // Check API call parameters
    expect(axiosInstance.get).toHaveBeenCalledWith('/companies', {
      params: {
        page: 1,
        limit: 10,
        name: 'tech'
      }
    });

    // Verify companies are displayed
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('Microsoft')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();

    // Check results count
    expect(screen.getByText('Showing 3 results')).toBeInTheDocument();
  });

  it('formats follower counts correctly', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Google')).toBeInTheDocument();
    });

    // Check the formatted follower counts
    expect(screen.getByText('15M followers')).toBeInTheDocument();
    expect(screen.getByText('5M followers')).toBeInTheDocument();
    expect(screen.getByText('950 followers')).toBeInTheDocument();
  });

  it('navigates to company page when clicking company name or logo', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Google')).toBeInTheDocument();
    });

    // Click on company name
    fireEvent.click(screen.getByText('Google'));
    expect(mockNavigate).toHaveBeenCalledWith('/company/company1');

    // Click on company logo
    const logos = screen.getAllByTestId('company-logo');
    fireEvent.click(logos[0]); // First logo is Google's
    expect(mockNavigate).toHaveBeenCalledWith('/company/company1');
  });

  it('shows verification badge for verified companies', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Google')).toBeInTheDocument();
    });

    // Find the verification badges directly
    const verificationBadges = screen.getAllByText('✓');
    expect(verificationBadges).toHaveLength(2); // Google and Microsoft are verified
    
    // Check that LinkedIn doesn't have a verification badge
    const linkedInContainer = screen.getByText('LinkedIn').closest('.flex-justify-between') || 
                             screen.getByText('LinkedIn').parentElement;
    expect(linkedInContainer.querySelector('.text-blue-500')).toBeFalsy();
  });

  it('only shows follow button for companies user is not following', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Google')).toBeInTheDocument();
    });

    // Count follow buttons - should be 2 (Google and LinkedIn, not Microsoft)
    const followButtons = screen.getAllByText('Follow');
    expect(followButtons.length).toBe(2);
  });

  it('shows empty state when no companies are found', async () => {
    // Mock empty response
    axiosInstance.get.mockResolvedValue({ data: [] });
    
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });

    expect(screen.queryByText('Google')).not.toBeInTheDocument();
    expect(screen.queryByText('Load more')).not.toBeInTheDocument();
    expect(screen.queryByText('No more results')).not.toBeInTheDocument();
  });

  it('handles API error correctly', async () => {
    // Mock error response
    axiosInstance.get.mockRejectedValue(new Error('API error'));
    
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Failed to load companies. Please try again.')).toBeInTheDocument();
    });

    expect(screen.queryByText('Google')).not.toBeInTheDocument();
  });

  it('handles load more functionality', async () => {
    // For this test, we need to ensure hasMore is true
    // First return full results with hasMore = true
    const fullLimitResults = Array(10).fill(null).map((_, i) => ({
      ...mockCompanies[0],
      companyId: `company${i}`,
      name: `Company ${i}`
    }));
    
    axiosInstance.get.mockResolvedValueOnce({ data: fullLimitResults });
    
    // Second page has fewer results (no more pages)
    const secondPageResults = [mockCompanies[0]];
    axiosInstance.get.mockResolvedValueOnce({ data: secondPageResults });
    
    renderComponent();

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Company 0')).toBeInTheDocument();
    });

    // With exactly 10 results (matching limit), hasMore should be true and "Load more" should be visible
    // Find the "Load more" button
    const loadMoreButton = screen.getByRole('button', { name: /load more/i });
    expect(loadMoreButton).toBeInTheDocument();

    // Click load more
    fireEvent.click(loadMoreButton);

    // Should call API with page 2
    expect(axiosInstance.get).toHaveBeenCalledWith('/companies', {
      params: {
        page: 2,
        limit: 10,
        name: 'tech'
      }
    });

    // Wait for second page to load
    await waitFor(() => {
      // Now we should see "No more results" instead of "Load more"
      expect(screen.getByText('No more results')).toBeInTheDocument();
    });

    expect(screen.queryByRole('button', { name: /load more/i })).not.toBeInTheDocument();
  });

  it('resets and fetches new data when search params change', async () => {
    const { rerender } = renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Google')).toBeInTheDocument();
    });

    // Clear previous API calls
    axiosInstance.get.mockClear();

    // Change props to trigger re-fetch
    rerender(
      <MemoryRouter>
        <CompanySearch searchText="microsoft" industry="tech" />
      </MemoryRouter>
    );

    // Should show loading again
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Check API call was made with new params
    expect(axiosInstance.get).toHaveBeenCalledWith('/companies', {
      params: {
        page: 1,
        limit: 10,
        name: 'microsoft',
        industry: 'tech'
      }
    });
  });

  it('handles company description display correctly', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Google')).toBeInTheDocument();
    });

    // Check that descriptions are shown correctly
    expect(screen.getByText('Search engine and tech company')).toBeInTheDocument();
    expect(screen.getByText('Software and cloud company')).toBeInTheDocument();
    expect(screen.getByText('Professional networking platform')).toBeInTheDocument();
  });

  it('uses placeholder for missing logo', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    });

    // Find all logos
    const logos = screen.getAllByTestId('company-logo');
    
    // First two should have logo URLs
    expect(logos[0].getAttribute('data-src')).toBe('google-logo.png');
    expect(logos[1].getAttribute('data-src')).toBe('microsoft-logo.png');
    
    // LinkedIn should use placeholder
    expect(logos[2].getAttribute('data-src')).toBe('/placeholder.svg');
  });
});