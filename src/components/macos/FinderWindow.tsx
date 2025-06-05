
'use client';

import React from 'react';
import TrafficLights from './TrafficLights';
import WebSearch from '@/components/macos/WebSearch'; // Reverted import path
import { Folder } from 'lucide-react';

const FinderWindow: React.FC = () => {
  // Basic animation for window appearance
  return (
    <div 
      className="w-full max-w-2xl h-[400px] bg-window-bg rounded-xl shadow-macos flex flex-col overflow-hidden
                 border border-black/10 animate-window-open"
      role="dialog"
      aria-labelledby="finder-window-title"
    >
      <header className="h-9 bg-window-header-bg flex items-center px-3 border-b border-black/5 shrink-0">
        <TrafficLights />
        <div className="flex-grow flex items-center justify-center text-sm font-medium text-foreground/80">
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
