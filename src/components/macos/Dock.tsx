
import React from 'react';
import DockItem from './DockItem';
import { Separator } from '@/components/ui/separator';
import type { AppDefinition } from '@/lib/types';
import * as LucideIcons from 'lucide-react'; 

interface DockProps {
  items: AppDefinition[];
}

const Dock: React.FC<DockProps> = ({ items }) => {
  const getIconComponent = (iconNameOrComponent: AppDefinition['icon']): LucideIcons.LucideIcon => {
    if (typeof iconNameOrComponent === 'string') {
      const IconComponent = (LucideIcons as any)[iconNameOrComponent as any];
      return IconComponent || LucideIcons.Link; 
    }
    return iconNameOrComponent as LucideIcons.LucideIcon; 
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
                isActive={item.active === undefined ? (item.type === 'app' ? false : false) : item.active}
              />
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
