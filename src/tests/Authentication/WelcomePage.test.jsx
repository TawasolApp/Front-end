import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import WelcomePage from '../../pages/Authentication/WelcomePage';

// Mock dependencies
vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn()
}));

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn()
}));

vi.mock('../../pages/Authentication/Forms/WelcomeForm', () => ({
  default: () => <div data-testid="welcome-form">Welcome Form</div>
}));

vi.mock('../../pages/Authentication/GenericComponents/AuthenticationHeader', () => ({
  default: () => <div data-testid="auth-header">Auth Header</div>
}));

vi.mock('../../store/authenticationSlice', () => ({
  logout: vi.fn()
}));

// Import mocked dependencies to control them in tests
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/authenticationSlice';

describe('WelcomePage', () => {
  const mockDispatch = vi.fn();
  const mockNavigate = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementations
    useDispatch.mockReturnValue(mockDispatch);
    useNavigate.mockReturnValue(mockNavigate);
    useSelector.mockImplementation(selector => 
      selector({ authentication: { token: null } })
    );
  });

  it('should render without token and dispatch logout', () => {
    render(<WelcomePage />);
    
    expect(screen.getByTestId('auth-header')).toBeInTheDocument();
    expect(mockDispatch).toHaveBeenCalledWith(logout());
  });

  it('should navigate to feed if token exists', () => {
    useSelector.mockImplementation(selector => 
      selector({ authentication: { token: 'mock-token' } })
    );

    render(<WelcomePage />);
    
    expect(mockNavigate).toHaveBeenCalledWith('/feed');
  });

  it('should render mobile view elements', () => {
    const { container } = render(<WelcomePage />);
    
    // Check mobile container exists
    const mobileContainer = container.querySelector('.block.lg\\:hidden');
    expect(mobileContainer).toBeInTheDocument();
    
    // Check mobile heading
    const mobileHeading = mobileContainer.querySelector('h1');
    expect(mobileHeading).toHaveTextContent('Welcome to your professional community');
    
    // Check mobile image
    const mobileImage = mobileContainer.querySelector('img');
    expect(mobileImage).toHaveAttribute('alt', 'Welcome to Tawasol');
    expect(mobileImage).toHaveClass('shadow-md');
  });

  it('should render desktop view elements', () => {
    const { container } = render(<WelcomePage />);
    
    // Check desktop container exists
    const desktopContainer = container.querySelector('.hidden.lg\\:flex');
    expect(desktopContainer).toBeInTheDocument();
    
    // Check left column content
    const leftColumn = desktopContainer.querySelector('.flex-1.max-w-xl.mr-10');
    expect(leftColumn).toBeInTheDocument();
    
    // Check right column with image
    const rightColumn = desktopContainer.querySelector('.flex-1.max-w-xl:not(.mr-10)');
    expect(rightColumn).toBeInTheDocument();
    
    const desktopImage = rightColumn.querySelector('img');
    expect(desktopImage).toHaveAttribute('alt', 'Welcome to Tawasol');
    expect(desktopImage).toHaveClass('shadow-xl');
  });

  it('should render welcome form in both layouts', () => {
    render(<WelcomePage />);
    
    const welcomeForms = screen.getAllByTestId('welcome-form');
    expect(welcomeForms).toHaveLength(2); // One in mobile view, one in desktop view
  });

  it('should include correct CSS classes for responsive layouts', () => {
    const { container } = render(<WelcomePage />);
    
    // Mobile text classes
    const mobileText = container.querySelector('.block.lg\\:hidden h1');
    expect(mobileText).toHaveClass('text-2xl', 'sm:text-3xl', 'md:text-4xl');
    
    // Desktop text classes
    const desktopText = container.querySelector('.hidden.lg\\:flex h1');
    expect(desktopText).toHaveClass('text-4xl', 'xl:text-5xl');
  });
});