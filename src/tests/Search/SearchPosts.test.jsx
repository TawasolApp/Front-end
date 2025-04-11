import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SearchPosts from '../../pages/Search/SearchPosts';
import MainFeed from '../../pages/Feed/MainFeed/MainFeed';

// Mock the MainFeed component
vi.mock('../../pages/Feed/MainFeed/MainFeed', () => ({
  default: vi.fn(() => <div data-testid="main-feed">Mocked MainFeed Component</div>)
}));

describe('SearchPosts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component with MainFeed', () => {
    render(
      <SearchPosts 
        searchText="react" 
        network={false} 
        timeframe="all" 
      />
    );
    
    // Check if MainFeed is rendered
    expect(screen.getByTestId('main-feed')).toBeInTheDocument();
  });

  it('passes correct search text from props', () => {
    render(
      <SearchPosts 
        searchText="python" 
        network={false}
        timeframe="all" 
      />
    );

    // Check the most recent call props
    const props = MainFeed.mock.calls[MainFeed.mock.calls.length - 1][0];
    expect(props.q).toBe("python");
  });

  it('passes correct network filter from props', () => {
    render(
      <SearchPosts 
        searchText="react" 
        network={true}
        timeframe="all" 
      />
    );

    // Check props from first render
    let props = MainFeed.mock.calls[MainFeed.mock.calls.length - 1][0];
    expect(props.network).toBe(true);

    // Re-render with network=false
    render(
      <SearchPosts 
        searchText="react" 
        network={false}
        timeframe="all" 
      />
    );

    // Check the most recent call has network=false
    props = MainFeed.mock.calls[MainFeed.mock.calls.length - 1][0];
    expect(props.network).toBe(false);
  });

  it('passes correct timeframe filter from props', () => {
    render(
      <SearchPosts 
        searchText="react" 
        network={false}
        timeframe="24h" 
      />
    );

    // Check props from render
    const props = MainFeed.mock.calls[MainFeed.mock.calls.length - 1][0];
    expect(props.timeframe).toBe("24h");
  });

  it('always sets showShare to false', () => {
    render(
      <SearchPosts 
        searchText="react" 
        network={false}
        timeframe="all" 
      />
    );

    // Check props from render
    const props = MainFeed.mock.calls[MainFeed.mock.calls.length - 1][0];
    expect(props.showShare).toBe(false);
  });

  it('uses the correct API route for searching posts', () => {
    render(
      <SearchPosts 
        searchText="react" 
        network={false}
        timeframe="all" 
      />
    );

    // Check props from render
    const props = MainFeed.mock.calls[MainFeed.mock.calls.length - 1][0];
    expect(props.API_ROUTE).toBe("/posts/search/");
  });
});