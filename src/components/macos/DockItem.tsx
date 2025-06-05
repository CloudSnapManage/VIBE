
import React from 'react';
import type { LucideIcon } from 'lucide-react';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DockItemProps {
  name: string;
  icon: LucideIcon | string; // Can be LucideIcon component or string URL
  onClick?: () => void;
  url?: string;
  isActive?: boolean;
}

const DockItem: React.FC<DockItemProps> = ({ name, icon, onClick, url, isActive }) => {
  const handleClick = () => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else if (onClick) {
      onClick();
    }
  };

  const isIconUrl = typeof icon === 'string' && (icon.startsWith('http') || icon.startsWith('data:'));
  const IconComponent = !isIconUrl ? icon as LucideIcon : null;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleClick}
            aria-label={name}
            className="p-1.5 rounded-md hover:bg-foreground/5 focus:bg-foreground/10 focus:outline-none
                       transition-all duration-150 ease-out transform hover:scale-125 hover:-translate-y-2 focus:scale-110 focus:-translate-y-1 group relative
                       flex items-center justify-center w-[44px] h-[44px]" // Ensure consistent size
          >
            {isIconUrl ? (
              <Image src={icon as string} alt={`${name} icon`} width={32} height={32} className="rounded-md" onError={(e) => e.currentTarget.style.display = 'none'} />
            ) : IconComponent ? (
              <IconComponent size={32} className="text-foreground/80 group-hover:text-foreground group-focus:text-foreground" />
            ) : (
              // Fallback for string icon names that weren't URLs (should be rare now)
              <span className="text-foreground/80 group-hover:text-foreground group-focus:text-foreground text-xl">?</span>
            )}
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
