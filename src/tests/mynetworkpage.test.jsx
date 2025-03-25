import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import NetworkBox from "../pages/mynetworkpage/mynetworkpage";
import { axiosInstance } from '../apis/axios';

vi.mock('../apis/axios', () => ({
  axiosInstance: {
    get: vi.fn(() => Promise.resolve({ data: [] })),
    patch: vi.fn(() => Promise.resolve({ status: 200 }))
  }
}));

describe('NetworkBox Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and display pending requests on mount', async () => {
    const mockRequests = [
      { userId: '1', username: 'John Doe', imageUrl: 'test.jpg', experience: 'Engineer' }
    ];

    axiosInstance.get.mockImplementationOnce(() => Promise.resolve({ data: mockRequests }));
    render(
      <MemoryRouter>
        <NetworkBox />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeTruthy();
      expect(screen.getByText('Engineer')).toBeTruthy();
    });
  });

  it('should handle accepting a connection request', async () => {
    const mockRequests = [
      { userId: '1', username: 'John Doe', imageUrl: 'test.jpg', experience: 'Engineer' }
    ];
    axiosInstance.get.mockImplementationOnce(() => Promise.resolve({ data: mockRequests }));
    render(
      <MemoryRouter>
        <NetworkBox />
      </MemoryRouter>
    );

    const acceptButton = await screen.findByText('Accept');
    fireEvent.click(acceptButton);

    await waitFor(() => {
      expect(axiosInstance.patch).toHaveBeenCalledWith('/connections/1', { isAccept: true });
    });
  });

  it('should handle ignoring a connection request', async () => {
    const mockRequests = [
      { userId: '1', username: 'John Doe', imageUrl: 'test.jpg', experience: 'Engineer' }
    ];
    axiosInstance.get.mockImplementationOnce(() => Promise.resolve({ data: mockRequests }));
    render(
      <MemoryRouter>
        <NetworkBox />
      </MemoryRouter>
    );

    const ignoreButton = await screen.findByText('Ignore');
    fireEvent.click(ignoreButton);

    await waitFor(() => {
      expect(axiosInstance.patch).toHaveBeenCalledWith('/connections/1', { isAccept: false });
    });
  });

  it('should handle network error when fetching requests', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    axiosInstance.get.mockImplementationOnce(() => Promise.reject(new Error('Network error')));
    render(
      <MemoryRouter>
        <NetworkBox />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.findByText('Failed to load pending requests.')).toBeTruthy();
    });
    
    consoleErrorSpy.mockRestore();
  });
});
