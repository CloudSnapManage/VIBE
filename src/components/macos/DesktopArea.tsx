
'use client';

import React, { useState, useEffect, useRef, type MouseEvent as ReactMouseEvent, useCallback } from 'react';
import Image from 'next/image';
import FinderWindow from './FinderWindow';
import SettingsWindow from './SettingsWindow'; // Import SettingsWindow
import DesktopIcon from './DesktopIcon';
import type { AppDefinition, UserShortcut } from '@/lib/types';
import { Link as LinkIcon } from 'lucide-react';


const wallpapers = {
  morning: { src: 'https://placehold.co/1920x1080.png', hint: 'sunrise mountain' },
  day: { src: 'https://placehold.co/1920x1080.png', hint: 'daylight valley' },
  evening: { src: 'https://placehold.co/1920x1080.png', hint: 'sunset beach' },
  night: { src: 'https://placehold.co/1920x1080.png', hint: 'night sky stars' },
};

type TimeOfDay = keyof typeof wallpapers;

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
    // This effect runs only on the client after hydration
    const update = () => setTimeString(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    update(); // Initial set on client
    const timerId = setInterval(update, 1000 * 60); // Update every minute for display
    return () => clearInterval(timerId);
  }, []); // Empty dependency array ensures this runs once on mount (client-side)

  if (timeString === null) {
    // Render nothing or a placeholder on the server and during initial client render
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

interface WindowDragState {
  id: 'finder' | 'settings';
  startPos: { x: number; y: number };
  windowStartPos: { x: number; y: number };
}

interface DesktopAreaProps {
  isFinderVisible: boolean;
  toggleFinderVisibility: () => void;
  bringFinderToFront: () => void;
  finderPosition: { x: number; y: number };
  setFinderPosition: (position: { x: number; y: number } | ((prev: {x: number; y: number}) => {x: number; y: number})) => void;
  finderZIndex: number;

  isSettingsVisible: boolean;
  toggleSettingsVisibility: () => void;
  bringSettingsToFront: () => void;
  settingsPosition: { x: number; y: number };
  setSettingsPosition: (position: { x: number; y: number } | ((prev: {x: number; y: number}) => {x: number; y: number})) => void;
  settingsZIndex: number;
  
  desktopItems: AppDefinition[];

  // Props for SettingsWindow customization
  dockShortcuts: UserShortcut[];
  desktopShortcuts: UserShortcut[];
  addShortcut: (type: 'dock' | 'desktop', name: string, url: string) => void;
  removeShortcut: (type: 'dock' | 'desktop', id: string) => void;
}

const DesktopArea: React.FC<DesktopAreaProps> = ({
  isFinderVisible,
  toggleFinderVisibility,
  bringFinderToFront,
  finderPosition,
  setFinderPosition,
  finderZIndex,
  isSettingsVisible,
  toggleSettingsVisibility,
  bringSettingsToFront,
  settingsPosition,
  setSettingsPosition,
  settingsZIndex,
  desktopItems,
  dockShortcuts,
  desktopShortcuts,
  addShortcut,
  removeShortcut,
}) => {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [wallpaperLoaded, setWallpaperLoaded] = useState(false);

  const draggingWindowRef = useRef<WindowDragState | null>(null);
  const latestMousePosition = useRef<{ clientX: number; clientY: number } | null>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    setTimeOfDay(getTimeOfDay());
    const interval = setInterval(() => setTimeOfDay(getTimeOfDay()), 1000 * 60 * 5);
    return () => clearInterval(interval);
  }, []);

  const handleDesktopItemClick = (item: AppDefinition) => {
    if (item.type === 'app' && item.action) {
      item.action();
    } else if (item.type === 'url' && item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  };
  
  const performDragUpdate = useCallback(() => {
    if (!draggingWindowRef.current || !latestMousePosition.current) {
      animationFrameId.current = null; 
      return;
    }
    
    const { id, startPos, windowStartPos } = draggingWindowRef.current;
    const dx = latestMousePosition.current.clientX - startPos.x;
    const dy = latestMousePosition.current.clientY - startPos.y;

    const newPosition = {
      x: windowStartPos.x + dx,
      y: windowStartPos.y + dy,
    };

    if (id === 'finder') {
      setFinderPosition(newPosition);
    } else if (id === 'settings') {
      setSettingsPosition(newPosition);
    }

    animationFrameId.current = null; 
  }, [setFinderPosition, setSettingsPosition]);

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

    if (draggingWindowRef.current && latestMousePosition.current) {
       const { id, startPos, windowStartPos } = draggingWindowRef.current;
       const dx = latestMousePosition.current.clientX - startPos.x;
       const dy = latestMousePosition.current.clientY - startPos.y;
       const finalPosition = {
          x: windowStartPos.x + dx,
          y: windowStartPos.y + dy,
       };
       if (id === 'finder') setFinderPosition(finalPosition);
       else if (id === 'settings') setSettingsPosition(finalPosition);
    }

    draggingWindowRef.current = null;
    latestMousePosition.current = null;
  }, [handleDraggingInternal, setFinderPosition, setSettingsPosition]);

  const handleWindowDragStart = useCallback((
    event: ReactMouseEvent<HTMLDivElement>, 
    windowId: 'finder' | 'settings'
  ) => {
    let currentPosition: {x: number; y: number};
    if (windowId === 'finder') {
      bringFinderToFront();
      currentPosition = finderPosition;
    } else {
      bringSettingsToFront();
      currentPosition = settingsPosition;
    }

    draggingWindowRef.current = {
      id: windowId,
      startPos: { x: event.clientX, y: event.clientY },
      windowStartPos: currentPosition,
    };
    latestMousePosition.current = { clientX: event.clientX, clientY: event.clientY };

    document.addEventListener('mousemove', handleDraggingInternal);
    document.addEventListener('mouseup', handleDragEndInternal);
  }, [
    bringFinderToFront, finderPosition, 
    bringSettingsToFront, settingsPosition, 
    handleDraggingInternal, handleDragEndInternal
  ]);

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
      
      <div className="relative z-10 grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-4 w-full pt-4 pl-4">
        {desktopItems.map((item) => (
          <DesktopIcon
            key={item.id}
            name={item.name}
            icon={item.icon === LinkIcon || typeof item.icon === 'string' ? LinkIcon : item.icon} // Handle string case for default mapping later
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
        onDragStart={(e) => handleWindowDragStart(e, 'finder')}
        zIndex={finderZIndex}
      />
      <SettingsWindow
        isVisible={isSettingsVisible}
        position={settingsPosition}
        onClose={toggleSettingsVisibility}
        onMinimize={toggleSettingsVisibility}
        onMaximize={() => console.log('Maximize Settings (not implemented)')}
        onDragStart={(e) => handleWindowDragStart(e, 'settings')}
        zIndex={settingsZIndex}
        dockShortcuts={dockShortcuts} 
        desktopShortcuts={desktopShortcuts}
        addShortcut={addShortcut}
        removeShortcut={removeShortcut}
      />
    </div>
  );
};

export default DesktopArea;
