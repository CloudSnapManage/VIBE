
import React from 'react';
import DockItem from './DockItem';
import { Separator } from '@/components/ui/separator';
import type { AppDefinition } from '@/lib/types';
import * as LucideIcons from 'lucide-react';

interface DockProps {
  items: AppDefinition[];
}

const Dock: React.FC<DockProps> = ({ items }) => {
  const getLucideIconComponent = (iconName: string): LucideIcons.LucideIcon => {
    const IconComponent = (LucideIcons as any)[iconName as any];
    return IconComponent || LucideIcons.Link; // Fallback to Link icon
  };

  return (
    <footer
      className="h-[72px] w-full flex justify-center items-center p-2 shrink-0 bg-transparent relative z-30"
      aria-label="Application Dock"
    >
      <div className="bg-transparent backdrop-blur-lg shadow-dock rounded-xl p-2 flex items-end space-x-2 h-[60px]">
        {items.map((item, index) => {
          // If item.icon is a string and not a URL, try to resolve it as a Lucide icon name.
          // Otherwise, item.icon is either a Lucide component directly or an image URL string.
          const iconToRender = (typeof item.icon === 'string' && !item.icon.startsWith('http') && !item.icon.startsWith('data:'))
            ? getLucideIconComponent(item.icon)
            : item.icon;

          return (
            <React.Fragment key={item.id}>
              <DockItem
                name={item.name}
                icon={iconToRender} // Pass the resolved Lucide component or URL string
                onClick={item.type === 'app' ? item.action : undefined}
                url={item.type === 'url' ? item.url : undefined}
                isActive={item.active === undefined ? (item.type === 'app' ? false : false) : item.active}
              />
              {(item.name === 'Finder' || item.name === 'System Settings' || item.id === 'safari-default') && index < items.length - 1 && (
                !items[index + 1].isDefault || item.name === 'System Settings'
              ) && (
                <Separator orientation="vertical" className="h-10 bg-foreground/10 mx-1" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </footer>
  );
};

export default Dock;
