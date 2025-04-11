import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import SearchContainer from '../../pages/Search/SearchContainer';

// Setup mocks
vi.mock('../../pages/Search/SearchPosts', () => ({
  default: () => <div data-testid="search-posts">Search Posts Component</div>
}));

vi.mock('../../pages/Search/SearchPeople', () => ({
  default: () => <div data-testid="search-people">Search People Component</div>
}));

vi.mock('../../pages/Search/SearchCompany', () => ({
  default: () => <div data-testid="search-companies">Search Companies Component</div>
}));

// Helper function to render the component with router context
const renderWithRouter = (searchText = 'test-query') => {
  return render(
    <MemoryRouter initialEntries={[`/search/${searchText}`]}>
      <Routes>
        <Route path="/search/:searchText" element={<SearchContainer />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('SearchContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component with default filters', () => {
    renderWithRouter();
    
    // Check if the filter dropdown is rendered with the default selected filter
    expect(screen.getByText('Posts')).toBeInTheDocument();
    
    // Check if default time frame filter is visible
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    
    // Check if "Within network" checkbox is visible and not checked by default
    const checkbox = screen.getByRole('checkbox', { name: /within network/i });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
    
    // Check if SearchPosts component is rendered by default
    expect(screen.getByTestId('search-posts')).toBeInTheDocument();
    expect(screen.queryByTestId('search-people')).not.toBeInTheDocument();
    expect(screen.queryByTestId('search-companies')).not.toBeInTheDocument();
  });

  it('toggles the filter dropdown when button is clicked', () => {
    renderWithRouter();
    
    // Get filter dropdown button
    const filterButton = screen.getByText('Posts');
    
    // Dropdown options should not be visible initially
    expect(screen.queryByRole('menuitem', { name: 'People' })).not.toBeInTheDocument();
    
    // Click to open dropdown
    fireEvent.click(filterButton);
    
    // Check if dropdown options are visible
    expect(screen.getByRole('menuitem', { name: 'Posts' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'People' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Companies' })).toBeInTheDocument();
    
    // Click again to hide dropdown
    fireEvent.click(filterButton);
    
    // Options should be hidden again
    expect(screen.queryByRole('menuitem', { name: 'People' })).not.toBeInTheDocument();
  });

  it('changes the selected filter and renders appropriate component', () => {
    renderWithRouter();
    
    // Open filter dropdown
    fireEvent.click(screen.getByText('Posts'));
    
    // Select People filter
    fireEvent.click(screen.getByRole('menuitem', { name: 'People' }));
    
    // Check if filter text changed
    expect(screen.getByText('People')).toBeInTheDocument();
    
    // Check if the dropdown is closed after selection
    expect(screen.queryByRole('menuitem', { name: 'Posts' })).not.toBeInTheDocument();
    
    // Check if people component is rendered and posts is not
    expect(screen.getByTestId('search-people')).toBeInTheDocument();
    expect(screen.queryByTestId('search-posts')).not.toBeInTheDocument();
    
    // Check if company filter input is rendered
    expect(screen.getByPlaceholderText('Company')).toBeInTheDocument();
    
    // Change to Companies filter
    fireEvent.click(screen.getByText('People'));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Companies' }));
    
    // Check if companies component is rendered
    expect(screen.getByTestId('search-companies')).toBeInTheDocument();
    
    // Check if industry filter input is rendered
    expect(screen.getByPlaceholderText('Industry')).toBeInTheDocument();
  });

  it('updates the time frame filter value', () => {
    renderWithRouter();
    
    // Get the time frame select element
    const timeFrameSelect = screen.getByRole('combobox');
    
    // Default should be "All time"
    expect(timeFrameSelect.value).toBe('all');
    
    // Change value to "Last 24 hours"
    fireEvent.change(timeFrameSelect, { target: { value: '24h' } });
    
    // Check if value is updated
    expect(timeFrameSelect.value).toBe('24h');
    
    // SearchPosts should still be visible
    expect(screen.getByTestId('search-posts')).toBeInTheDocument();
  });

  it('toggles the "within network" checkbox', () => {
    renderWithRouter();
    
    // Get the checkbox
    const checkbox = screen.getByRole('checkbox', { name: /within network/i });
    
    // Should not be checked initially
    expect(checkbox).not.toBeChecked();
    
    // Toggle the checkbox
    fireEvent.click(checkbox);
    
    // Should now be checked
    expect(checkbox).toBeChecked();
    
    // Toggle it back
    fireEvent.click(checkbox);
    
    // Should be unchecked again
    expect(checkbox).not.toBeChecked();
  });

  it('updates company filter for People search', () => {
    renderWithRouter();
    
    // Change to People filter
    fireEvent.click(screen.getByText('Posts'));
    fireEvent.click(screen.getByRole('menuitem', { name: 'People' }));
    
    // Get the company filter input
    const companyInput = screen.getByPlaceholderText('Company');
    
    // Input should be empty initially
    expect(companyInput.value).toBe('');
    
    // Set a company value
    fireEvent.change(companyInput, { target: { value: 'Google' } });
    
    // Input should have the new value
    expect(companyInput.value).toBe('Google');
  });

  it('updates industry filter for Companies search', () => {
    renderWithRouter();
    
    // Change to Companies filter
    fireEvent.click(screen.getByText('Posts'));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Companies' }));
    
    // Get the industry filter input
    const industryInput = screen.getByPlaceholderText('Industry');
    
    // Input should be empty initially
    expect(industryInput.value).toBe('');
    
    // Set an industry value
    fireEvent.change(industryInput, { target: { value: 'Technology' } });
    
    // Input should have the new value
    expect(industryInput.value).toBe('Technology');
  });
});