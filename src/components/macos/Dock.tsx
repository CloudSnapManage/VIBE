import React from 'react';
import DockItem from './DockItem';
import { FolderOpen, LayoutGrid, Globe2, MessageSquare, Mail, MapPin, Image as ImageIcon, Video, CalendarDays, Settings, Store } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const dockItems = [
  { name: 'Finder', icon: FolderOpen, action: () => console.log('Finder clicked') },
  { name: 'Launchpad', icon: LayoutGrid, action: () => console.log('Launchpad clicked') },
  { name: 'Safari', icon: Globe2, action: () => console.log('Safari clicked') },
  { name: 'Messages', icon: MessageSquare, action: () => console.log('Messages clicked') },
  { name: 'Mail', icon: Mail, action: () => console.log('Mail clicked') },
  { name: 'Maps', icon: MapPin, action: () => console.log('Maps clicked') },
  { name: 'Photos', icon: ImageIcon, action: () => console.log('Photos clicked') },
  { name: 'FaceTime', icon: Video, action: () => console.log('FaceTime clicked') },
  { name: 'Calendar', icon: CalendarDays, action: () => console.log('Calendar clicked') },
  { name: 'Settings', icon: Settings, action: () => console.log('Settings clicked') },
  { name: 'App Store', icon: Store, action: () => console.log('App Store clicked') },
];

const Dock: React.FC = () => {
  return (
    <footer 
      className="h-[72px] w-full flex justify-center items-center p-2 shrink-0"
      aria-label="Application Dock"
    >
      <div className="bg-dock-bg backdrop-blur-lg shadow-dock rounded-xl p-2 flex items-end space-x-2 h-[60px]">
        {dockItems.map((item, index) => (
          <React.Fragment key={item.name}>
            <DockItem name={item.name} icon={item.icon} onClick={item.action} />
            {/* Example separator placement */}
            {(item.name === 'Launchpad' || item.name === 'Calendar') && (
              <Separator orientation="vertical" className="h-10 bg-foreground/10 mx-1" />
            )}
          </React.Fragment>
        ))}
      </div>
    </footer>
  );
};

export default Dock;
