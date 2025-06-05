
'use client';

import React, { type MouseEvent as ReactMouseEvent } from 'react';
import TrafficLights from './TrafficLights';
import WebSearch from '@/components/macos/WebSearch';
import { Folder } from 'lucide-react';

interface FinderWindowProps {
  isVisible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void; // Kept for completeness, though not fully implemented
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
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="w-full max-w-2xl h-[400px] bg-window-bg rounded-xl shadow-macos flex flex-col overflow-hidden
                 border border-black/10 absolute"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: '50%', // Centering adjustment for initial position
        top: '50%', // Centering adjustment for initial position
        marginLeft: '-16rem', // Half of max-w-2xl (32rem / 2)
        marginTop: '-200px', // Half of h-[400px]
        zIndex,
        cursor: 'default', 
      }}
      role="dialog"
      aria-labelledby="finder-window-title"
      onClick={(e) => e.stopPropagation()} // Prevent clicks from bubbling to desktop if window is on top
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
        <div className="w-14"></div> {/* Spacer for traffic lights */}
      </header>
      <main className="flex-grow p-6 flex flex-col items-center justify-center bg-background">
        <WebSearch />
      </main>
    </div>
  );
};

export default FinderWindow;
