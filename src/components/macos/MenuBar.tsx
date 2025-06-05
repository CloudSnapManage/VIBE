'use client';

import React, { useState, useEffect } from 'react';
import { AppleLogoIcon } from '@/components/icons/AppleLogoIcon';
import MenuBarItem from './MenuBarItem';
import { Wifi, BatteryFull, SlidersHorizontal, Search, Maximize } from 'lucide-react'; // Maximize for Control Center placeholder

const MenuBar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
    };
    updateClock();
    const timerId = setInterval(updateClock, 1000 * 60); // Update every minute
    return () => clearInterval(timerId);
  }, []);

  const menuItems = ['File', 'Edit', 'View', 'Go', 'Window', 'Help'];

  return (
    <header 
      className="h-[28px] bg-menubar-bg backdrop-blur-md text-menubar-fg text-sm font-medium
                 flex items-center justify-between px-4 border-b border-border/50 shadow-sm shrink-0"
      aria-label="Application Menu Bar"
    >
      <div className="flex items-center gap-3">
        <AppleLogoIcon className="h-4 w-4 text-menubar-fg" />
        <span className="font-semibold">SequoiaTab</span>
        {menuItems.map((item) => (
          <MenuBarItem key={item}>{item}</MenuBarItem>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button aria-label="Wi-Fi Settings" className="focus:outline-none focus:ring-1 focus:ring-ring rounded p-0.5">
          <Wifi size={16} />
        </button>
        <button aria-label="Battery Status" className="focus:outline-none focus:ring-1 focus:ring-ring rounded p-0.5">
          <BatteryFull size={16} />
        </button>
        <button aria-label="Control Center" className="focus:outline-none focus:ring-1 focus:ring-ring rounded p-0.5">
          <SlidersHorizontal size={16} />
        </button>
        <button aria-label="Search" className="focus:outline-none focus:ring-1 focus:ring-ring rounded p-0.5">
          <Search size={16} />
        </button>
        <span className="ml-1">{currentTime}</span>
      </div>
    </header>
  );
};

export default MenuBar;
