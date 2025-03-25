import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DropdownMenu from '../pages/Feed/GenericComponents/DropdownMenu';

describe('DropdownMenu Component', () => {
  const mockIcon = ({ className }) => <div data-testid="mock-icon" className={className}>Icon</div>;
  
  const defaultMenuItems = [
    { text: 'Item 1', onClick: vi.fn() },
    { text: 'Item 2', icon: mockIcon, onClick: vi.fn() },
    { text: 'Item 3', subtext: 'Subtext', onClick: vi.fn() }
  ];
  
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('renders trigger element (children) correctly', () => {
    render(
      <DropdownMenu menuItems={defaultMenuItems}>
        <button data-testid="trigger">Open Menu</button>
      </DropdownMenu>
    );
    
    expect(screen.getByTestId('trigger')).toBeTruthy();
  });
  
  it('shows dropdown when trigger is clicked', () => {
    render(
      <DropdownMenu menuItems={defaultMenuItems}>
        <button data-testid="trigger">Open Menu</button>
      </DropdownMenu>
    );
    
    // Menu should be hidden initially
    expect(screen.queryByText('Item 1')).toBeNull();
    
    // Click to open
    fireEvent.click(screen.getByTestId('trigger'));
    
    // Menu should be visible
    expect(screen.getByText('Item 1')).toBeTruthy();
    expect(screen.getByText('Item 2')).toBeTruthy();
    expect(screen.getByText('Item 3')).toBeTruthy();
  });

  it('hides dropdown when clicking outside', async () => {
    // Create a container with something outside the menu
    const { container } = render(
      <>
        <div data-testid="outside-element">Outside Area</div>
        <DropdownMenu menuItems={defaultMenuItems}>
          <button data-testid="trigger">Open Menu</button>
        </DropdownMenu>
      </>
    );
    
    // Click to open
    fireEvent.click(screen.getByTestId('trigger'));
    expect(screen.getByText('Item 1')).toBeTruthy();
    
    // Click outside - use click event instead of mouseDown
    fireEvent.click(screen.getByTestId('outside-element'));
    
    // Menu should be hidden
    expect(screen.queryByText('Item 1')).toBeNull();
  });
  
  it('calls item onClick handler when menu item is clicked', () => {
    render(
      <DropdownMenu menuItems={defaultMenuItems}>
        <button data-testid="trigger">Open Menu</button>
      </DropdownMenu>
    );
    
    // Click to open
    fireEvent.click(screen.getByTestId('trigger'));
    
    // Click on menu item
    fireEvent.click(screen.getByText('Item 1'));
    
    // Check if onClick was called
    expect(defaultMenuItems[0].onClick).toHaveBeenCalledTimes(1);
  });
  
  it('renders menu items with icon when provided', () => {
    render(
      <DropdownMenu menuItems={defaultMenuItems}>
        <button data-testid="trigger">Open Menu</button>
      </DropdownMenu>
    );
    
    // Click to open
    fireEvent.click(screen.getByTestId('trigger'));
    
    // Item 2 should have an icon
    expect(screen.getByTestId('mock-icon')).toBeTruthy();
  });
  
  it('renders menu items with subtext when provided', () => {
    render(
      <DropdownMenu menuItems={defaultMenuItems}>
        <button data-testid="trigger">Open Menu</button>
      </DropdownMenu>
    );
    
    // Click to open
    fireEvent.click(screen.getByTestId('trigger'));
    
    // Subtext should be visible
    expect(screen.getByText('Subtext')).toBeTruthy();
  });
  
  it('applies custom position class', () => {
    const { container } = render(
      <DropdownMenu menuItems={defaultMenuItems} position="left-0">
        <button data-testid="trigger">Open Menu</button>
      </DropdownMenu>
    );
    
    // Click to open
    fireEvent.click(screen.getByTestId('trigger'));
    
    // Check if the custom positioning class is applied
    const dropdownMenu = container.querySelector('.absolute');
    expect(dropdownMenu.className).toContain('left-0');
    expect(dropdownMenu.className).not.toContain('right-0'); // Default value
  });
  
  it('applies custom width class', () => {
    const { container } = render(
      <DropdownMenu menuItems={defaultMenuItems} width="w-96">
        <button data-testid="trigger">Open Menu</button>
      </DropdownMenu>
    );
    
    // Click to open
    fireEvent.click(screen.getByTestId('trigger'));
    
    // Check if the custom width class is applied
    const dropdownMenu = container.querySelector('.absolute');
    expect(dropdownMenu.className).toContain('w-96');
    expect(dropdownMenu.className).not.toContain('w-64'); // Default value
  });
  
  it('applies custom icon size class', () => {
    render(
      <DropdownMenu menuItems={defaultMenuItems} iconSize="w-8 h-8">
        <button data-testid="trigger">Open Menu</button>
      </DropdownMenu>
    );
    
    // Click to open
    fireEvent.click(screen.getByTestId('trigger'));
    
    // Get the icon
    const icon = screen.getByTestId('mock-icon');
    expect(icon.className).toContain('w-8 h-8');
    expect(icon.className).not.toContain('w-4 h-4'); // Default value
  });
  
  it('closes the dropdown after a menu item is clicked', () => {
    render(
      <DropdownMenu menuItems={defaultMenuItems}>
        <button data-testid="trigger">Open Menu</button>
      </DropdownMenu>
    );
    
    // Click to open
    fireEvent.click(screen.getByTestId('trigger'));
    expect(screen.getByText('Item 1')).toBeTruthy();
    
    // Click on menu item
    fireEvent.click(screen.getByText('Item 1'));
    
    // Menu should be hidden
    expect(screen.queryByText('Item 1')).toBeNull();
  });
});