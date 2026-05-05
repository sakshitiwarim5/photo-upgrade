import React, { useCallback, useState } from 'react';

export default function UploadZone({ onFileSelect, disabled }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file);
    }
  }, [onFileSelect, disabled]);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  }, [onFileSelect]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative group cursor-pointer
        border-2 border-dashed rounded-[1.5rem] p-8 md:p-16
        transition-all duration-500 ease-out
        ${isDragOver 
          ? 'border-orange-500 bg-orange-500/5 scale-[0.99] shadow-2xl shadow-orange-500/10' 
          : 'border-stone-800 bg-stone-900/40 hover:border-stone-700 hover:bg-stone-800/30'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      
      <div className="flex flex-col items-center text-center">
        <div className={`
          w-12 h-12 rounded-2xl mb-6 flex items-center justify-center
          transition-all duration-500 group-hover:scale-110 group-hover:rotate-3
          ${isDragOver ? 'bg-orange-500 text-white' : 'bg-stone-800 text-stone-400'}
        `}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
          </svg>
        </div>
        
        <h3 className="text-lg md:text-xl font-display font-bold text-stone-100 mb-2">
          Drop asset here
        </h3>
        <p className="text-stone-500 text-xs max-w-[200px] mx-auto leading-relaxed">
          JPG, PNG or WebP <br />
          Max 20MB
        </p>
        
        <div className="mt-8 px-5 py-2 bg-stone-800/50 group-hover:bg-stone-800 rounded-full text-[9px] font-mono tracking-widest uppercase text-stone-400 group-hover:text-stone-200 transition-colors">
          or click to browse
        </div>
      </div>
    </div>
  );
}
