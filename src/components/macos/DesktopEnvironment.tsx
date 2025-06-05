
'use client';

import React, { useState } from 'react';
import MenuBar from './MenuBar';
import DesktopArea from './DesktopArea';
import Dock from './Dock';

const DesktopEnvironment: React.FC = () => {
  const [isFinderVisible, setIsFinderVisible] = useState(true);
  const [finderPosition, setFinderPosition] = useState({ x: 0, y: 0 }); // Relative to center
  const [finderZIndex, setFinderZIndex] = useState(20); // Windows start at z-index 20
  const [maxZIndex, setMaxZIndex] = useState(20);

  const toggleFinderVisibility = () => {
    setIsFinderVisible(prev => !prev);
    if (!isFinderVisible) { // If will become visible
      bringFinderToFront();
    }
  };

  const bringFinderToFront = () => {
    setMaxZIndex(prevMax => {
      const newZ = prevMax + 1;
      setFinderZIndex(newZ);
      return newZ;
    });
  };
  
  const handleDockFinderClick = () => {
    if (!isFinderVisible) {
      setIsFinderVisible(true);
    }
    bringFinderToFront();
  }

  return (
    <div 
      className="flex flex-col h-full w-full overflow-hidden select-none bg-background" // Added bg-background as a fallback
    >
      <MenuBar onToggleFinder={toggleFinderVisibility} />
      <DesktopArea
        isFinderVisible={isFinderVisible}
        toggleFinderVisibility={toggleFinderVisibility}
        bringFinderToFront={bringFinderToFront}
        finderPosition={finderPosition}
        setFinderPosition={setFinderPosition}
        finderZIndex={finderZIndex}
      />
      <Dock onFinderClick={handleDockFinderClick} />
    </div>
  );
};

export default DesktopEnvironment;
