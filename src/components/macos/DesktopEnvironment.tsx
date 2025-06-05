
'use client';

import React, { useState, useCallback } from 'react';
import MenuBar from './MenuBar';
import DesktopArea from './DesktopArea';
import Dock from './Dock';

const DesktopEnvironment: React.FC = () => {
  const [isFinderVisible, setIsFinderVisible] = useState(true);
  const [finderPosition, setFinderPosition] = useState({ x: 0, y: 0 }); // Relative to center
  const [finderZIndex, setFinderZIndex] = useState(20); // Windows start at z-index 20
  const [maxZIndex, setMaxZIndex] = useState(20);

  const bringFinderToFront = useCallback(() => {
    setMaxZIndex(prevMax => {
      const newZ = prevMax + 1;
      setFinderZIndex(newZ);
      return newZ;
    });
  }, []); // setMaxZIndex and setFinderZIndex are stable

  const toggleFinderVisibility = useCallback(() => {
    setIsFinderVisible(prev => {
      const newVisibility = !prev;
      if (newVisibility) { // If will become visible
        bringFinderToFront();
      }
      return newVisibility;
    });
  }, [bringFinderToFront]);
  
  const handleDockFinderClick = useCallback(() => {
    if (!isFinderVisible) {
      setIsFinderVisible(true);
    }
    bringFinderToFront();
  }, [isFinderVisible, bringFinderToFront]);

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
