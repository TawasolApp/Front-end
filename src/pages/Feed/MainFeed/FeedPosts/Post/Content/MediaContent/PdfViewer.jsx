import { useState, useEffect, useRef } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const PdfViewer = ({ url }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLoading(false);
    adjustScale();
  }

  // Adjust scale based on container size
  const adjustScale = () => {
    if (containerRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      const containerWidth = containerRef.current.clientWidth;
      // Adjust the scale to fit the container height (with some padding)
      setScale(
        Math.min((containerHeight - 20) / 842, (containerWidth - 20) / 595),
      );
    }
  };

  // Re-adjust scale on container size changes or fullscreen toggle
  useEffect(() => {
    adjustScale();
    window.addEventListener("resize", adjustScale);
    return () => window.removeEventListener("resize", adjustScale);
  }, [isFullScreen]);

  function changePage(offset) {
    const newPage = pageNumber + offset;
    if (newPage >= 1 && newPage <= numPages) {
      setPageNumber(newPage);
    }
  }

  function onPageChange(e) {
    const page = parseInt(e.target.value);
    if (page >= 1 && page <= numPages) {
      setPageNumber(page);
    }
  }

  function toggleFullScreen() {
    setIsFullScreen(!isFullScreen);
  }

  useEffect(() => {
    if (numPages && pageNumber > numPages) {
      setPageNumber(numPages);
    }
  }, [numPages, pageNumber]);

  return (
    <div
      className={`w-full h-full flex flex-col ${isFullScreen ? "fixed inset-0 bg-white z-50" : ""}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      ref={containerRef}
    >
      <div className="flex-grow relative overflow-hidden bg-gray-100">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700"></div>
          </div>
        )}

        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={null}
          className="flex justify-center items-center w-full h-full"
          error={
            <div className="flex flex-col items-center justify-center h-full p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-red-500 mb-2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p className="text-center text-gray-700">
                Failed to load PDF. Please check the file or try downloading it.
              </p>
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            scale={scale}
            className="pdf-page"
          />
        </Document>
      </div>

      {numPages && (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-black/50 p-2 flex items-center justify-between transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
        >
          <div className="flex items-center space-x-2">
            <button onClick={toggleFullScreen} className="text-white pl-2">
              {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => changePage(-1)}
                disabled={pageNumber <= 1}
                className="px-2 py-1 bg-white/20 text-white rounded-md shadow-sm disabled:opacity-50 hover:bg-white/30"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>

              <span className="text-sm text-white">
                {pageNumber} / {numPages}
              </span>

              <button
                onClick={() => changePage(1)}
                disabled={pageNumber >= numPages}
                className="px-2 py-1 bg-white/20 text-white rounded-md shadow-sm disabled:opacity-50 hover:bg-white/30"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>

          <input
            type="range"
            min="1"
            max={numPages}
            value={pageNumber}
            onChange={onPageChange}
            className="w-1/3 mx-2"
          />

          <a
            href={url}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-white hover:text-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </a>
        </div>
      )}
    </div>
  );
};

export default PdfViewer;
