
'use client';

import React, { type MouseEvent as ReactMouseEvent } from 'react';
import TrafficLights from './TrafficLights';
import { Textarea } from '@/components/ui/textarea';
import { FileText } from 'lucide-react';

interface NotesWindowProps {
  isVisible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onDragStart: (e: ReactMouseEvent<HTMLDivElement>) => void;
  zIndex: number;
  noteContent: string;
  setNoteContent: (content: string) => void;
}

const NotesWindow: React.FC<NotesWindowProps> = ({
  isVisible,
  position,
  onClose,
  onMinimize,
  onMaximize,
  onDragStart,
  zIndex,
  noteContent,
  setNoteContent,
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="w-full max-w-md h-[350px] bg-window-bg rounded-xl shadow-macos flex flex-col overflow-hidden
                 border border-black/10 absolute"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: '50%', 
        top: '50%',
        marginLeft: '-14rem', // Half of max-w-md (28rem / 2)
        marginTop: '-175px', // Half of h-[350px]
        zIndex,
        cursor: 'default',
      }}
      role="dialog"
      aria-labelledby="notes-window-title"
      onClick={(e) => e.stopPropagation()}
    >
      <header
        className="h-9 bg-window-header-bg flex items-center px-3 border-b border-black/5 shrink-0 cursor-grab active:cursor-grabbing"
        onMouseDown={onDragStart}
      >
        <TrafficLights onClose={onClose} onMinimize={onMinimize} onMaximize={onMaximize} />
        <div className="flex-grow flex items-center justify-center text-sm font-medium text-foreground/80 select-none">
          <FileText size={16} className="mr-1.5 text-primary" />
          <span id="notes-window-title">Notes</span>
        </div>
        <div className="w-14"></div> {/* Spacer for traffic lights */}
      </header>
      <main className="flex-grow p-1 bg-background flex">
        <Textarea
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder="Type your notes here..."
          className="flex-grow w-full h-full resize-none border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 p-3 text-sm"
          aria-label="Note content"
        />
      </main>
    </div>
  );
};

export default NotesWindow;
