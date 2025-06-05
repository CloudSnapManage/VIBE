
import React from 'react';

interface TrafficLightsProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
}

const TrafficLights: React.FC<TrafficLightsProps> = ({ onClose, onMinimize, onMaximize }) => {
  const lightBaseClasses = "w-3 h-3 rounded-full flex items-center justify-center group";
  const iconBaseClasses = "w-1.5 h-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-100";

  return (
    <div className="flex space-x-2">
      <button aria-label="Close window" onClick={(e) => { e.stopPropagation(); onClose(); }} className={`${lightBaseClasses} bg-traffic-light-close`}>
        <svg className={iconBaseClasses} viewBox="0 0 6 6" aria-hidden="true" fill="currentColor" color="#4d0000">
          <path d="M0 0L6 6M6 0L0 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
        </svg>
      </button>
      <button aria-label="Minimize window" onClick={(e) => { e.stopPropagation(); onMinimize(); }} className={`${lightBaseClasses} bg-traffic-light-minimize`}>
        <svg className={iconBaseClasses} viewBox="0 0 8 2" aria-hidden="true" fill="currentColor" color="#663300">
          <rect width="8" height="2" rx="1"></rect>
        </svg>
      </button>
      <button aria-label="Maximize window" onClick={(e) => { e.stopPropagation(); onMaximize(); }} className={`${lightBaseClasses} bg-traffic-light-maximize`}>
         <svg className={iconBaseClasses} viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" color="#003300">
            <path d="M1.5 6.5L6.5 1.5M1.5 1.5H5.5M1.5 1.5V5.5M6.5 6.5H2.5M6.5 6.5V2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
};

export default TrafficLights;
