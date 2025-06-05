
'use client';

import React, { useState, useEffect, useRef, type MouseEvent as ReactMouseEvent, useCallback } from 'react';
import Image from 'next/image';
import FinderWindow from './FinderWindow';
import DesktopIcon from './DesktopIcon';
import { Search } from 'lucide-react'; // Example icons

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
  const [timeString, setTimeString] = useState<string | null>(null);

  useEffect(() => {
    setTimeString(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const timerId = setInterval(() => {
      setTimeString(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000 * 60); // Update every minute, initial set to second for faster feedback

    return () => clearInterval(timerId);
  }, []);

  if (timeString === null) {
    return null; 
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
      <h1 className="text-8xl font-bold text-white/80 mix-blend-overlay select-none">
        {timeString}
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
  const latestMousePosition = useRef<{ clientX: number; clientY: number } | null>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    setTimeOfDay(getTimeOfDay());
    const interval = setInterval(() => {
      setTimeOfDay(getTimeOfDay());
    }, 1000 * 60 * 5);
    return () => clearInterval(interval);
  }, []);

  const desktopItems: DesktopItem[] = [
    { id: 'search-app', name: 'Search', icon: Search, actionType: 'toggleFinder' },
  ];

  const handleDesktopItemClick = (item: DesktopItem) => {
    if (item.actionType === 'toggleFinder') {
      toggleFinderVisibility();
      if (!isFinderVisible) bringFinderToFront();
    } else if (item.actionType === 'openUrl' && item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  };
  
  const performDragUpdate = useCallback(() => {
    if (!dragStartPos.current || !windowStartPos.current || !latestMousePosition.current) {
      animationFrameId.current = null; 
      return;
    }

    const dx = latestMousePosition.current.clientX - dragStartPos.current.x;
    const dy = latestMousePosition.current.clientY - dragStartPos.current.y;

    setFinderPosition({
      x: windowStartPos.current.x + dx,
      y: windowStartPos.current.y + dy,
    });

    animationFrameId.current = null; 
  }, [setFinderPosition]);

  const handleDraggingInternal = useCallback((event: MouseEvent) => {
    event.preventDefault();
    latestMousePosition.current = { clientX: event.clientX, clientY: event.clientY };

    if (animationFrameId.current === null) {
      animationFrameId.current = requestAnimationFrame(performDragUpdate);
    }
  }, [performDragUpdate]);

  const handleDragEndInternal = useCallback(() => {
    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }

    document.removeEventListener('mousemove', handleDraggingInternal);
    document.removeEventListener('mouseup', handleDragEndInternal);

    if (dragStartPos.current && windowStartPos.current && latestMousePosition.current) {
       const dx = latestMousePosition.current.clientX - dragStartPos.current.x;
       const dy = latestMousePosition.current.clientY - dragStartPos.current.y;
       setFinderPosition({
          x: windowStartPos.current.x + dx,
          y: windowStartPos.current.y + dy,
       });
    }

    dragStartPos.current = null;
    windowStartPos.current = null;
    latestMousePosition.current = null;
  }, [handleDraggingInternal, setFinderPosition]);

  const handleDragStart = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    bringFinderToFront();
    dragStartPos.current = { x: event.clientX, y: event.clientY };
    windowStartPos.current = finderPosition;
    latestMousePosition.current = { clientX: event.clientX, clientY: event.clientY };

    document.addEventListener('mousemove', handleDraggingInternal);
    document.addEventListener('mouseup', handleDragEndInternal);
  }, [bringFinderToFront, finderPosition, handleDraggingInternal, handleDragEndInternal]);

  useEffect(() => {
    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
      document.removeEventListener('mousemove', handleDraggingInternal);
      document.removeEventListener('mouseup', handleDragEndInternal);
    };
  }, [handleDraggingInternal, handleDragEndInternal]);

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
        onMinimize={toggleFinderVisibility} 
        onMaximize={() => console.log('Maximize Finder (not implemented)')}
        onDragStart={handleDragStart}
        zIndex={finderZIndex}
      />
    </div>
  );
};

export default DesktopArea;
