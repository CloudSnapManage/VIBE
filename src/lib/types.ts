
import type { LucideIcon } from 'lucide-react';

export interface UserShortcut {
  id: string;
  name: string;
  url: string;
  icon?: string; 
}

export interface AppDefinition {
  id: string;
  name: string;
  icon: LucideIcon | string; 
  type: 'app' | 'url';
  action?: () => void; 
  url?: string; 
  isDefault?: boolean;
  active?: boolean;
}

export interface NoteData {
  content: string;
}

export interface WallpaperSettings {
  customUrl: string | null;
  customDataUri: string | null;
}

export interface StickyNoteState {
  id: string;
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}
