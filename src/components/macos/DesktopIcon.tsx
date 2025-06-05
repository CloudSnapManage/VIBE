
'use client';

import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface DesktopIconProps {
  name: string;
  icon: LucideIcon;
  onClick?: () => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ name, icon: Icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center w-20 h-24 p-2 rounded-md hover:bg-white/10 focus:bg-white/20 focus:outline-none transition-colors duration-100 group"
      aria-label={name}
    >
      <div className="p-2 bg-black/5 group-hover:bg-black/10 rounded-lg mb-1.5">
        <Icon size={32} className="text-white/90" />
      </div>
      <p className="text-xs text-center text-white/90 truncate w-full select-none">{name}</p>
    </button>
  );
};

export default DesktopIcon;
