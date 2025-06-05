
'use client';

import React, { useState, type FormEvent, type MouseEvent as ReactMouseEvent } from 'react';
import TrafficLights from './TrafficLights';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';

interface WallpaperSettingsWindowProps {
  isVisible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onDragStart: (e: ReactMouseEvent<HTMLDivElement>) => void;
  zIndex: number;
  currentWallpaperUrl: string | null;
  setCustomWallpaperUrl: (url: string | null) => void;
}

const WallpaperSettingsWindow: React.FC<WallpaperSettingsWindowProps> = ({
  isVisible,
  position,
  onClose,
  onMinimize,
  onMaximize,
  onDragStart,
  zIndex,
  currentWallpaperUrl,
  setCustomWallpaperUrl,
}) => {
  const [inputUrl, setInputUrl] = useState(currentWallpaperUrl || '');

  if (!isVisible) {
    return null;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      try {
        new URL(inputUrl); // Basic URL validation
        setCustomWallpaperUrl(inputUrl.trim());
      } catch (error) {
        alert('Please enter a valid URL (e.g., https://example.com/image.png)');
      }
    } else {
      setCustomWallpaperUrl(null); // Clear custom wallpaper if input is empty
    }
  };

  const handleClear = () => {
    setInputUrl('');
    setCustomWallpaperUrl(null);
  };

  return (
    <div
      className="w-full max-w-lg h-[250px] bg-window-bg rounded-xl shadow-macos flex flex-col overflow-hidden
                 border border-black/10 absolute"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: '50%',
        top: '50%',
        marginLeft: '-16rem', // Half of max-w-lg
        marginTop: '-125px', // Half of h-[250px]
        zIndex,
        cursor: 'default',
      }}
      role="dialog"
      aria-labelledby="wallpaper-settings-window-title"
      onClick={(e) => e.stopPropagation()}
    >
      <header
        className="h-9 bg-window-header-bg flex items-center px-3 border-b border-black/5 shrink-0 cursor-grab active:cursor-grabbing"
        onMouseDown={onDragStart}
      >
        <TrafficLights onClose={onClose} onMinimize={onMinimize} onMaximize={onMaximize} />
        <div className="flex-grow flex items-center justify-center text-sm font-medium text-foreground/80 select-none">
          <Palette size={16} className="mr-1.5 text-primary" />
          <span id="wallpaper-settings-window-title">Wallpaper Settings</span>
        </div>
        <div className="w-14"></div> {/* Spacer for traffic lights */}
      </header>
      <main className="flex-grow p-6 bg-background flex flex-col justify-center">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="wallpaper-url-input" className="block text-sm font-medium text-foreground mb-1">
              Custom Wallpaper URL:
            </label>
            <Input
              id="wallpaper-url-input"
              type="url"
              placeholder="https://example.com/your-image.png"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="h-10"
              aria-label="Custom wallpaper URL"
            />
             <p className="text-xs text-muted-foreground mt-1">Leave empty to use dynamic time-based wallpapers.</p>
          </div>
          <div className="flex space-x-2">
            <Button type="submit" className="flex-grow">
              Set Wallpaper
            </Button>
            <Button type="button" variant="outline" onClick={handleClear} className="flex-grow">
              Clear & Use Default
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default WallpaperSettingsWindow;
