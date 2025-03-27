import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import React from 'react';
import Connections from '../pages/connectionpage/ConnectionPage';
import { axiosInstance } from '../apis/axios';

vi.mock('../apis/axios', () => ({
  axiosInstance: {
    get: vi.fn(() => Promise.resolve({ data: [] })),
    delete: vi.fn(() => Promise.resolve({ status: 200 }))
  }
}));

describe('Connections Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and display connections on mount', async () => {
    const mockConnections = [
      { userId: '1', username: 'Alice Johnson', createdAt: '2024-01-01' },
      { userId: '2', username: 'Zane Adams', createdAt: '2024-02-01' }
    ];

    axiosInstance.get.mockImplementationOnce(() => Promise.resolve({ data: mockConnections }));
    render(<Connections />);

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeTruthy();
      expect(screen.getByText('Zane Adams')).toBeTruthy();
    });
  });

  it('should sort connections by first name', async () => {
    const mockConnections = [
      { userId: '1', username: 'Zane Adams', createdAt: '2024-02-01' },
      { userId: '2', username: 'Alice Johnson', createdAt: '2024-01-01' }
    ];

    axiosInstance.get.mockImplementationOnce(() => Promise.resolve({ data: mockConnections }));
    render(<Connections />);
    
    const sortByDropdown = screen.getByLabelText('Sort by:');
    fireEvent.change(sortByDropdown, { target: { value: 'firstName' } });

    await waitFor(() => {
      const connectionCards = screen.getAllByText(/Alice Johnson|Zane Adams/);
      expect(connectionCards[0].textContent).toBe('Alice Johnson');
      expect(connectionCards[1].textContent).toBe('Zane Adams');
    });
  });

  it('should sort connections by last name', async () => {
    const mockConnections = [
      { userId: '1', username: 'Alice Johnson', createdAt: '2024-01-01' },
      { userId: '2', username: 'Zane Adams', createdAt: '2024-02-01' }
    ];

    axiosInstance.get.mockImplementationOnce(() => Promise.resolve({ data: mockConnections }));
    render(<Connections />);
    
    const sortByDropdown = screen.getByLabelText('Sort by:');
    fireEvent.change(sortByDropdown, { target: { value: 'lastName' } });

    await waitFor(() => {
      const connectionCards = screen.getAllByText(/Alice Johnson|Zane Adams/);
      expect(connectionCards[0].textContent).toBe('Zane Adams');
      expect(connectionCards[1].textContent).toBe('Alice Johnson');
    });
  });

  it('should filter connections based on search query', async () => {
    const mockConnections = [
      { userId: '1', username: 'Alice Johnson' },
      { userId: '2', username: 'Bob Smith' }
    ];

    axiosInstance.get.mockImplementationOnce(() => Promise.resolve({ data: mockConnections }));
    render(<Connections />);

    const searchInput = screen.getByPlaceholderText('Search by name');
    fireEvent.change(searchInput, { target: { value: 'Alice' } });

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeTruthy();
      expect(screen.queryByText('Bob Smith')).toBeNull();
    });
  });

  it('should handle network error when fetching connections', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    axiosInstance.get.mockImplementationOnce(() => Promise.reject(new Error('Network error')));
    render(<Connections />);

    await waitFor(() => {
      expect(screen.findByText('Failed to load connections.')).toBeTruthy();
    });
    
    consoleErrorSpy.mockRestore();
  });
  // Add these tests to your ConnectionPage.test.jsx

it('should display loading state initially', () => {
  render(<Connections />);
  expect(screen.getByText('Loading...')).toBeTruthy();
});

it('should display empty state when no connections are found', async () => {
  axiosInstance.get.mockImplementationOnce(() => Promise.resolve({ data: [] }));
  render(<Connections />);
  
  await waitFor(() => {
    expect(screen.getByText('0 Connections')).toBeTruthy();
    expect(screen.queryByTestId('connection-card')).toBeNull();
  });
});

it('should maintain search filter when sorting changes', async () => {
  const mockConnections = [
    { userId: '1', username: 'Alice Johnson', createdAt: '2024-01-01' },
    { userId: '2', username: 'Bob Adams', createdAt: '2024-02-01' }
  ];

  axiosInstance.get.mockImplementationOnce(() => Promise.resolve({ data: mockConnections }));
  render(<Connections />);

  // Set search query
  const searchInput = screen.getByPlaceholderText('Search by name');
  fireEvent.change(searchInput, { target: { value: 'Alice' } });

  // Change sort while search is active
  const sortByDropdown = screen.getByLabelText('Sort by:');
  fireEvent.change(sortByDropdown, { target: { value: 'lastName' } });

  await waitFor(() => {
    expect(screen.getByText('Alice Johnson')).toBeTruthy();
    expect(screen.queryByText('Bob Adams')).toBeNull();
  });
});

it('should display correct connection count after filtering', async () => {
  const mockConnections = [
    { userId: '1', username: 'Alice Johnson', createdAt: '2024-01-01' },
    { userId: '2', username: 'Bob Smith', createdAt: '2024-02-01' }
  ];

  axiosInstance.get.mockImplementationOnce(() => Promise.resolve({ data: mockConnections }));
  render(<Connections />);

  // Set search query
  const searchInput = screen.getByPlaceholderText('Search by name');
  fireEvent.change(searchInput, { target: { value: 'Alice' } });

  await waitFor(() => {
    expect(screen.getByText('1 Connection')).toBeTruthy();
  });
});

});