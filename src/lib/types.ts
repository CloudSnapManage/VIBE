
import type { LucideIcon } from 'lucide-react';

export interface UserShortcut {
  id: string;
  name: string;
  url: string;
  icon?: string; // Placeholder for future custom icon identifiers, for now defaults to 'Link'
}

export interface AppDefinition {
  id: string;
  name: string;
  icon: LucideIcon | string; // LucideIcon component or string for specific handling
  type: 'app' | 'url';
  action?: () => void; // For 'app' type
  url?: string; // For 'url' type
  isDefault?: boolean; // To differentiate default apps from user-added ones
}
