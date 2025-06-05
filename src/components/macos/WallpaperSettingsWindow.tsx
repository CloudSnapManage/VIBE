
'use client';

import React, { useState, type FormEvent, type MouseEvent as ReactMouseEvent, useEffect } from 'react';
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
  setCustomWallpaperDataUri: (dataUri: string | null) => void;
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    setInputUrl(currentWallpaperUrl || '');
  }, [currentWallpaperUrl]);


  if (!isVisible) {
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const urlToSet = inputUrl.trim();
    
    setCustomWallpaperDataUri(null); 
    setCustomWallpaperUrl(null); 

    if (urlToSet) {
      try {
        new URL(urlToSet); 
        setCustomWallpaperUrl(urlToSet); 

        const response = await fetch(urlToSet);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
        }
        const blob = await response.blob();
        
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUri = reader.result as string;
          try {
            setCustomWallpaperDataUri(dataUri);
            toast({ title: "Wallpaper Set", description: "Custom wallpaper applied and cached locally." });
          } catch (storageError) {
            console.warn("Failed to store wallpaper Data URI in localStorage (likely too large):", storageError);
            setCustomWallpaperDataUri(null); 
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
        };
        reader.readAsDataURL(blob);

      } catch (error) {
        console.warn('Error setting custom wallpaper:', error);
        setCustomWallpaperUrl(urlToSet); 
        toast({ 
          title: "Invalid URL or Fetch Error", 
          description: `Could not set wallpaper. Using URL directly. Error: ${(error as Error).message}`, 
          variant: "destructive" 
        });
      }
    } else {
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

  const desktopStyle: React.CSSProperties = {
    transform: `translate(${position.x}px, ${position.y}px)`,
    left: '50%',
    top: '50%',
    marginLeft: '-16rem', // Half of max-w-lg (32rem)
    marginTop: '-110px', // Half of min-h '220px' approx, or based on its content actual height
    zIndex,
    cursor: 'default',
  };
  
  const mobileStyle: React.CSSProperties = {
    zIndex,
    cursor: 'default',
  };

  const currentStyle = isMounted && window.innerWidth >= 768 ? desktopStyle : mobileStyle;


  return (
    <div
      className="bg-window-bg rounded-xl shadow-macos flex flex-col overflow-hidden border border-black/10
                 fixed inset-x-2 top-[calc(28px+0.5rem)] bottom-auto 
                 md:absolute md:w-full md:max-w-lg md:h-auto md:min-h-[220px] md:inset-auto"
      style={currentStyle}
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
      <main className="flex-grow p-4 sm:p-6 bg-background flex flex-col justify-center">
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
              className="h-10 text-sm"
              aria-label="Custom wallpaper URL"
            />
             <p className="text-xs text-muted-foreground mt-1">Leave empty or clear to use dynamic wallpapers.</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Button type="submit" className="flex-grow text-sm">
              Set Wallpaper
            </Button>
            <Button type="button" variant="outline" onClick={handleClear} className="flex-grow text-sm">
              Clear & Use Default
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default WallpaperSettingsWindow;
