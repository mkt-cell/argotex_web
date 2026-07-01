'use client';

import React, { useEffect, useState } from 'react';

export const HeroAnimation: React.FC = () => {
  const [currentFrame, setCurrentFrame] = useState(10);
  const [preloaded, setPreloaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const totalFrames = 91; // From 010 to 100

  useEffect(() => {
    let loaded = 0;
    const preloadList: HTMLImageElement[] = [];

    for (let i = 10; i <= 100; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/hero-frames/ezgif-frame-${frameNum}.png`;
      
      img.onload = () => {
        loaded++;
        setProgress(Math.round((loaded / totalFrames) * 100));
        if (loaded === totalFrames) {
          setPreloaded(true);
        }
      };

      img.onerror = () => {
        // Safe fallback if frame fails
        loaded++;
        setProgress(Math.round((loaded / totalFrames) * 100));
        if (loaded === totalFrames) {
          setPreloaded(true);
        }
      };

      preloadList.push(img);
    }
  }, []);

  // Animation Loop
  useEffect(() => {
    if (!preloaded) return;

    let frameId: number;
    let lastTime = 0;
    const fps = 20; // Butter smooth but paced loop
    const interval = 1000 / fps;
    let forward = true;

    const tick = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const elapsed = timestamp - lastTime;

      if (elapsed > interval) {
        lastTime = timestamp - (elapsed % interval);

        setCurrentFrame((prev) => {
          if (forward) {
            if (prev < 100) {
              return prev + 1;
            } else {
              forward = false;
              return prev - 1;
            }
          } else {
            if (prev > 10) {
              return prev - 1;
            } else {
              forward = true;
              return prev + 1;
            }
          }
        });
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [preloaded]);

  const currentFrameSrc = `/hero-frames/ezgif-frame-${String(currentFrame).padStart(3, '0')}.png`;

  if (!preloaded) {
    return (
      <div className="relative w-full h-[300px] sm:h-[450px] lg:h-[500px] bg-slate-100 rounded-2xl border border-slate-200/50 flex flex-col items-center justify-center gap-4 overflow-hidden shadow-inner">
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest animate-pulse">
            Loading System Architecture Simulation...
          </div>
          <div className="text-sm font-bold text-slate-600">{progress}%</div>
          <div className="w-48 h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
            <div 
              className="h-full bg-medical-teal transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[300px] sm:h-[450px] lg:h-[500px] overflow-hidden group flex items-center justify-center">
      {/* Live frame rendering */}
      <img
        src={currentFrameSrc}
        alt="Argotex Cleanroom Pipeline Machinery Integration Flow Animation"
        className="w-full h-full object-contain relative z-10 transition-transform duration-500 ease-out group-hover:scale-[1.02] select-none"
        loading="eager"
      />

      {/* Decorative dashboard overlay */}
      <div className="absolute top-0 left-0 z-20 bg-slate-900/90 text-white text-[9px] font-mono py-1.5 px-3 rounded flex items-center gap-1.5 backdrop-blur-xs select-none shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-validation-green animate-pulse"></span>
        <span>CAD CLEANROOM MACHINERY BUILD | FRAME {String(currentFrame).padStart(3, '0')} / 100</span>
      </div>
    </div>
  );
};
