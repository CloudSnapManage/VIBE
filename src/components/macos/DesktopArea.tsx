
'use client';

import React, { useState, useEffect, useRef, type MouseEvent as ReactMouseEvent } from 'react';
import Image from 'next/image';
import FinderWindow from './FinderWindow';
import DesktopIcon from './DesktopIcon';
import { Search, Link as LinkIcon } from 'lucide-react'; // Example icons

const wallpapers = {
  morning: { src: 'https://placehold.co/1920x1080.png', hint: 'sunrise mountain' },
  day: { src: 'https://placehold.co/1920x1080.png', hint: 'daylight valley' },
  evening: { src: 'https://placehold.co/1920x1080.png', hint: 'sunset beach' },
  night: { src: 'https://placehold.co/1920x1080.png', hint: 'night sky stars' },
};

type TimeOfDay = keyof typeof wallpapers;

interface DesktopItem {
  id: string;
  name: string;
  icon: React.ElementType;
  actionType: 'toggleFinder' | 'openUrl';
  url?: string;
}

const getTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'day';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
};

const DesktopClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
      <h1 className="text-8xl font-bold text-white/80 mix-blend-overlay select-none">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </h1>
    </div>
  );
};

interface DesktopAreaProps {
  isFinderVisible: boolean;
  toggleFinderVisibility: () => void;
  bringFinderToFront: () => void;
  finderPosition: { x: number; y: number };
  setFinderPosition: (position: { x: number; y: number } | ((prev: {x: number; y: number}) => {x: number; y: number})) => void;
  finderZIndex: number;
}

const DesktopArea: React.FC<DesktopAreaProps> = ({
  isFinderVisible,
  toggleFinderVisibility,
  bringFinderToFront,
  finderPosition,
  setFinderPosition,
  finderZIndex,
}) => {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [wallpaperLoaded, setWallpaperLoaded] = useState(false);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const windowStartPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setTimeOfDay(getTimeOfDay());
    const interval = setInterval(() => {
      setTimeOfDay(getTimeOfDay());
    }, 1000 * 60 * 5);
    return () => clearInterval(interval);
  }, []);

  const desktopItems: DesktopItem[] = [
    { id: 'search-app', name: 'Search', icon: Search, actionType: 'toggleFinder' },
    // Example of a desktop icon opening a URL
    // { id: 'google-link', name: 'Google', icon: LinkIcon, actionType: 'openUrl', url: 'https://google.com' },
  ];

  const handleDesktopItemClick = (item: DesktopItem) => {
    if (item.actionType === 'toggleFinder') {
      toggleFinderVisibility();
      if (!isFinderVisible) bringFinderToFront();
    } else if (item.actionType === 'openUrl' && item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  };
  
  const handleDragStart = (e: ReactMouseEvent<HTMLDivElement>) => {
    bringFinderToFront();
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    windowStartPos.current = finderPosition; // Capture current position of the window
    document.addEventListener('mousemove', handleDragging);
    document.addEventListener('mouseup', handleDragEnd);
  };

  const handleDragging = (e: MouseEvent) => {
    if (!dragStartPos.current || !windowStartPos.current) return;
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    setFinderPosition({
      x: windowStartPos.current.x + dx,
      y: windowStartPos.current.y + dy,
    });
  };

  const handleDragEnd = () => {
    dragStartPos.current = null;
    windowStartPos.current = null;
    document.removeEventListener('mousemove', handleDragging);
    document.removeEventListener('mouseup', handleDragEnd);
  };

  const currentWallpaper = wallpapers[timeOfDay];

  return (
    <div className="flex-grow relative flex items-start justify-start overflow-hidden p-4">
      <Image
        src={currentWallpaper.src}
        alt={`Dynamic wallpaper: ${currentWallpaper.hint}`}
        data-ai-hint={currentWallpaper.hint}
        layout="fill"
        objectFit="cover"
        quality={85}
        priority
        className={`transition-opacity duration-1000 ${wallpaperLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setWallpaperLoaded(true)}
      />
      <DesktopClock />
      
      {/* Desktop Icons Area */}
      <div className="relative z-10 grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-4 w-full">
        {desktopItems.map((item) => (
          <DesktopIcon
            key={item.id}
            name={item.name}
            icon={item.icon}
            onClick={() => handleDesktopItemClick(item)}
          />
        ))}
      </div>

      <FinderWindow
        isVisible={isFinderVisible}
        position={finderPosition}
        onClose={toggleFinderVisibility}
        onMinimize={toggleFinderVisibility} // Simple hide for now
        onMaximize={() => console.log('Maximize Finder (not implemented)')}
        onDragStart={handleDragStart}
        zIndex={finderZIndex}
      />
    </div>
  );
};

export default DesktopArea;
