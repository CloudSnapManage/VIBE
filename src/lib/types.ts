
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
  active?: boolean; // Added to indicate if the app's window is currently visible
}

export interface NoteData {
  content: string;
}

export interface WallpaperSettings {
  customUrl: string | null;
}
