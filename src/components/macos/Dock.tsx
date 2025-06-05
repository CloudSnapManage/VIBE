
import React from 'react';
import DockItem from './DockItem';
import { Separator } from '@/components/ui/separator';
import type { AppDefinition } from '@/lib/types';
import * as LucideIcons from 'lucide-react'; // Import all icons

interface DockProps {
  items: AppDefinition[];
}

const Dock: React.FC<DockProps> = ({ items }) => {
  const getIconComponent = (iconNameOrComponent: AppDefinition['icon']): LucideIcons.LucideIcon => {
    if (typeof iconNameOrComponent === 'string') {
      const IconComponent = (LucideIcons as any)[iconNameOrComponent as any];
      return IconComponent || LucideIcons.Link; // Default to Link icon if string name not found
    }
    return iconNameOrComponent as LucideIcons.LucideIcon; // It's already a component
  };

  return (
    <footer 
      className="h-[72px] w-full flex justify-center items-center p-2 shrink-0 bg-transparent relative z-30"
      aria-label="Application Dock"
    >
      <div className="bg-transparent backdrop-blur-lg shadow-dock rounded-xl p-2 flex items-end space-x-2 h-[60px]">
        {items.map((item, index) => {
          const IconComponent = getIconComponent(item.icon);
          return (
            <React.Fragment key={item.id}>
              <DockItem 
                name={item.name} 
                icon={IconComponent} 
                onClick={item.type === 'app' ? item.action : undefined}
                url={item.type === 'url' ? item.url : undefined}
                isActive={false} // isActive logic can be enhanced later
              />
              {/* Example separators, adjust as needed or make dynamic */}
              {(item.name === 'Finder' || item.name === 'System Settings' || item.id === 'safari-default') && index < items.length -1 && (
                 !items[index+1].isDefault || item.name === 'System Settings'
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
