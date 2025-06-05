
'use client';

import React, { useState, type FormEvent, type MouseEvent as ReactMouseEvent } from 'react';
import TrafficLights from './TrafficLights';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings as SettingsIcon, Plus, Trash2, Sun, Moon, Link as LinkIconLucide } from 'lucide-react'; // Renamed LinkIcon to avoid conflict
import type { UserShortcut } from '@/lib/types';
import Image from 'next/image'; // Import next/image

interface SettingsWindowProps {
  isVisible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onDragStart: (e: ReactMouseEvent<HTMLDivElement>) => void;
  zIndex: number;
  dockShortcuts: UserShortcut[];
  desktopShortcuts: UserShortcut[];
  addShortcut: (type: 'dock' | 'desktop', name: string, url: string, iconUrl?: string) => void;
  removeShortcut: (type: 'dock' | 'desktop', id: string) => void;
  currentTheme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const SettingsWindow: React.FC<SettingsWindowProps> = ({
  isVisible,
  position,
  onClose,
  onMinimize,
  onMaximize,
  onDragStart,
  zIndex,
  dockShortcuts,
  desktopShortcuts,
  addShortcut,
  removeShortcut,
  currentTheme,
  setTheme,
}) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemUrl, setNewItemUrl] = useState('');
  const [activeMainTab, setActiveMainTab] = useState<'shortcuts' | 'appearance'>('shortcuts');
  const [activeShortcutTab, setActiveShortcutTab] = useState<'dock' | 'desktop'>('dock');

  if (!isVisible) {
    return null;
  }

  const handleShortcutSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newItemName.trim() && newItemUrl.trim()) {
      try {
        const parsedUrl = new URL(newItemUrl.startsWith('http') ? newItemUrl : `https://${newItemUrl}`);
        const faviconUrl = `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${parsedUrl.origin}&size=64`;
        addShortcut(activeShortcutTab, newItemName, parsedUrl.href, faviconUrl);
        setNewItemName('');
        setNewItemUrl('');
      } catch (error) {
        alert('Please enter a valid URL (e.g., https://example.com)');
      }
    } else {
      alert('Please enter both name and URL.');
    }
  };

  const renderShortcutList = (type: 'dock' | 'desktop') => {
    const items = type === 'dock' ? dockShortcuts : desktopShortcuts;
    return (
      <ScrollArea className="h-[150px] mt-4 pr-3">
        <div className="space-y-2">
          {items.length === 0 && <p className="text-sm text-muted-foreground">No custom {type} shortcuts yet.</p>}
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-2 border rounded-md bg-muted/30">
              <div className="flex items-center space-x-2">
                {item.icon ? (
                  <Image src={item.icon} alt={`${item.name} favicon`} width={20} height={20} className="rounded-sm" />
                ) : (
                  <LinkIconLucide size={20} className="text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[180px]">{item.url}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeShortcut(type, item.id)} aria-label={`Remove ${item.name}`}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  };

  return (
    <div
      className="w-full max-w-xl h-[550px] bg-window-bg rounded-xl shadow-macos flex flex-col overflow-hidden
                 border border-black/10 absolute"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: '50%',
        top: '50%',
        marginLeft: '-16rem', 
        marginTop: '-275px', 
        zIndex,
        cursor: 'default',
      }}
      role="dialog"
      aria-labelledby="settings-window-title"
      onClick={(e) => e.stopPropagation()}
    >
      <header
        className="h-9 bg-window-header-bg flex items-center px-3 border-b border-black/5 shrink-0 cursor-grab active:cursor-grabbing"
        onMouseDown={onDragStart}
      >
        <TrafficLights onClose={onClose} onMinimize={onMinimize} onMaximize={onMaximize} />
        <div className="flex-grow flex items-center justify-center text-sm font-medium text-foreground/80 select-none">
          <SettingsIcon size={16} className="mr-1.5 text-primary" />
          <span id="settings-window-title">System Settings</span>
        </div>
        <div className="w-14"></div>
      </header>
      <main className="flex-grow p-4 bg-background overflow-y-auto">
        <Tabs value={activeMainTab} onValueChange={(value) => setActiveMainTab(value as 'shortcuts' | 'appearance')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="shortcuts">Shortcuts</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="shortcuts">
            <Tabs value={activeShortcutTab} onValueChange={(value) => setActiveShortcutTab(value as 'dock' | 'desktop')} className="w-full mt-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="dock">Dock Shortcuts</TabsTrigger>
                <TabsTrigger value="desktop">Desktop Shortcuts</TabsTrigger>
              </TabsList>
              <TabsContent value="dock">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Manage Dock Shortcuts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleShortcutSubmit} className="space-y-3">
                      <Input
                        type="text"
                        placeholder="Shortcut Name (e.g., My Favorite Site)"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        aria-label="New dock shortcut name"
                      />
                      <Input
                        type="url"
                        placeholder="URL (e.g., https://example.com)"
                        value={newItemUrl}
                        onChange={(e) => setNewItemUrl(e.target.value)}
                        aria-label="New dock shortcut URL"
                      />
                      <Button type="submit" className="w-full">
                        <Plus className="mr-2 h-4 w-4" /> Add to Dock
                      </Button>
                    </form>
                    {renderShortcutList('dock')}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="desktop">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Manage Desktop Shortcuts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleShortcutSubmit} className="space-y-3">
                      <Input
                        type="text"
                        placeholder="Shortcut Name (e.g., Work Portal)"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        aria-label="New desktop shortcut name"
                      />
                      <Input
                        type="url"
                        placeholder="URL (e.g., https://mywork.com)"
                        value={newItemUrl}
                        onChange={(e) => setNewItemUrl(e.target.value)}
                        aria-label="New desktop shortcut URL"
                      />
                      <Button type="submit" className="w-full">
                        <Plus className="mr-2 h-4 w-4" /> Add to Desktop
                      </Button>
                    </form>
                    {renderShortcutList('desktop')}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Appearance Settings</CardTitle>
                <CardDescription>Customize the look and feel of your desktop.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                  <div className="flex items-center space-x-2">
                    {currentTheme === 'light' ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-blue-400" />}
                    <Label htmlFor="theme-toggle" className="text-sm font-medium">
                      {currentTheme === 'light' ? 'Light Mode' : 'Dark Mode'}
                    </Label>
                  </div>
                  <Switch
                    id="theme-toggle"
                    checked={currentTheme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                    aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SettingsWindow;
