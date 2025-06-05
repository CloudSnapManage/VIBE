'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import FinderWindow from './FinderWindow';

const wallpapers = {
  morning: { src: 'https://placehold.co/1920x1080.png', hint: 'sunrise mountain' },
  day: { src: 'https://placehold.co/1920x1080.png', hint: 'daylight valley' },
  evening: { src: 'https://placehold.co/1920x1080.png', hint: 'sunset beach' },
  night: { src: 'https://placehold.co/1920x1080.png', hint: 'night sky stars' },
};

type TimeOfDay = keyof typeof wallpapers;

const getTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'day';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
};

const DesktopArea: React.FC = () => {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [wallpaperLoaded, setWallpaperLoaded] = useState(false);

  useEffect(() => {
    setTimeOfDay(getTimeOfDay());
    const interval = setInterval(() => {
      setTimeOfDay(getTimeOfDay());
    }, 1000 * 60 * 5); // Check every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const currentWallpaper = wallpapers[timeOfDay];

  return (
    <div className="flex-grow relative flex items-center justify-center overflow-hidden">
      <Image
        src={currentWallpaper.src}
        alt={`Dynamic wallpaper: ${currentWallpaper.hint}`}
        data-ai-hint={currentWallpaper.hint}
        layout="fill"
        objectFit="cover"
        quality={85}
        priority
        className={`transition-opacity duration-1000 ${wallpaperLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setWallpaperLoaded(true)}
      />
      <div className="absolute inset-0 flex items-center justify-center p-8 z-10">
        <FinderWindow />
      </div>
    </div>
  );
};

export default DesktopArea;
