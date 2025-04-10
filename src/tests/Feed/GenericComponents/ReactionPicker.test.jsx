import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import ReactionPicker from '../../../pages/Feed/GenericComponents/ReactionPicker';

// Mock timers
vi.useFakeTimers();

// Mock document.addEventListener and removeEventListener
document.addEventListener = vi.fn();
document.removeEventListener = vi.fn();

// Mock getBoundingClientRect and window.innerWidth for positioning calculations
const mockRect = {
  top: 100,
  right: 200,
  bottom: 150,
  left: 100,
  width: 100,
  height: 50,
};

Element.prototype.getBoundingClientRect = vi.fn(() => mockRect);
window.innerWidth = 1024;

// Mock matches for hover check
Element.prototype.matches = vi.fn(() => false);

// Mock reactionIcons
vi.mock('../../../pages/Feed/GenericComponents/reactionIcons', () => ({
  default: {
    Like: {
      Icon: (props) => <div data-testid="like-icon" className={props.className}>LikeIcon</div>,
      color: '#0a66c2',
      label: 'Like',
    },
    Celebrate: {
      Icon: (props) => <div data-testid="celebrate-icon" className={props.className}>CelebrateIcon</div>,
      color: '#44712e',
      label: 'Celebrate',
    },
    Support: {
      Icon: (props) => <div data-testid="support-icon" className={props.className}>SupportIcon</div>,
      color: '#715e86',
      label: 'Support',
    },
  }
}));

describe('ReactionPicker Component', () => {
  const onSelectReaction = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('renders children correctly', () => {
    render(
      <ReactionPicker onSelectReaction={onSelectReaction}>
        <button data-testid="trigger-button">Like</button>
      </ReactionPicker>
    );
    
    expect(screen.getByTestId('trigger-button')).toBeInTheDocument();
    expect(screen.getByText('Like')).toBeInTheDocument();
  });

  it('shows picker on mouse enter', () => {
    render(
      <ReactionPicker onSelectReaction={onSelectReaction}>
        <button>Like</button>
      </ReactionPicker>
    );
    
    // Initially picker is not shown
    expect(screen.queryByTestId('like-icon')).not.toBeInTheDocument();
    
    // Trigger mouse enter
    fireEvent.mouseEnter(screen.getByText('Like').closest('div'));
    
    // Picker should now be visible with reaction icons
    expect(screen.getByTestId('like-icon')).toBeInTheDocument();
    expect(screen.getByTestId('celebrate-icon')).toBeInTheDocument();
    expect(screen.getByTestId('support-icon')).toBeInTheDocument();
  });

  it('hides picker on mouse leave after timeout', () => {
    render(
      <ReactionPicker onSelectReaction={onSelectReaction}>
        <button data-testid="trigger-button">Like</button>
      </ReactionPicker>
    );
    
    // Show the picker
    fireEvent.mouseEnter(screen.getByTestId('trigger-button').closest('div'));
    
    // Verify picker is visible
    expect(screen.getByTestId('like-icon')).toBeInTheDocument();
    
    // Trigger mouse leave
    fireEvent.mouseLeave(screen.getByTestId('trigger-button').closest('div'));
    
    // Fast-forward timeout
    act(() => {
      vi.runAllTimers();
    });
    
    // Picker should now be hidden
    expect(screen.queryByTestId('like-icon')).not.toBeInTheDocument();
  });

  it('shows tooltip when hovering over a reaction icon', () => {
    render(
      <ReactionPicker onSelectReaction={onSelectReaction}>
        <button data-testid="trigger-button">Like</button>
      </ReactionPicker>
    );
    
    // Show the picker
    fireEvent.mouseEnter(screen.getByTestId('trigger-button').closest('div'));
    
    // Hover over the Like icon
    const likeIconContainer = screen.getByTestId('like-icon').closest('div');
    fireEvent.mouseEnter(likeIconContainer);
    
    // The tooltip should be visible with the reaction label
    const tooltip = screen.getByText('Like', { selector: '.bg-gray-800' });
    
    // Check that tooltip's parent div has the correct opacity class
    // We need to go up two levels to find the div with opacity classes
    const tooltipContainer = tooltip.closest('div').parentElement;
    expect(tooltipContainer).toHaveClass('opacity-100');
    expect(tooltipContainer).not.toHaveClass('opacity-0');
  });

  it('calls onSelectReaction with correct reaction type when clicked', () => {
    render(
      <ReactionPicker onSelectReaction={onSelectReaction}>
        <button>Like</button>
      </ReactionPicker>
    );
    
    // Show the picker
    fireEvent.mouseEnter(screen.getByText('Like').closest('div'));
    
    // Click on the Celebrate icon
    const celebrateIcon = screen.getByTestId('celebrate-icon');
    fireEvent.click(celebrateIcon.closest('button'));
    
    // Check that onSelectReaction was called with 'Celebrate'
    expect(onSelectReaction).toHaveBeenCalledWith('Celebrate');
  });

  it('closes the picker after selecting a reaction', () => {
    render(
      <ReactionPicker onSelectReaction={onSelectReaction}>
        <button>Like</button>
      </ReactionPicker>
    );
    
    // Show the picker
    fireEvent.mouseEnter(screen.getByText('Like').closest('div'));
    
    // Click on a reaction
    const supportIcon = screen.getByTestId('support-icon');
    fireEvent.click(supportIcon.closest('button'));
    
    // Picker should now be hidden
    expect(screen.queryByTestId('like-icon')).not.toBeInTheDocument();
  });

  it('toggles picker visibility on click (for mobile support)', () => {
    render(
      <ReactionPicker onSelectReaction={onSelectReaction}>
        <button data-testid="trigger-button">Like</button>
      </ReactionPicker>
    );
    
    // Initially picker is not shown
    expect(screen.queryByTestId('like-icon')).not.toBeInTheDocument();
    
    // Click to open
    fireEvent.click(screen.getByTestId('trigger-button').closest('div'));
    
    // Picker should now be visible
    expect(screen.getByTestId('like-icon')).toBeInTheDocument();
    
    // Click again to close
    fireEvent.click(screen.getByTestId('trigger-button').closest('div'));
    
    // Picker should now be hidden again
    expect(screen.queryByTestId('like-icon')).not.toBeInTheDocument();
  });

  it('applies push classes when an icon is hovered', () => {
    render(
      <ReactionPicker onSelectReaction={onSelectReaction}>
        <button data-testid="trigger-button">Like</button>
      </ReactionPicker>
    );
    
    // Show the picker
    fireEvent.mouseEnter(screen.getByTestId('trigger-button').closest('div'));
    
    // Get all icon containers - we need the parent div that has the translation classes
    // The structure is: div (with translation classes) > div (tooltip) + button > div (icon)
    const iconContainers = screen.getAllByTestId(/.*-icon/)
      .map(icon => icon.closest('div').closest('button').parentElement);
    
    // Hover over the Celebrate icon container
    const celebrateContainer = iconContainers[1]; 
    fireEvent.mouseEnter(celebrateContainer);
    
    // Like icon (before Celebrate) should have -translate-x-4 class
    expect(iconContainers[0].className).toContain('-translate-x-4');
    
    // Support icon (after Celebrate) should have translate-x-4 class
    expect(iconContainers[2].className).toContain('translate-x-4');
    
    // Celebrate icon itself should not have either class
    expect(iconContainers[1].className).not.toContain('-translate-x-4');
    expect(iconContainers[1].className).not.toContain('translate-x-4');
  });

  it('sets up event listeners for click outside behavior', () => {
    render(
      <ReactionPicker onSelectReaction={onSelectReaction}>
        <button>Like</button>
      </ReactionPicker>
    );
    
    // Show the picker
    fireEvent.mouseEnter(screen.getByText('Like').closest('div'));
    
    // Check document event listeners were added
    expect(document.addEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(document.addEventListener).toHaveBeenCalledWith('touchstart', expect.any(Function));
  });

  it('cleans up event listeners and timeouts on unmount', () => {
    const { unmount } = render(
      <ReactionPicker onSelectReaction={onSelectReaction}>
        <button>Like</button>
      </ReactionPicker>
    );
    
    // Show the picker to set up event listeners
    fireEvent.mouseEnter(screen.getByText('Like').closest('div'));
    
    // Unmount the component
    unmount();
    
    // Check document event listeners were removed
    expect(document.removeEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(document.removeEventListener).toHaveBeenCalledWith('touchstart', expect.any(Function));
  });

});