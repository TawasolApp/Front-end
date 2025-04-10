import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import DropdownMenu from '../../../pages/Feed/GenericComponents/DropdownMenu';

// Mock document events
const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

describe('DropdownMenu Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Mock icon component
  const TestIcon = (props) => (
    <span className={props.className} data-testid="test-icon">
      Icon
    </span>
  );

  // Test menu items
  const testMenuItems = [
    {
      text: 'Item 1',
      onClick: vi.fn(),
      icon: TestIcon,
    },
    {
      text: 'Item 2',
      onClick: vi.fn(),
      subtext: 'Subtext for item 2',
    },
    {
      text: 'Item 3',
      onClick: vi.fn(),
      icon: TestIcon,
    },
  ];

  it('renders the trigger element (children)', () => {
    render(
      <DropdownMenu menuItems={testMenuItems}>
        <button data-testid="trigger-button">Open Menu</button>
      </DropdownMenu>
    );
    
    expect(screen.getByTestId('trigger-button')).toBeInTheDocument();
    expect(screen.getByText('Open Menu')).toBeInTheDocument();
  });

  it('does not show menu items initially', () => {
    render(
      <DropdownMenu menuItems={testMenuItems}>
        <button>Open Menu</button>
      </DropdownMenu>
    );
    
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Item 3')).not.toBeInTheDocument();
  });
  
  it('opens the menu when trigger is clicked', () => {
    render(
      <DropdownMenu menuItems={testMenuItems}>
        <button data-testid="trigger-button">Open Menu</button>
      </DropdownMenu>
    );
    
    // Click the trigger button
    fireEvent.click(screen.getByTestId('trigger-button'));
    
    // Menu should now be visible
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('renders icons for menu items that have them', () => {
    render(
      <DropdownMenu menuItems={testMenuItems}>
        <button data-testid="trigger-button">Open Menu</button>
      </DropdownMenu>
    );
    
    // Open the menu
    fireEvent.click(screen.getByTestId('trigger-button'));
    
    // There should be 2 icons (for Item 1 and Item 3)
    const icons = screen.getAllByTestId('test-icon');
    expect(icons).toHaveLength(2);
  });
  
  it('renders subtext for menu items that have it', () => {
    render(
      <DropdownMenu menuItems={testMenuItems}>
        <button data-testid="trigger-button">Open Menu</button>
      </DropdownMenu>
    );
    
    // Open the menu
    fireEvent.click(screen.getByTestId('trigger-button'));
    
    // Check for subtext
    expect(screen.getByText('Subtext for item 2')).toBeInTheDocument();
  });
  
  it('calls the onClick handler and closes menu when item is clicked', () => {
    render(
      <DropdownMenu menuItems={testMenuItems}>
        <button data-testid="trigger-button">Open Menu</button>
      </DropdownMenu>
    );
    
    // Open the menu
    fireEvent.click(screen.getByTestId('trigger-button'));
    
    // Click on Item 1
    fireEvent.click(screen.getByText('Item 1'));
    
    // Check that the onClick handler was called
    expect(testMenuItems[0].onClick).toHaveBeenCalledTimes(1);
    
    // Menu should now be closed
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
  });

  it('closes the menu when clicking outside', () => {
    render(
      <div>
        <DropdownMenu menuItems={testMenuItems}>
          <button data-testid="trigger-button">Open Menu</button>
        </DropdownMenu>
        <div data-testid="outside-element">Outside Element</div>
      </div>
    );
    
    // Open the menu
    fireEvent.click(screen.getByTestId('trigger-button'));
    
    // Menu should be open
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    
    // Check that event listener was added
    expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
    
    // Extract the click handler function
    const clickHandler = addEventListenerSpy.mock.calls[0][1];
    
    // Simulate a click outside by calling the handler with a mock event
    // whose target is the outside element
    fireEvent.click(screen.getByTestId('outside-element'));
    
    // Menu should now be closed
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    
    // Event listener should be removed
    expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
  });
  
  it('renders with custom position', () => {
    render(
      <DropdownMenu 
        menuItems={testMenuItems} 
        position="left-0 top-0"
      >
        <button data-testid="trigger-button">Open Menu</button>
      </DropdownMenu>
    );
    
    // Open the menu
    fireEvent.click(screen.getByTestId('trigger-button'));
    
    // Find the menu container - it's the div that contains the menu items
    // We need to use a more specific approach to find the correct element with classes
    const menuContainer = screen.getByText('Item 1')
      .closest('button')  // Find the button containing the text
      .closest('div')     // Find the div containing the buttons (p-1)
      .parentElement;     // Find the outer div which has our position classes
    
    // Now check the classes
    expect(menuContainer.className).toContain('left-0');
    expect(menuContainer.className).toContain('top-0');
  });
  
  it('renders with custom width', () => {
    render(
      <DropdownMenu 
        menuItems={testMenuItems} 
        width="w-96"
      >
        <button data-testid="trigger-button">Open Menu</button>
      </DropdownMenu>
    );
    
    // Open the menu
    fireEvent.click(screen.getByTestId('trigger-button'));
    
    // Find the menu container using the same approach
    const menuContainer = screen.getByText('Item 1')
      .closest('button')
      .closest('div')
      .parentElement;
    
    // Check the width class
    expect(menuContainer.className).toContain('w-96');
  });
  
  it('applies custom icon size', () => {
    render(
      <DropdownMenu 
        menuItems={testMenuItems} 
        iconSize="w-8 h-8"
      >
        <button data-testid="trigger-button">Open Menu</button>
      </DropdownMenu>
    );
    
    // Open the menu
    fireEvent.click(screen.getByTestId('trigger-button'));
    
    // Check the icon size class was applied
    const icons = screen.getAllByTestId('test-icon');
    expect(icons[0]).toHaveClass('w-8');
    expect(icons[0]).toHaveClass('h-8');
  });
  
  it('toggles the menu when trigger is clicked multiple times', () => {
    render(
      <DropdownMenu menuItems={testMenuItems}>
        <button data-testid="trigger-button">Open Menu</button>
      </DropdownMenu>
    );
    
    // Initially closed
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    
    // First click - should open
    fireEvent.click(screen.getByTestId('trigger-button'));
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    
    // Second click - should close
    fireEvent.click(screen.getByTestId('trigger-button'));
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    
    // Third click - should open again
    fireEvent.click(screen.getByTestId('trigger-button'));
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });
});