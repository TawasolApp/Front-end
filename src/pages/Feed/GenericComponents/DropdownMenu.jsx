import { useState, useEffect, useRef } from "react";

const DropdownMenu = ({
  menuItems = [],
  position = "right-0",
  width = "w-64",
  iconSize = "w-4 h-4",
  children,
  containerClassName = "",
  menuClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      let top = rect.bottom;
      let left = position.includes("right")
        ? rect.right - parseInt(width.replace("w-", "")) * 4
        : rect.left;

      setMenuPosition({ top, left });
    }
    setIsOpen((prev) => !prev);
  };

  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  return (
    <div className={`relative ${containerClassName}`} ref={menuRef}>
      <div className="h-full" onClick={handleToggle} ref={buttonRef}>
        {children}
      </div>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
            zIndex: 1000,
          }}
          className={`${width} bg-cardBackground rounded-lg border border-cardBorder shadow-lg ${menuClassName}`}
        >
          <div className="p-1">
            {menuItems.map((item, index) => (
              <button
                data-testid={`postEllipsis-${item.text.toLowerCase().replace(/\s+/g, "-")}`}
                key={index}
                onClick={() => {
                  handleClose();
                  item.onClick?.();
                }}
                className="w-full text-left px-4 py-2 text-sm text-textActivity hover:bg-cardBackgroundHover flex items-center gap-2 group transition-all duration-200"
              >
                {item.icon && (
                  <item.icon
                    className={`${iconSize} text-textActivity group-hover:text-textActivityHover`}
                  />
                )}
                <div>
                  <div className="text-textActivity group-hover:text-textActivityHover font-semibold">
                    {item.text}
                  </div>
                  {item.subtext && (
                    <div className="text-xs font-semibold text-textActivity group-hover:text-textActivityHover">
                      {item.subtext}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
