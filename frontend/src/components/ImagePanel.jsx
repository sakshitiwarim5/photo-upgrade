// components/ImagePanel.jsx
// Shows an image with label, loading shimmer, and download button

import React from 'react';

export default function ImagePanel({ label, src, isLoading, badge, onDownload }) {
  return (
    <div className="flex flex-col gap-3 animate-fade-in">
      {/* Panel header */}
      <div className="flex items-center justify-between px-1">
        <span className="font-display font-bold text-stone-500 text-[10px] uppercase tracking-widest">
          {label}
        </span>
        {badge && (
          <span className="badge-glow bg-orange-500/10 border border-orange-500/20 text-orange-400
            text-[9px] font-mono px-2 py-0.5 rounded-full uppercase tracking-tighter">
            {badge}
          </span>
        )}
      </div>

      {/* Image area */}
      <div className="relative group bg-stone-900 border border-stone-800/50 aspect-square md:aspect-video rounded-3xl overflow-hidden shadow-inner flex items-center justify-center">
        {isLoading ? (
          <div className="w-full h-full shimmer-bg" />
        ) : src ? (
          <img
            src={src}
            alt={label}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center gap-4 text-stone-800">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-[9px] uppercase font-bold tracking-[0.2em] text-stone-700">
              Awaiting Source
            </p>
          </div>
        )}
      </div>

      {/* Download button */}
      {src && !isLoading && onDownload && (
        <button
          onClick={onDownload}
          className="btn-primary !bg-stone-100 !text-stone-900 !py-3 !text-xs !rounded-2xl mt-2 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Asset
        </button>
      )}
    </div>
  );
}
