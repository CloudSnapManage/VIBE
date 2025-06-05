
'use client';

import React, { useState, useEffect, useRef, type MouseEvent as ReactMouseEvent, useCallback } from 'react';
import { XIcon, GripVerticalIcon } from 'lucide-react'; // Using X for close, GripVertical for potential resize handle
import { Textarea } from '@/components/ui/textarea';

interface StickyNoteWindowProps {
  id: string;
  initialContent: string;
  initialPosition: { x: number; y: number };
  initialSize: { width: number; height: number };
  zIndex: number;
  onClose: (id: string) => void;
  onDragStart: (e: ReactMouseEvent<HTMLDivElement>, id: string) => void;
  onContentChange: (id:string, content: string) => void;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onSizeChange: (id: string, size: { width: number; height: number }) => void;
  onBringToFront: (id: string) => void;
}

const MIN_WIDTH = 150;
const MIN_HEIGHT = 100;

const StickyNoteWindow: React.FC<StickyNoteWindowProps> = ({
  id,
  initialContent,
  initialPosition,
  initialSize,
  zIndex,
  onClose,
  onDragStart: bubbleDragStart,
  onContentChange,
  onPositionChange, // Will be called by DesktopArea after drag
  onSizeChange,
  onBringToFront,
}) => {
  const [content, setContent] = useState(initialContent);
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLDivElement>(null);

  const initialResizeMousePos = useRef<{ x: number; y: number } | null>(null);
  const initialResizeSize = useRef<{ width: number; height: number } | null>(null);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
    onContentChange(id, event.target.value);
  };

  const handleHeaderMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    onBringToFront(id);
    bubbleDragStart(e, id); // This will be caught by DesktopArea for dragging the window
  };

  const handleResizeMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Prevent triggering window drag
    onBringToFront(id);
    setIsResizing(true);
    initialResizeMousePos.current = { x: e.clientX, y: e.clientY };
    initialResizeSize.current = { ...initialSize }; // Capture current size from props
    document.addEventListener('mousemove', handleResizeMouseMove);
    document.addEventListener('mouseup', handleResizeMouseUp);
  };

  const handleResizeMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !initialResizeMousePos.current || !initialResizeSize.current) return;

    const dx = e.clientX - initialResizeMousePos.current.x;
    const dy = e.clientY - initialResizeMousePos.current.y;

    let newWidth = initialResizeSize.current.width + dx;
    let newHeight = initialResizeSize.current.height + dy;

    newWidth = Math.max(newWidth, MIN_WIDTH);
    newHeight = Math.max(newHeight, MIN_HEIGHT);
    
    onSizeChange(id, { width: newWidth, height: newHeight });
  }, [isResizing, id, onSizeChange]);

  const handleResizeMouseUp = useCallback(() => {
    setIsResizing(false);
    initialResizeMousePos.current = null;
    initialResizeSize.current = null;
    document.removeEventListener('mousemove', handleResizeMouseMove);
    document.removeEventListener('mouseup', handleResizeMouseUp);
  }, [handleResizeMouseMove]);

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResizeMouseMove);
      document.removeEventListener('mouseup', handleResizeMouseUp);
    };
  }, [handleResizeMouseMove, handleResizeMouseUp]);


  return (
    <div
      ref={noteRef}
      className="absolute bg-yellow-200/90 border border-yellow-400/50 rounded-lg shadow-lg flex flex-col overflow-hidden"
      style={{
        transform: `translate(${initialPosition.x}px, ${initialPosition.y}px)`,
        width: `${initialSize.width}px`,
        height: `${initialSize.height}px`,
        zIndex,
        cursor: 'default',
        minWidth: `${MIN_WIDTH}px`,
        minHeight: `${MIN_HEIGHT}px`,
      }}
      onClick={() => onBringToFront(id)}
      role="dialog"
      aria-label={`Sticky note ${id}`}
    >
      <header
        className="h-7 bg-yellow-300/80 px-2 py-1 flex items-center justify-between border-b border-yellow-400/30 cursor-grab active:cursor-grabbing"
        onMouseDown={handleHeaderMouseDown}
      >
        <span className="text-xs font-medium text-yellow-800/80 truncate">Sticky Note</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose(id);
          }}
          className="p-0.5 rounded hover:bg-yellow-400/50 text-yellow-700/80 hover:text-yellow-900"
          aria-label="Close sticky note"
        >
          <XIcon size={14} />
        </button>
      </header>
      <Textarea
        value={content}
        onChange={handleContentChange}
        placeholder="Type your note..."
        className="flex-grow w-full h-full resize-none border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 p-2 text-sm bg-yellow-200/0 text-yellow-900 placeholder-yellow-600/70"
        aria-label="Sticky note content"
      />
      <div
        ref={resizeRef}
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-end justify-end p-0.5 opacity-50 hover:opacity-100"
        onMouseDown={handleResizeMouseDown}
        title="Resize note"
      >
        <GripVerticalIcon size={10} className="text-yellow-700/70 rotate-45" />
      </div>
    </div>
  );
};

export default StickyNoteWindow;
