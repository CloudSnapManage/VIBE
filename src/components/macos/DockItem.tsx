
import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DockItemProps {
  name: string;
  icon: LucideIcon;
  onClick?: () => void;
  url?: string; // New prop for URL
  isActive?: boolean; // To show dot for open apps (optional)
}

const DockItem: React.FC<DockItemProps> = ({ name, icon: Icon, onClick, url, isActive }) => {
  const handleClick = () => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleClick}
            aria-label={name}
            className="p-1.5 rounded-md hover:bg-foreground/5 focus:bg-foreground/10 focus:outline-none
                       transition-all duration-150 ease-out transform hover:scale-125 hover:-translate-y-2 focus:scale-110 focus:-translate-y-1 group relative"
          >
            <Icon size={32} className="text-foreground/80 group-hover:text-foreground group-focus:text-foreground" />
            {isActive && (
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1.5 w-1 h-1 bg-foreground/70 rounded-full"></span>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-popover text-popover-foreground rounded-sm px-2 py-1 text-xs shadow-md">
          <p>{name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DockItem;
