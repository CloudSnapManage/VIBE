
'use client';

import React from 'react';
import type { LucideIcon } from 'lucide-react';
import Image from 'next/image';

interface DesktopIconProps {
  name: string;
  icon: LucideIcon | string; // Can be LucideIcon component or string URL
  onClick?: () => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ name, icon, onClick }) => {
  const isIconUrl = typeof icon === 'string';
  const IconComponent = !isIconUrl ? icon as LucideIcon : null;

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center w-20 h-24 p-2 rounded-md hover:bg-white/10 focus:bg-white/20 focus:outline-none transition-colors duration-100 group"
      aria-label={name}
    >
      <div className="p-2 bg-black/5 group-hover:bg-black/10 rounded-lg mb-1.5 flex items-center justify-center w-10 h-10">
        {isIconUrl ? (
          <Image src={icon as string} alt={`${name} icon`} width={32} height={32} className="rounded-sm" onError={(e) => e.currentTarget.style.display = 'none'} />
        ) : IconComponent ? (
          <IconComponent size={32} className="text-white/90" />
        ) : (
          <div className="w-8 h-8 bg-white/20 rounded" /> // Fallback placeholder
        )}
      </div>
      <p className="text-xs text-center text-white/90 truncate w-full select-none">{name}</p>
    </button>
  );
};

export default DesktopIcon;
