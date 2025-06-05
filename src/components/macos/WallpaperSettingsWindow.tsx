
'use client';

import React, { useState, type FormEvent, type MouseEvent as ReactMouseEvent } from 'react';
import TrafficLights from './TrafficLights';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


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
  setCustomWallpaperDataUri: (dataUri: string | null) => void; // New prop
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
  setCustomWallpaperDataUri, 
}) => {
  const [inputUrl, setInputUrl] = useState(currentWallpaperUrl || '');
  const { toast } = useToast();

  if (!isVisible) {
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const urlToSet = inputUrl.trim();
    
    setCustomWallpaperDataUri(null); // Clear any existing Data URI first
    setCustomWallpaperUrl(null); // Clear existing URL to ensure UI updates if fetch fails

    if (urlToSet) {
      try {
        new URL(urlToSet); // Basic URL validation
        setCustomWallpaperUrl(urlToSet); // Set URL optimistically for next/image fallback

        // Attempt to fetch and store as Data URI
        const response = await fetch(urlToSet);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
        }
        const blob = await response.blob();

        // Optional: Check blob size here if desired, before converting
        // For example: if (blob.size > 5 * 1024 * 1024) { /* 5MB limit */ ... }
        
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUri = reader.result as string;
          try {
            setCustomWallpaperDataUri(dataUri);
            toast({ title: "Wallpaper Set", description: "Custom wallpaper applied and cached locally." });
          } catch (storageError) {
            console.warn("Failed to store wallpaper Data URI in localStorage (likely too large):", storageError);
            setCustomWallpaperDataUri(null); // Ensure it's cleared if storage fails
            toast({ 
              title: "Wallpaper Set (URL only)", 
              description: "Custom wallpaper applied. Could not cache locally (image might be too large).",
              variant: "default" 
            });
          }
        };
        reader.onerror = () => {
          console.warn('Failed to read image as Data URI.');
          toast({ title: "Error", description: "Could not process image for local caching.", variant: "destructive" });
          // customWallpaperUrl is already set, so it will be used by next/image
        };
        reader.readAsDataURL(blob);

      } catch (error) {
        console.warn('Error setting custom wallpaper:', error);
        setCustomWallpaperUrl(urlToSet); // Still set the URL for next/image to try
        toast({ 
          title: "Invalid URL or Fetch Error", 
          description: `Could not set wallpaper. Using URL directly. Error: ${(error as Error).message}`, 
          variant: "destructive" 
        });
      }
    } else {
      // Clearing wallpaper
      setCustomWallpaperUrl(null);
      setCustomWallpaperDataUri(null);
      toast({ title: "Wallpaper Cleared", description: "Reverted to default dynamic wallpapers." });
    }
  };

  const handleClear = () => {
    setInputUrl('');
    setCustomWallpaperUrl(null);
    setCustomWallpaperDataUri(null);
    toast({ title: "Wallpaper Cleared", description: "Reverted to default dynamic wallpapers." });
  };

  return (
    <div
      className="w-full max-w-lg h-auto bg-window-bg rounded-xl shadow-macos flex flex-col overflow-hidden
                 border border-black/10 absolute" // Changed height to auto
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: '50%',
        top: '50%',
        marginLeft: '-16rem', 
        marginTop: '-100px', // Adjusted for potentially smaller height
        zIndex,
        cursor: 'default',
        minHeight: '220px', // Ensure a minimum height
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
        <div className="w-14"></div> 
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
             <p className="text-xs text-muted-foreground mt-1">Leave empty or clear to use dynamic time-based wallpapers.</p>
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
