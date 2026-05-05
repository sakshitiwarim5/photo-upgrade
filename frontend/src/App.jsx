// App.jsx — AI Photo Upgrader Main Component
// Premium, Editorial Aesthetic with Orange Accents

import React, { useState, useCallback } from 'react';
import UploadZone from './components/UploadZone';
import ImagePanel from './components/ImagePanel';
import ImageSlider from './components/ImageSlider';
import LoadingSpinner from './components/LoadingSpinner';
import { useEnhancer } from './hooks/useEnhancer';

export default function App() {
  const [originalFile, setOriginalFile] = useState(null);
  const [originalPreview, setOriginalPreview] = useState(null);
  const [removeBackground, setRemoveBackground] = useState(false);

  const { status, enhancedUrl, error, progress, enhance, reset, isMock } = useEnhancer();

  // ── Handle file selection ──────────────────────────────────────────────
  const handleFileSelect = useCallback((file) => {
    setOriginalFile(file);
    const url = URL.createObjectURL(file);
    setOriginalPreview(url);
    reset();
  }, [reset]);

  // ── Trigger enhancement ────────────────────────────────────────────────
  const handleEnhance = useCallback(() => {
    if (!originalFile) return;
    enhance(originalFile, removeBackground);
  }, [originalFile, removeBackground, enhance]);

  // ── Download enhanced image ────────────────────────────────────────────
  const handleDownload = useCallback(async () => {
    if (!enhancedUrl) return;

    try {
      let blob;
      if (enhancedUrl.startsWith('data:')) {
        const res = await fetch(enhancedUrl);
        blob = await res.blob();
      } else {
        const res = await fetch(enhancedUrl);
        blob = await res.blob();
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `enhanced-${originalFile?.name || 'image.png'}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(enhancedUrl, '_blank');
    }
  }, [enhancedUrl, originalFile]);

  const handleReset = () => {
    setOriginalFile(null);
    setOriginalPreview(null);
    reset();
  };

  const isProcessing = status === 'uploading' || status === 'enhancing';
  const isDone = status === 'done';
  const isError = status === 'error';

  return (
    <div className="min-h-screen relative overflow-x-hidden text-stone-100 font-body">

      {/* ── Background Glow ───────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-600/10 blur-[150px] rounded-full animate-pulse-soft" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-800/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-16">

        {/* ── Header ────────────────────────────────────────────────── */}
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 
            rounded-full px-3 py-1 mb-6 badge-glow">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-orange-300 text-[9px] font-mono tracking-widest uppercase">
              Pro AI Enhancement · 4K
            </span>
          </div>
          <h1 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight 
            bg-gradient-to-b from-white via-white to-stone-500 bg-clip-text text-transparent
            leading-tight mb-4">
            Refine Your Perspective.
          </h1>
          <p className="text-stone-400 text-sm md:text-base max-w-lg mx-auto leading-relaxed font-light">
            Professional-grade AI image upscaling. Transform low-res captures into 
            stunning high-definition assets in seconds.
          </p>
        </header>

        {/* ── Main Interface ────────────────────────────────────────────── */}
        <main className="animate-slide-up">
          <div className="glass-card overflow-hidden">
            
            {!originalPreview && (
              <div className="p-5 md:p-10 max-w-3xl mx-auto text-center">
                <p className="font-display font-medium text-stone-500 text-[9px] uppercase tracking-[0.2em] mb-5">
                  Upload Source Asset
                </p>
                <UploadZone onFileSelect={handleFileSelect} disabled={isProcessing} />
                
                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { 
                      title: '4× Upscale', 
                      desc: 'Neural reconstruction', 
                      icon: (
                        <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      )
                    },
                    { 
                      title: 'Studio Quality', 
                      desc: 'Texture recovery', 
                      icon: (
                        <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )
                    },
                    { 
                      title: 'Intelligent', 
                      desc: 'Noise reduction',
                      icon: (
                        <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      )
                    },
                  ].map((f, i) => (
                    <div key={i} className="text-left p-4 rounded-xl bg-stone-800/20 border border-white/5">
                      <div className="mb-3">{f.icon}</div>
                      <h3 className="font-display font-bold text-stone-200 text-[11px] mb-1">{f.title}</h3>
                      <p className="text-stone-600 text-[10px] leading-relaxed">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {originalPreview && (
              <div className="p-3 md:p-6">
                {/* Control Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-800/50">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handleReset}
                      disabled={isProcessing}
                      className="p-2 bg-stone-800/40 hover:bg-stone-800 text-stone-400 hover:text-white rounded-lg border border-white/5 transition-all"
                      title="New Project"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                    <div>
                      <h2 className="font-display font-bold text-[10px] md:text-[11px] tracking-widest uppercase text-stone-400">Asset Processor</h2>
                      <p className="text-stone-500 text-[9px] font-mono mt-0.5 truncate max-w-[100px]">
                        {originalFile?.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => !isProcessing && setRemoveBackground(!removeBackground)}
                      className={`flex items-center gap-2 px-2.5 py-1 rounded-md text-[9px] font-bold transition-all border
                        ${removeBackground 
                          ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' 
                          : 'bg-stone-800/30 border-white/5 text-stone-500 hover:text-stone-300'}`}
                    >
                      Remove BG
                    </button>

                    <button 
                      onClick={handleEnhance}
                      disabled={isProcessing || isDone}
                      className="btn-primary flex items-center gap-2 py-2 px-5 !text-[11px] !rounded-xl"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          Processing
                        </>
                      ) : isDone ? (
                        <>Asset Enhanced</>
                      ) : (
                        <>Enhance Asset</>
                      )}
                    </button>
                  </div>
                </div>

                {/* Error State */}
                {isError && (
                  <div className="mb-8 p-6 bg-red-500/5 border border-red-500/20 rounded-3xl flex items-start gap-4 animate-fade-in">
                    <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-red-400 text-sm">Processing Error</h4>
                      <p className="text-red-500/60 text-xs mt-1 leading-relaxed">{error}</p>
                      <button onClick={handleEnhance} className="mt-3 text-red-400 text-xs font-bold underline hover:text-red-300 transition-colors">
                        Retry Operation
                      </button>
                    </div>
                  </div>
                )}

                {/* Main Viewport */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8">
                    {isDone ? (
                      <div className="animate-fade-in">
                        <ImageSlider before={originalPreview} after={enhancedUrl} />
                      </div>
                    ) : (
                      <div className="relative group">
                         <ImagePanel 
                          src={originalPreview} 
                          label="Input" 
                          isLoading={isProcessing}
                          progress={progress}
                        />
                        {isProcessing && (
                          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-stone-900/40 backdrop-blur-sm rounded-3xl p-10">
                            <LoadingSpinner progress={progress} status={status} />
                            <p className="mt-6 font-display font-bold text-white text-sm animate-pulse">
                              Reconstructing asset via Neural Network...
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Sidebar Info */}
                  <div className="lg:col-span-4 flex flex-col gap-4">
                    <div className="p-5 bg-stone-800/10 border border-white/5 rounded-[1.5rem]">
                      <h3 className="font-display font-bold text-stone-500 text-[9px] uppercase tracking-widest mb-4">Asset Intelligence</h3>
                      <div className="space-y-3">
                        {[
                          { label: 'Scale Factor', value: '4.0x' },
                          { label: 'AI Model', value: 'Real-ESRGAN' },
                          { label: 'Noise Filter', value: 'Subtractive' },
                          { label: 'Status', value: isDone ? 'Complete' : isProcessing ? 'Processing' : 'Pending', highlight: isDone },
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-stone-600">{item.label}</span>
                            <span className={item.highlight ? 'text-orange-400' : 'text-stone-400'}>{item.value}</span>
                          </div>
                        ))}
                      </div>

                      {isDone && (
                        <div className="mt-6 pt-5 border-t border-stone-800">
                          <button 
                            onClick={handleDownload}
                            className="w-full btn-primary !bg-stone-100 !text-stone-900 !py-2.5 !text-[11px] !rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-white/5"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Export Asset
                          </button>
                        </div>
                      )}
                    </div>

                    {isMock && (
                      <div className="p-5 bg-orange-500/5 border border-orange-500/10 rounded-[1.5rem] animate-fade-in">
                        <h4 className="text-orange-400 font-bold text-[9px] uppercase tracking-widest mb-1.5 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                          Demo Mode
                        </h4>
                        <p className="text-orange-400/60 text-[10px] leading-relaxed">
                          Replicate credits are empty. System is operating in Mock Mode for demonstration.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        <footer className="mt-16 flex flex-col items-center gap-4 animate-fade-in opacity-40 hover:opacity-100 transition-opacity">
          <div className="h-px w-12 bg-stone-800" />
          <p className="text-stone-600 text-[8px] font-mono tracking-widest uppercase">
            © 2026 AI PHOTO UPGRADER · NEURAL ENGINE V2
          </p>
        </footer>
      </div>
    </div>
  );
}
