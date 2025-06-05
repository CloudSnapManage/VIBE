
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import MenuBar from './MenuBar';
import DesktopArea from './DesktopArea';
import Dock from './Dock';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { UserShortcut, AppDefinition } from '@/lib/types';
import { FolderOpen, Settings, Search, Link as LinkIcon, FileText, Palette } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_FINDER_POS = { x: 20, y: 20 };
const DEFAULT_SETTINGS_POS = { x: 70, y: 70 };
const DEFAULT_NOTES_POS = { x: 120, y: 120 };
const DEFAULT_WALLPAPER_SETTINGS_POS = { x: 170, y: 170 };
const DEFAULT_Z_INDEX = 20;

const DesktopEnvironment: React.FC = () => {
  const [isClientHydrated, setIsClientHydrated] = useState(false);

  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');

  const [isFinderVisible, setIsFinderVisible] = useState(true);
  const [finderPosition, setFinderPosition] = useLocalStorage('finderPosition', DEFAULT_FINDER_POS);
  const [finderZIndex, setFinderZIndex] = useState(DEFAULT_Z_INDEX);

  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [settingsPosition, setSettingsPosition] = useLocalStorage('settingsPosition', DEFAULT_SETTINGS_POS);
  const [settingsZIndex, setSettingsZIndex] = useState(DEFAULT_Z_INDEX);
  
  const [isNotesVisible, setIsNotesVisible] = useState(false);
  const [notesPosition, setNotesPosition] = useLocalStorage('notesPosition', DEFAULT_NOTES_POS);
  const [notesZIndex, setNotesZIndex] = useState(DEFAULT_Z_INDEX);
  const [noteContent, setNoteContent] = useLocalStorage('noteContent', '');

  const [isWallpaperSettingsVisible, setIsWallpaperSettingsVisible] = useState(false);
  const [wallpaperSettingsPosition, setWallpaperSettingsPosition] = useLocalStorage('wallpaperSettingsPosition', DEFAULT_WALLPAPER_SETTINGS_POS);
  const [wallpaperSettingsZIndex, setWallpaperSettingsZIndex] = useState(DEFAULT_Z_INDEX);
  const [customWallpaperUrl, setCustomWallpaperUrl] = useLocalStorage<string | null>('customWallpaperUrl', null);
  const [customWallpaperDataUri, setCustomWallpaperDataUri] = useLocalStorage<string | null>('customWallpaperDataUri', null);

  const [maxZIndex, setMaxZIndex] = useState(DEFAULT_Z_INDEX); 

  const [userDockShortcuts, setUserDockShortcuts] = useLocalStorage<UserShortcut[]>('userDockShortcuts', []);
  const [userDesktopShortcuts, setUserDesktopShortcuts] = useLocalStorage<UserShortcut[]>('userDesktopShortcuts', []);

  useEffect(() => {
    setIsClientHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  const bringToFront = useCallback((setter: React.Dispatch<React.SetStateAction<number>>) => {
    setMaxZIndex(prevMax => {
      const newZ = prevMax + 1;
      setter(newZ);
      return newZ;
    });
  }, []);

  const bringFinderToFront = useCallback(() => bringToFront(setFinderZIndex), [bringToFront]);
  const bringSettingsToFront = useCallback(() => bringToFront(setSettingsZIndex), [bringToFront]);
  const bringNotesToFront = useCallback(() => bringToFront(setNotesZIndex), [bringToFront]);
  const bringWallpaperSettingsToFront = useCallback(() => bringToFront(setWallpaperSettingsZIndex), [bringToFront]);

  const toggleFinderVisibility = useCallback(() => {
    setIsFinderVisible(prev => {
      const newVisibility = !prev;
      if (newVisibility) bringFinderToFront();
      return newVisibility;
    });
  }, [bringFinderToFront]);

  const toggleSettingsVisibility = useCallback(() => {
    setIsSettingsVisible(prev => {
      const newVisibility = !prev;
      if (newVisibility) bringSettingsToFront();
      return newVisibility;
    });
  }, [bringSettingsToFront]);

  const toggleNotesVisibility = useCallback(() => {
    setIsNotesVisible(prev => {
      const newVisibility = !prev;
      if (newVisibility) bringNotesToFront();
      return newVisibility;
    });
  }, [bringNotesToFront]);

  const toggleWallpaperSettingsVisibility = useCallback(() => {
    setIsWallpaperSettingsVisible(prev => {
      const newVisibility = !prev;
      if (newVisibility) bringWallpaperSettingsToFront();
      return newVisibility;
    });
  }, [bringWallpaperSettingsToFront]);


  const handleDockFinderClick = useCallback(() => {
    if (!isFinderVisible) setIsFinderVisible(true);
    bringFinderToFront();
  }, [isFinderVisible, bringFinderToFront]);

  const handleDockSettingsClick = useCallback(() => {
    if (!isSettingsVisible) setIsSettingsVisible(true);
    bringSettingsToFront();
  }, [isSettingsVisible, bringSettingsToFront]);
  
  const handleDockNotesClick = useCallback(() => {
    if (!isNotesVisible) setIsNotesVisible(true);
    bringNotesToFront();
  }, [isNotesVisible, bringNotesToFront]);

  const handleDockWallpaperSettingsClick = useCallback(() => {
    if (!isWallpaperSettingsVisible) setIsWallpaperSettingsVisible(true);
    bringWallpaperSettingsToFront();
  }, [isWallpaperSettingsVisible, bringWallpaperSettingsToFront]);

  const DEFAULT_FINDER_APP: AppDefinition = {
    id: 'finder-app',
    name: 'Finder',
    icon: FolderOpen,
    type: 'app',
    action: handleDockFinderClick,
    isDefault: true,
    active: isFinderVisible,
  };
  
  const DEFAULT_SETTINGS_APP: AppDefinition = {
    id: 'settings-app',
    name: 'System Settings',
    icon: Settings,
    type: 'app',
    action: handleDockSettingsClick,
    isDefault: true,
    active: isSettingsVisible,
  };
  
  const DEFAULT_NOTES_APP: AppDefinition = {
    id: 'notes-app',
    name: 'Notes',
    icon: FileText,
    type: 'app',
    action: handleDockNotesClick,
    isDefault: true,
    active: isNotesVisible,
  };
  
  const DEFAULT_WALLPAPER_SETTINGS_APP: AppDefinition = {
    id: 'wallpaper-settings-app',
    name: 'Wallpaper Settings',
    icon: Palette,
    type: 'app',
    action: handleDockWallpaperSettingsClick,
    isDefault: true,
    active: isWallpaperSettingsVisible,
  };
  
  const DEFAULT_SEARCH_DESKTOP_ICON: AppDefinition = {
    id: 'search-desktop-icon',
    name: 'Search',
    icon: Search,
    type: 'app',
    action: toggleFinderVisibility, // Re-using finder toggle for desktop search icon
    isDefault: true,
  };


  const addShortcut = useCallback((type: 'dock' | 'desktop', name: string, url: string) => {
    const newShortcut: UserShortcut = { id: uuidv4(), name, url };
    if (type === 'dock') {
      setUserDockShortcuts(prev => [...prev, newShortcut]);
    } else {
      setUserDesktopShortcuts(prev => [...prev, newShortcut]);
    }
  }, [setUserDockShortcuts, setUserDesktopShortcuts]);

  const removeShortcut = useCallback((type: 'dock' | 'desktop', id: string) => {
    if (type === 'dock') {
      setUserDockShortcuts(prev => prev.filter(item => item.id !== id));
    } else {
      setUserDesktopShortcuts(prev => prev.filter(item => item.id !== id));
    }
  }, [setUserDockShortcuts, setUserDesktopShortcuts]);

  const userDockItems: AppDefinition[] = isClientHydrated 
    ? userDockShortcuts.map(sc => ({
        id: sc.id,
        name: sc.name,
        icon: LinkIcon, 
        type: 'url' as 'url',
        url: sc.url,
        isDefault: false,
        active: false, // URL shortcuts don't have an "active" window state in this context
      }))
    : [];

  const combinedDockItems: AppDefinition[] = [
    DEFAULT_FINDER_APP,
    DEFAULT_SETTINGS_APP,
    DEFAULT_NOTES_APP,
    DEFAULT_WALLPAPER_SETTINGS_APP,
    ...userDockItems,
    { id: 'safari-default', name: 'Safari', icon: 'Globe2', type: 'url', url: 'https://www.apple.com/safari/', isDefault: true, active: false },
    { id: 'mail-default', name: 'Mail', icon: 'Mail', type: 'url', url: 'mailto:', isDefault: true, active: false },
  ];

  const userDesktopItems: AppDefinition[] = isClientHydrated
    ? userDesktopShortcuts.map(sc => ({
        id: sc.id,
        name: sc.name,
        icon: LinkIcon,
        type: 'url' as 'url',
        url: sc.url,
        isDefault: false,
      }))
    : [];

  const combinedDesktopItems: AppDefinition[] = [
    DEFAULT_SEARCH_DESKTOP_ICON,
    ...userDesktopItems,
  ];


  return (
    <div 
      className="flex flex-col h-full w-full overflow-hidden select-none bg-transparent"
    >
      <MenuBar onToggleFinder={toggleFinderVisibility} />
      <DesktopArea
        isFinderVisible={isFinderVisible}
        toggleFinderVisibility={toggleFinderVisibility}
        bringFinderToFront={bringFinderToFront}
        finderPosition={isClientHydrated ? finderPosition : DEFAULT_FINDER_POS}
        setFinderPosition={setFinderPosition}
        finderZIndex={finderZIndex}

        isSettingsVisible={isSettingsVisible}
        toggleSettingsVisibility={toggleSettingsVisibility}
        bringSettingsToFront={bringSettingsToFront}
        settingsPosition={isClientHydrated ? settingsPosition : DEFAULT_SETTINGS_POS}
        setSettingsPosition={setSettingsPosition}
        settingsZIndex={settingsZIndex}
        theme={theme}
        setTheme={setTheme}
        
        isNotesVisible={isNotesVisible}
        toggleNotesVisibility={toggleNotesVisibility}
        bringNotesToFront={bringNotesToFront}
        notesPosition={isClientHydrated ? notesPosition : DEFAULT_NOTES_POS}
        setNotesPosition={setNotesPosition}
        notesZIndex={notesZIndex}
        noteContent={noteContent} 
        setNoteContent={setNoteContent}

        isWallpaperSettingsVisible={isWallpaperSettingsVisible}
        toggleWallpaperSettingsVisibility={toggleWallpaperSettingsVisibility}
        bringWallpaperSettingsToFront={bringWallpaperSettingsToFront}
        wallpaperSettingsPosition={isClientHydrated ? wallpaperSettingsPosition : DEFAULT_WALLPAPER_SETTINGS_POS}
        setWallpaperSettingsPosition={setWallpaperSettingsPosition}
        wallpaperSettingsZIndex={wallpaperSettingsZIndex}
        customWallpaperUrl={isClientHydrated ? customWallpaperUrl : null}
        setCustomWallpaperUrl={setCustomWallpaperUrl}
        customWallpaperDataUri={isClientHydrated ? customWallpaperDataUri : null}
        setCustomWallpaperDataUri={setCustomWallpaperDataUri}

        desktopItems={combinedDesktopItems}
        dockShortcuts={userDockShortcuts} 
        desktopShortcuts={userDesktopShortcuts}
        addShortcut={addShortcut}
        removeShortcut={removeShortcut}
      />
      <Dock items={combinedDockItems} />
    </div>
  );
};

export default DesktopEnvironment;
