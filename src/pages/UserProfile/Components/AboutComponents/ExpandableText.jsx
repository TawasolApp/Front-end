// ExpandableText.jsx
import React, { useState, useRef, useEffect } from "react";

const ExpandableText = ({ text = "", maxLines = 3, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowToggle, setShouldShowToggle] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      const lineHeight = parseFloat(
        getComputedStyle(textRef.current).lineHeight
      );
      const fullHeight = textRef.current.scrollHeight;
      const maxHeight = lineHeight * maxLines;

      setShouldShowToggle(fullHeight > maxHeight);
    }
  }, [text, maxLines]);

  if (!text?.trim()) return null;

  return (
    <div className={`text-sm text-companyheader ${className}`}>
      <div
        ref={textRef}
        className={`whitespace-pre-wrap break-words transition-all duration-300 ease-in-out ${
          isExpanded ? "" : `line-clamp-${maxLines}`
        }`}
        style={
          !isExpanded
            ? {
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: maxLines,
                overflow: "hidden",
              }
            : {}
        }
      >
        {text}
      </div>

      {shouldShowToggle && (
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          {isExpanded ? "See less" : "See more"}
        </button>
      )}
    </div>
  );
};

export default ExpandableText;
