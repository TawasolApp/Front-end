import { useState } from 'react';

const TextContent = ({ content }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const maxLines = 3;
    const maxChars = 200;
    
    if (!content) return null;
    
    // Split content into individual lines
    const lines = content.split('\n');
    
    // Calculate total characters in first maxLines
    let totalChars = 0;
    for (let i = 0; i < Math.min(maxLines, lines.length); i++) {
        totalChars += lines[i].length;
    }
    
    const needsTruncation = lines.length > maxLines || totalChars > maxChars;
    const displayedLines = isExpanded ? lines : lines.slice(0, maxLines);
    
    // If not expanded and total chars > maxChars, we need to truncate the last displayed line
    let truncatedLastLine = '';
    if (!isExpanded && totalChars > maxChars) {
        let charCount = 0;
        for (let i = 0; i < displayedLines.length - 1; i++) {
            charCount += displayedLines[i].length;
        }
        
        // Calculate how many characters we can show in the last line
        const remainingChars = maxChars - charCount;
        if (remainingChars > 0) {
            truncatedLastLine = displayedLines[displayedLines.length - 1].substring(0, remainingChars);
        }
    }
    
    return (
        <div className="pb-2 mx-4">
            {displayedLines.map((line, index) => (
                <div
                    key={index}
                    className="text-textContent whitespace-pre-wrap break-words text-sm font-normal"
                >
                    {index === displayedLines.length - 1 && !isExpanded && totalChars > maxChars
                        ? truncatedLastLine
                        : (line || <>&nbsp;</>)}
                    
                    {/* Append "..." and button to last line if truncated */}
                    {!isExpanded && needsTruncation && index === displayedLines.length - 1 && (
                        <button
                            className="text-textPlaceholder hover:underline text-sm ml-1"
                            onClick={() => setIsExpanded(true)}
                        >
                            ...more
                        </button>
                    )}
                </div>
            ))}
            
            {/* Show less button when expanded */}
            {isExpanded && (
                <button
                    className="text-gray-400 hover:underline text-sm"
                    onClick={() => setIsExpanded(false)}
                >
                    ...less
                </button>
            )}
        </div>
    );
};

export default TextContent;