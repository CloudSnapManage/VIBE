import React from 'react';

interface MenuBarItemProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const MenuBarItem: React.FC<MenuBarItemProps> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-2 py-0.5 rounded hover:bg-primary/20 focus:bg-primary/30 focus:outline-none transition-colors duration-100"
      aria-haspopup={onClick ? undefined : "menu"} // Indicate if it's a real menu for accessibility
    >
      {children}
    </button>
  );
};

export default MenuBarItem;
