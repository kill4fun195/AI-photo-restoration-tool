import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

interface ComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
}

const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ beforeImage, afterImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      setSliderPosition(percentage);
    }
  }, []);

  const onMouseDown = () => { isDragging.current = true; };
  const onMouseUp = () => { isDragging.current = false; };
  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) handleMove(e.clientX);
  };

  const onTouchStart = () => { isDragging.current = true; };
  const onTouchEnd = () => { isDragging.current = false; };
  const onTouchMove = (e: React.TouchEvent) => {
    if (isDragging.current) handleMove(e.touches[0].clientX);
  };

  // Global mouse up to catch drags outside component
  useEffect(() => {
    const handleGlobalMouseUp = () => { isDragging.current = false; };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  return (
    <div 
      className="relative w-full h-full select-none overflow-hidden rounded-lg bg-bg-primary shadow-2xl group"
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchMove={onTouchMove}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* After Image (Background) */}
      <img 
        src={afterImage} 
        alt="Restored" 
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
      />
      
      {/* Label After */}
      <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded text-xs backdrop-blur-sm z-10">
        AFTER
      </div>

      {/* Before Image (Clipped) */}
      <div 
        className="absolute inset-0 overflow-hidden pointer-events-none border-r-2 border-accent-primary"
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
          src={beforeImage} 
          alt="Original" 
          className="absolute inset-0 w-full h-full object-contain max-w-none"
          // We need to match the parent container dimensions exactly here
          style={{ width: containerRef.current?.offsetWidth, height: containerRef.current?.offsetHeight }}
        />
        
        {/* Label Before */}
        <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded text-xs backdrop-blur-sm z-10">
          BEFORE
        </div>
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute inset-y-0 w-10 -ml-5 flex items-center justify-center cursor-ew-resize z-20"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="w-8 h-8 rounded-full bg-accent-primary border-2 border-white flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
            <ChevronsLeftRight className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );
};

export default ComparisonSlider;