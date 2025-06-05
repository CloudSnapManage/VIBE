
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import MenuBar from './MenuBar';
import DesktopArea from './DesktopArea';
import Dock from './Dock';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { UserShortcut, AppDefinition } from '@/lib/types';
import { FolderOpen, Settings, Search, Link as LinkIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_FINDER_APP: AppDefinition = {
  id: 'finder-app',
  name: 'Finder',
  icon: FolderOpen,
  type: 'app',
  isDefault: true,
};

const DEFAULT_SETTINGS_APP: AppDefinition = {
  id: 'settings-app',
  name: 'System Settings',
  icon: Settings,
  type: 'app',
  isDefault: true,
};

const DEFAULT_SEARCH_DESKTOP_ICON: AppDefinition = {
  id: 'search-desktop-icon',
  name: 'Search',
  icon: Search,
  type: 'app',
  isDefault: true,
};


const DesktopEnvironment: React.FC = () => {
  const [isClientHydrated, setIsClientHydrated] = useState(false);

  const [isFinderVisible, setIsFinderVisible] = useState(true);
  const [finderPosition, setFinderPosition] = useLocalStorage('finderPosition', { x: 20, y: 20 });
  const [finderZIndex, setFinderZIndex] = useState(20);

  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [settingsPosition, setSettingsPosition] = useLocalStorage('settingsPosition', { x: 70, y: 70 });
  const [settingsZIndex, setSettingsZIndex] = useState(20);
  
  const [maxZIndex, setMaxZIndex] = useState(20);

  const [userDockShortcuts, setUserDockShortcuts] = useLocalStorage<UserShortcut[]>('userDockShortcuts', []);
  const [userDesktopShortcuts, setUserDesktopShortcuts] = useLocalStorage<UserShortcut[]>('userDesktopShortcuts', []);

  useEffect(() => {
    setIsClientHydrated(true);
    // Initialize positions if this is the first load and localStorage is empty
    // This ensures windows are somewhat centered initially rather than 0,0 if localStorage was never set.
    // However, useLocalStorage already handles initial values.
    // So this block might be redundant if initial values for useLocalStorage are sufficient.
    // For now, let's assume initial values are fine.
  }, []);

  const bringToFront = useCallback((setter: React.Dispatch<React.SetStateAction<number>>) => {
    setMaxZIndex(prevMax => {
      const newZ = prevMax + 1;
      setter(newZ);
      return newZ;
    });
  }, []);

  const bringFinderToFront = useCallback(() => bringToFront(setFinderZIndex), [bringToFront]);
  const bringSettingsToFront = useCallback(() => bringToFront(setSettingsZIndex), [bringToFront]);

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

  const handleDockFinderClick = useCallback(() => {
    if (!isFinderVisible) setIsFinderVisible(true);
    bringFinderToFront();
  }, [isFinderVisible, bringFinderToFront]);

  const handleDockSettingsClick = useCallback(() => {
    if (!isSettingsVisible) setIsSettingsVisible(true);
    bringSettingsToFront();
  }, [isSettingsVisible, bringSettingsToFront]);

  DEFAULT_FINDER_APP.action = handleDockFinderClick;
  DEFAULT_SETTINGS_APP.action = handleDockSettingsClick;
  DEFAULT_SEARCH_DESKTOP_ICON.action = toggleFinderVisibility;


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
      }))
    : [];

  const combinedDockItems: AppDefinition[] = [
    DEFAULT_FINDER_APP,
    DEFAULT_SETTINGS_APP,
    ...userDockItems,
    { id: 'safari-default', name: 'Safari', icon: 'Globe2', type: 'url', url: 'https://www.apple.com/safari/', isDefault: true },
    { id: 'mail-default', name: 'Mail', icon: 'Mail', type: 'url', url: 'mailto:', isDefault: true },
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
      className="flex flex-col h-full w-full overflow-hidden select-none bg-background"
    >
      <MenuBar onToggleFinder={toggleFinderVisibility} />
      <DesktopArea
        isFinderVisible={isFinderVisible}
        toggleFinderVisibility={toggleFinderVisibility}
        bringFinderToFront={bringFinderToFront}
        finderPosition={finderPosition}
        setFinderPosition={setFinderPosition}
        finderZIndex={finderZIndex}
        isSettingsVisible={isSettingsVisible}
        toggleSettingsVisibility={toggleSettingsVisibility}
        bringSettingsToFront={bringSettingsToFront}
        settingsPosition={settingsPosition}
        setSettingsPosition={setSettingsPosition}
        settingsZIndex={settingsZIndex}
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
