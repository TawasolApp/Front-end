import { useState, useEffect, useRef } from "react";

const DropdownMenu = ({
  menuItems = [],
  position = "right-0",
  width = "w-64",
  iconSize = "w-4 h-4",
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const handleToggle = () => setIsOpen((prev) => !prev);
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
    <div className="relative" ref={menuRef}>
      <div className="h-full" onClick={handleToggle}>
        {children}
      </div>

      {isOpen && (
        <div
          className={`absolute ${position} mt-1 ${width} bg-cardBackground rounded-lg border border-cardBorder z-10`}
        >
          <div className="p-1">
            {menuItems.map((item, index) => (
              <button
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
