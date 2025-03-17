import { useState } from 'react';

const TextContent = ({ content }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const maxLines = 3;
    
    if (!content) return null;

    // Split content into individual lines
    const lines = content.split('\n');
    const needsTruncation = lines.length > maxLines || 
                          (lines.length === 1 && lines[0].length >= 90);
    const displayedLines = isExpanded ? lines : lines.slice(0, maxLines);

    return (
        <div className="px-4 pb-2">
            {displayedLines.map((line, index) => (
                <div 
                    key={index} 
                    className="text-gray-800 whitespace-pre-wrap break-words"
                >
                    {line || <>&nbsp;</>}
                    {/* Append "..." and button to last line */}
                    {!isExpanded && needsTruncation && index === displayedLines.length - 1 && (
                        <button
                            className="text-gray-400 hover:underline text-sm ml-1"
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