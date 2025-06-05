
'use client';

import React, { useState, useEffect } from 'react';
import { AppleLogoIcon } from '@/components/icons/AppleLogoIcon';
import MenuBarItem from './MenuBarItem';
import { Wifi, BatteryFull, SlidersHorizontal, Search as SearchIcon } from 'lucide-react'; // Renamed Search to SearchIcon to avoid conflict

interface MenuBarProps {
  onSearchClick?: () => void;
  onToggleFinder?: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ onToggleFinder }) => {
  const [currentTime, setCurrentTime] = useState('');
  const [batteryLevel, setBatteryLevel] = useState<string>('--%');
  const [isCharging, setIsCharging] = useState<boolean>(false);

  useEffect(() => {
    const updateClock = () => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
    };
    updateClock();
    const timerId = setInterval(updateClock, 1000 * 60); // Update every minute

    const updateBatteryStatus = async () => {
      try {
        if ('getBattery' in navigator) {
          const battery = await (navigator as any).getBattery();
          setBatteryLevel(`${Math.round(battery.level * 100)}%`);
          setIsCharging(battery.charging);

          battery.onlevelchange = () => {
            setBatteryLevel(`${Math.round(battery.level * 100)}%`);
          };
          battery.onchargingchange = () => {
            setIsCharging(battery.charging);
          };
        } else {
          setBatteryLevel('N/A');
        }
      } catch (error) {
        console.warn('Battery API not available or error:', error);
        setBatteryLevel('N/A');
      }
    };

    updateBatteryStatus();

    return () => clearInterval(timerId);
  }, []);

  // Removed File, Edit, View, Go, Window, Help
  const menuItems: string[] = []; 

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
        <span className="text-xs">{isCharging ? '⚡' : ''}{batteryLevel}</span>
        <button aria-label="Wi-Fi Settings" className="focus:outline-none focus:ring-1 focus:ring-ring rounded p-0.5">
          <Wifi size={16} />
        </button>
        {/* Replaced BatteryFull icon with dynamic battery level text */}
        <button aria-label="Control Center" className="focus:outline-none focus:ring-1 focus:ring-ring rounded p-0.5">
          <SlidersHorizontal size={16} />
        </button>
        <button 
          aria-label="Search" 
          className="focus:outline-none focus:ring-1 focus:ring-ring rounded p-0.5"
          onClick={onToggleFinder}
        >
          <SearchIcon size={16} />
        </button>
        <span className="ml-1">{currentTime}</span>
      </div>
    </header>
  );
};

export default MenuBar;
