
'use client';

import React, { type MouseEvent as ReactMouseEvent, useState, useEffect } from 'react';
import TrafficLights from './TrafficLights';
import WebSearch from '@/components/macos/WebSearch';
import { Folder } from 'lucide-react';

interface FinderWindowProps {
  isVisible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void; 
  onDragStart: (e: ReactMouseEvent<HTMLDivElement>) => void;
  zIndex: number;
}

const FinderWindow: React.FC<FinderWindowProps> = ({
  isVisible,
  position,
  onClose,
  onMinimize,
  onMaximize,
  onDragStart,
  zIndex,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isVisible) {
    return null;
  }

  const desktopStyle: React.CSSProperties = {
    transform: `translate(${position.x}px, ${position.y}px)`,
    left: '50%', 
    top: '50%', 
    marginLeft: '-16rem', 
    marginTop: '-200px', 
    zIndex,
    cursor: 'default',
  };

  const mobileStyle: React.CSSProperties = {
    zIndex,
    cursor: 'default',
    // transform: `translate(${position.x}px, ${position.y}px)`, // Keep transform for dragging consistency if needed
  };
  
  const currentStyle = isMounted && window.innerWidth >= 768 ? desktopStyle : mobileStyle;


  return (
    <div
      className="bg-window-bg rounded-xl shadow-macos flex flex-col overflow-hidden border border-black/10
                 fixed inset-x-2 top-[calc(28px+0.5rem)] bottom-[calc(72px+0.5rem)] 
                 md:absolute md:w-full md:max-w-2xl md:h-[400px] md:inset-auto"
      style={currentStyle}
      role="dialog"
      aria-labelledby="finder-window-title"
      onClick={(e) => e.stopPropagation()} 
    >
      <header
        className="h-9 bg-window-header-bg flex items-center px-3 border-b border-black/5 shrink-0 cursor-grab active:cursor-grabbing"
        onMouseDown={onDragStart}
      >
        <TrafficLights onClose={onClose} onMinimize={onMinimize} onMaximize={onMaximize} />
        <div className="flex-grow flex items-center justify-center text-sm font-medium text-foreground/80 select-none">
          <Folder size={16} className="mr-1.5 text-primary" />
          <span id="finder-window-title">Finder</span>
        </div>
        <div className="w-14"></div> 
      </header>
      <main className="flex-grow p-4 sm:p-6 flex flex-col items-center justify-center bg-background">
        <WebSearch />
      </main>
    </div>
  );
};

export default FinderWindow;
