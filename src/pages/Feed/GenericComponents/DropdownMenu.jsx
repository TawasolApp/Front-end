import { useState, useEffect, useRef } from 'react';

const DropdownMenu = ({ 
  menuItems = [], 
  position = 'right-0',
  children 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const handleToggle = () => setIsOpen(prev => !prev);
  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <div onClick={handleToggle}>
        {children}
      </div>

      {isOpen && (
        <div className={`absolute ${position} mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10`}>
          <div className="p-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  handleClose();
                  item.onClick?.();
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <div>
                  <div>{item.text}</div>
                  {item.subtext && (
                    <div className="text-xs text-gray-500">{item.subtext}</div>
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