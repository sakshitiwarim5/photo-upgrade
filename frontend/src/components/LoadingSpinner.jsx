// components/LoadingSpinner.jsx
// Animated loading indicator with progress bar and status message

import React from 'react';

const MESSAGES = [
  'INITIALIZING ENGINE...',
  'NEURAL UPSCALING...',
  'TEXTURE RECONSTRUCTION...',
  'NOISE REDUCTION...',
  'FINALIZING ASSET...',
];

export default function LoadingSpinner({ progress, status }) {
  const msgIndex = Math.floor((progress / 100) * (MESSAGES.length - 1));
  const message = MESSAGES[Math.min(msgIndex, MESSAGES.length - 1)];

  return (
    <div className="flex flex-col items-center gap-4 py-4 animate-fade-in">
      {/* Spinner rings */}
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border border-stone-800" />
        <div className="absolute inset-0 rounded-full border border-transparent border-t-orange-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
        </div>
      </div>

      {/* Status message */}
      <div className="text-center">
        <p className="font-display font-bold text-stone-200 text-xs tracking-widest">{message}</p>
        <p className="text-stone-500 text-[9px] mt-1 font-mono">{Math.round(progress)}%</p>
      </div>

      {/* Progress bar */}
      <div className="w-48 bg-stone-900 rounded-full h-1 overflow-hidden border border-white/5">
        <div
          className="h-full bg-orange-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
