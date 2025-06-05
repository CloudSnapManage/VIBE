'use client';

import React from 'react';
import MenuBar from './MenuBar';
import DesktopArea from './DesktopArea';
import Dock from './Dock';

const DesktopEnvironment: React.FC = () => {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden select-none">
      <MenuBar />
      <DesktopArea />
      <Dock />
    </div>
  );
};

export default DesktopEnvironment;
