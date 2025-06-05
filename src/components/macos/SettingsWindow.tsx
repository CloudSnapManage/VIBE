
'use client';

import React, { useState, type FormEvent, type MouseEvent as ReactMouseEvent } from 'react';
import TrafficLights from './TrafficLights';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Settings as SettingsIcon, Plus, Trash2 } from 'lucide-react';
import type { UserShortcut } from '@/lib/types';

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
  addShortcut: (type: 'dock' | 'desktop', name: string, url: string) => void;
  removeShortcut: (type: 'dock' | 'desktop', id: string) => void;
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
}) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemUrl, setNewItemUrl] = useState('');
  const [currentTab, setCurrentTab] = useState<'dock' | 'desktop'>('dock');

  if (!isVisible) {
    return null;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newItemName.trim() && newItemUrl.trim()) {
      try {
        // Basic URL validation
        new URL(newItemUrl); // This will throw an error if URL is invalid
        addShortcut(currentTab, newItemName, newItemUrl);
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
      <ScrollArea className="h-[200px] mt-4 pr-3">
        <div className="space-y-2">
          {items.length === 0 && <p className="text-sm text-muted-foreground">No custom {type} shortcuts yet.</p>}
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-2 border rounded-md bg-muted/30">
              <div>
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-xs text-muted-foreground truncate max-w-[200px]">{item.url}</p>
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
      className="w-full max-w-lg h-[500px] bg-window-bg rounded-xl shadow-macos flex flex-col overflow-hidden
                 border border-black/10 absolute"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: '50%',
        top: '50%',
        marginLeft: '-16rem', // Half of max-w-lg
        marginTop: '-250px', // Half of h-[500px]
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
        <div className="w-14"></div> {/* Spacer for traffic lights */}
      </header>
      <main className="flex-grow p-4 bg-background overflow-y-auto">
        <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as 'dock' | 'desktop')} className="w-full">
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
                <form onSubmit={handleSubmit} className="space-y-3">
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
                <form onSubmit={handleSubmit} className="space-y-3">
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
      </main>
    </div>
  );
};

export default SettingsWindow;
