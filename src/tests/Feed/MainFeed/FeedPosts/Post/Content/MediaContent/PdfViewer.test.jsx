import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import PdfViewer from '../../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Content/MediaContent/PdfViewer.jsx';

describe('PdfViewer', () => {
  beforeEach(() => {
    // Mock console.log before each test
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });
  
  afterEach(() => {
    // Restore console.log after each test
    vi.restoreAllMocks();
  });
  
  it('renders an iframe with the correct title', () => {
    const url = 'https://example.com/document.pdf';
    render(<PdfViewer url={url} />);
    
    const iframe = screen.getByTitle('GoogleDrivePDFViewer');
    expect(iframe).toBeInTheDocument();
  });
  
  it('renders iframe with correct attributes', () => {
    const url = 'https://example.com/document.pdf';
    render(<PdfViewer url={url} />);
    
    const iframe = screen.getByTitle('GoogleDrivePDFViewer');
    expect(iframe.tagName).toBe('IFRAME');
    expect(iframe).toHaveAttribute('width', '100%');
    expect(iframe).toHaveAttribute('height', '100%');
    expect(iframe).toHaveClass('border-none');
    expect(iframe).toHaveClass('w-full');
    expect(iframe).toHaveClass('h-full');
  });
  
  it('constructs the correct src URL for the iframe', () => {
    const url = 'https://example.com/document.pdf';
    const expectedSrcBase = 'https://drive.google.com/viewerng/viewer?embedded=true&url=';
    
    render(<PdfViewer url={url} />);
    
    const iframe = screen.getByTitle('GoogleDrivePDFViewer');
    expect(iframe).toHaveAttribute('src', `${expectedSrcBase}${encodeURIComponent(url)}`.replace('.pdf', ''));
  });
  
  it('logs the constructed URL to console', () => {
    const url = 'https://example.com/document.pdf';
    const expectedLogValue = `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(url)}`.replace('.pdf', '');
    
    render(<PdfViewer url={url} />);
    
    expect(console.log).toHaveBeenCalledWith(expectedLogValue);
  });
});