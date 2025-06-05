
'use client';

import React, { useState, useEffect, useRef, type MouseEvent as ReactMouseEvent, useCallback } from 'react';
import Image from 'next/image';
import FinderWindow from './FinderWindow';
import SettingsWindow from './SettingsWindow';
import NotesWindow from './NotesWindow'; 
import WallpaperSettingsWindow from './WallpaperSettingsWindow'; 
import StickyNoteWindow from './StickyNoteWindow';
import DesktopIcon from './DesktopIcon';
import type { AppDefinition, UserShortcut, StickyNoteState } from '@/lib/types';
import { Link as LinkIcon } from 'lucide-react';


const defaultWallpapers = {
  morning: { src: 'https://placehold.co/1920x1080.png', hint: 'sunrise mountain' },
  day: { src: 'https://placehold.co/1920x1080.png', hint: 'daylight valley' },
  evening: { src: 'https://placehold.co/1920x1080.png', hint: 'sunset beach' },
  night: { src: 'https://placehold.co/1920x1080.png', hint: 'night sky stars' },
};

type TimeOfDay = keyof typeof defaultWallpapers;

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
    const update = () => setTimeString(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    update(); 
    const timerId = setInterval(update, 1000 * 60); 
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

interface WindowDragState {
  id: string; // Can be app ID like 'finder', 'settings', or a sticky note ID
  type: 'app' | 'sticky';
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
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  
  isNotesVisible: boolean;
  toggleNotesVisibility: () => void;
  bringNotesToFront: () => void;
  notesPosition: { x: number; y: number };
  setNotesPosition: (position: { x: number; y: number } | ((prev: {x: number; y: number}) => {x: number; y: number})) => void;
  notesZIndex: number;
  noteContent: string;
  setNoteContent: (content: string) => void;

  isWallpaperSettingsVisible: boolean;
  toggleWallpaperSettingsVisibility: () => void;
  bringWallpaperSettingsToFront: () => void;
  wallpaperSettingsPosition: { x: number; y: number };
  setWallpaperSettingsPosition: (position: { x: number; y: number } | ((prev: {x: number; y: number}) => {x: number; y: number})) => void;
  wallpaperSettingsZIndex: number;
  customWallpaperUrl: string | null;
  setCustomWallpaperUrl: (url: string | null) => void;
  customWallpaperDataUri: string | null;
  setCustomWallpaperDataUri: (dataUri: string | null) => void;

  desktopItems: AppDefinition[];
  dockShortcuts: UserShortcut[];
  desktopShortcuts: UserShortcut[];
  addShortcut: (type: 'dock' | 'desktop', name: string, url: string, iconUrl?: string) => void;
  removeShortcut: (type: 'dock' | 'desktop', id: string) => void;

  stickyNotes: StickyNoteState[];
  onUpdateStickyNoteContent: (id: string, content: string) => void;
  onUpdateStickyNotePosition: (id: string, position: { x: number; y: number }) => void;
  onUpdateStickyNoteSize: (id: string, size: { width: number; height: number }) => void;
  onRemoveStickyNote: (id: string) => void;
  onBringStickyNoteToFront: (id: string) => void;
}

const DesktopArea: React.FC<DesktopAreaProps> = ({
  isFinderVisible, toggleFinderVisibility, bringFinderToFront, finderPosition, setFinderPosition, finderZIndex,
  isSettingsVisible, toggleSettingsVisibility, bringSettingsToFront, settingsPosition, setSettingsPosition, settingsZIndex, theme, setTheme,
  isNotesVisible, toggleNotesVisibility, bringNotesToFront, notesPosition, setNotesPosition, notesZIndex, noteContent, setNoteContent,
  isWallpaperSettingsVisible, toggleWallpaperSettingsVisibility, bringWallpaperSettingsToFront, wallpaperSettingsPosition, setWallpaperSettingsPosition, wallpaperSettingsZIndex, 
  customWallpaperUrl, setCustomWallpaperUrl, customWallpaperDataUri, setCustomWallpaperDataUri,
  desktopItems, dockShortcuts, desktopShortcuts, addShortcut, removeShortcut,
  stickyNotes, onUpdateStickyNoteContent, onUpdateStickyNotePosition, onUpdateStickyNoteSize, onRemoveStickyNote, onBringStickyNoteToFront,
}) => {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [wallpaperLoaded, setWallpaperLoaded] = useState(false);
  const [isClientHydrated, setIsClientHydrated] = useState(false);


  const draggingWindowRef = useRef<WindowDragState | null>(null);
  const latestMousePosition = useRef<{ clientX: number; clientY: number } | null>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    setIsClientHydrated(true);
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
    
    const { id, type, startPos, windowStartPos } = draggingWindowRef.current;
    const dx = latestMousePosition.current.clientX - startPos.x;
    const dy = latestMousePosition.current.clientY - startPos.y;

    const newPosition = {
      x: windowStartPos.x + dx,
      y: windowStartPos.y + dy,
    };

    if (type === 'app') {
      if (id === 'finder') setFinderPosition(newPosition);
      else if (id === 'settings') setSettingsPosition(newPosition);
      else if (id === 'notes') setNotesPosition(newPosition);
      else if (id === 'wallpaper-settings') setWallpaperSettingsPosition(newPosition);
    } else if (type === 'sticky') {
      onUpdateStickyNotePosition(id, newPosition);
    }

    animationFrameId.current = null; 
  }, [setFinderPosition, setSettingsPosition, setNotesPosition, setWallpaperSettingsPosition, onUpdateStickyNotePosition]);

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
       const { id, type, startPos, windowStartPos } = draggingWindowRef.current;
       const dx = latestMousePosition.current.clientX - startPos.x;
       const dy = latestMousePosition.current.clientY - startPos.y;
       const finalPosition = {
          x: windowStartPos.x + dx,
          y: windowStartPos.y + dy,
       };
       if (type === 'app') {
        if (id === 'finder') setFinderPosition(finalPosition);
        else if (id === 'settings') setSettingsPosition(finalPosition);
        else if (id === 'notes') setNotesPosition(finalPosition);
        else if (id === 'wallpaper-settings') setWallpaperSettingsPosition(finalPosition);
       } else if (type === 'sticky') {
        onUpdateStickyNotePosition(id, finalPosition);
       }
    }

    draggingWindowRef.current = null;
    latestMousePosition.current = null;
  }, [handleDraggingInternal, setFinderPosition, setSettingsPosition, setNotesPosition, setWallpaperSettingsPosition, onUpdateStickyNotePosition]);

  const handleWindowDragStart = useCallback((
    event: ReactMouseEvent<HTMLDivElement>, 
    windowType: 'app' | 'sticky',
    windowId: string
  ) => {
    let currentPosition: {x: number; y: number};

    if (windowType === 'app') {
      switch(windowId) {
        case 'finder': bringFinderToFront(); currentPosition = finderPosition; break;
        case 'settings': bringSettingsToFront(); currentPosition = settingsPosition; break;
        case 'notes': bringNotesToFront(); currentPosition = notesPosition; break;
        case 'wallpaper-settings': bringWallpaperSettingsToFront(); currentPosition = wallpaperSettingsPosition; break;
        default: return; 
      }
    } else if (windowType === 'sticky') {
      const stickyNote = stickyNotes.find(note => note.id === windowId);
      if (!stickyNote) return;
      onBringStickyNoteToFront(windowId);
      currentPosition = stickyNote.position;
    } else {
      return;
    }


    draggingWindowRef.current = {
      id: windowId,
      type: windowType,
      startPos: { x: event.clientX, y: event.clientY },
      windowStartPos: currentPosition,
    };
    latestMousePosition.current = { clientX: event.clientX, clientY: event.clientY };

    document.addEventListener('mousemove', handleDraggingInternal);
    document.addEventListener('mouseup', handleDragEndInternal);
  }, [
    bringFinderToFront, finderPosition, 
    bringSettingsToFront, settingsPosition, 
    bringNotesToFront, notesPosition,
    bringWallpaperSettingsToFront, wallpaperSettingsPosition,
    stickyNotes, onBringStickyNoteToFront,
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

  const currentWallpaperSrc = (isClientHydrated && customWallpaperDataUri) 
    ? customWallpaperDataUri 
    : (isClientHydrated && customWallpaperUrl) 
      ? customWallpaperUrl 
      : defaultWallpapers[timeOfDay].src;

  const currentWallpaperHint = (isClientHydrated && (customWallpaperDataUri || customWallpaperUrl))
    ? "user custom wallpaper"
    : defaultWallpapers[timeOfDay].hint;

  const handleWallpaperError = () => {
    setWallpaperLoaded(true); 
    if (customWallpaperDataUri) {
      console.warn('Failed to load custom wallpaper from Data URI. Clearing Data URI.');
      setCustomWallpaperDataUri(null); 
    } else if (customWallpaperUrl) {
      console.warn('Failed to load custom wallpaper from URL. Reverting to default.');
      setCustomWallpaperUrl(null); 
    }
  };


  return (
    <div className="flex-grow relative flex items-start justify-start overflow-hidden p-4">
      <Image
        key={currentWallpaperSrc} 
        src={currentWallpaperSrc}
        alt={`Desktop wallpaper: ${currentWallpaperHint}`}
        data-ai-hint={currentWallpaperHint}
        layout="fill"
        objectFit="cover"
        quality={85}
        priority
        className={`transition-opacity duration-1000 ${wallpaperLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setWallpaperLoaded(true)}
        onError={handleWallpaperError}
      />
      <DesktopClock />
      
      <div className="relative z-10 grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-4 w-full pt-4 pl-4">
        {desktopItems.map((item) => (
          <DesktopIcon
            key={item.id}
            name={item.name}
            icon={item.icon} // Pass item.icon directly
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
        onDragStart={(e) => handleWindowDragStart(e, 'app', 'finder')}
        zIndex={finderZIndex}
      />
      <SettingsWindow
        isVisible={isSettingsVisible}
        position={settingsPosition}
        onClose={toggleSettingsVisibility}
        onMinimize={toggleSettingsVisibility}
        onMaximize={() => console.log('Maximize Settings (not implemented)')}
        onDragStart={(e) => handleWindowDragStart(e, 'app', 'settings')}
        zIndex={settingsZIndex}
        dockShortcuts={dockShortcuts} 
        desktopShortcuts={desktopShortcuts}
        addShortcut={addShortcut}
        removeShortcut={removeShortcut}
        currentTheme={theme}
        setTheme={setTheme}
      />
      <NotesWindow
        isVisible={isNotesVisible}
        position={notesPosition}
        onClose={toggleNotesVisibility}
        onMinimize={toggleNotesVisibility}
        onMaximize={() => console.log('Maximize Notes (not implemented)')}
        onDragStart={(e) => handleWindowDragStart(e, 'app', 'notes')}
        zIndex={notesZIndex}
        noteContent={noteContent}
        setNoteContent={setNoteContent}
      />
      <WallpaperSettingsWindow
        isVisible={isWallpaperSettingsVisible}
        position={wallpaperSettingsPosition}
        onClose={toggleWallpaperSettingsVisibility}
        onMinimize={toggleWallpaperSettingsVisibility}
        onMaximize={() => console.log('Maximize Wallpaper Settings (not implemented)')}
        onDragStart={(e) => handleWindowDragStart(e, 'app', 'wallpaper-settings')}
        zIndex={wallpaperSettingsZIndex}
        currentWallpaperUrl={customWallpaperUrl}
        setCustomWallpaperUrl={setCustomWallpaperUrl}
        setCustomWallpaperDataUri={setCustomWallpaperDataUri}
      />
      {isClientHydrated && stickyNotes.map(note => (
        <StickyNoteWindow
          key={note.id}
          id={note.id}
          initialContent={note.content}
          initialPosition={note.position}
          initialSize={note.size}
          zIndex={note.zIndex}
          onClose={onRemoveStickyNote}
          onDragStart={(e, id) => handleWindowDragStart(e, 'sticky', id)}
          onContentChange={onUpdateStickyNoteContent}
          onPositionChange={onUpdateStickyNotePosition} 
          onSizeChange={onUpdateStickyNoteSize}
          onBringToFront={onBringStickyNoteToFront}
        />
      ))}
    </div>
  );
};

export default DesktopArea;


    