import React, { useState, useRef } from 'react';

export default function ImageSlider({ before, after, labelBefore = "Original", labelAfter = "Enhanced" }) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef(null);

  const handleMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.type.includes('touch') ? e.touches[0].pageX : e.pageX;
    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(Math.max(position, 0), 100));
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-square md:aspect-video rounded-2xl overflow-hidden cursor-ew-resize select-none shadow-2xl border border-stone-800 group"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      {/* After Image (Background) */}
      <img 
        src={after} 
        alt="After" 
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Before Image (Clipped Overlay) */}
      <div 
        className="absolute inset-0 h-full overflow-hidden border-r-2 border-white/30 z-10"
        style={{ width: `${sliderPos}%` }}
      >
        <img 
          src={before} 
          alt="Before" 
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: containerRef.current?.offsetWidth }}
        />
      </div>

      {/* Floating Labels */}
      <div className="absolute top-3 left-3 z-20 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-white border border-white/10">
        {labelBefore}
      </div>
      <div className="absolute top-3 right-3 z-20 px-2.5 py-1 bg-orange-600/80 backdrop-blur-md rounded-full text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-white border border-orange-400/20">
        {labelAfter}
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 z-30 flex items-center justify-center pointer-events-none"
        style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
      >
        <div className="w-0.5 h-full bg-white/50" />
        <div className="absolute w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-stone-900 group-hover:scale-110 transition-transform">
          <svg className="w-4 h-4 md:w-5 md:h-5 text-stone-900" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" transform="rotate(90 10 10)"/>
          </svg>
        </div>
      </div>
      
      {/* Hint overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-black/40 backdrop-blur-lg rounded-xl text-[10px] text-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Drag to compare
      </div>
    </div>
  );
}
