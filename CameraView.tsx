
import React, { useState } from 'react';

interface CameraViewProps {
  jobId: string;
  onClose: () => void;
  onCaptured: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ jobId, onClose, onCaptured }) => {
  const [shutterEffect, setShutterEffect] = useState(false);
  const [torch, setTorch] = useState(false);

  const capture = () => {
    setShutterEffect(true);
    setTimeout(() => {
      setShutterEffect(false);
      onCaptured();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col mx-auto max-w-md overflow-hidden">
      {/* Shutter Animation Overlay */}
      {shutterEffect && <div className="absolute inset-0 z-[110] bg-white transition-opacity duration-200"></div>}

      {/* Simulated Camera Feed */}
      <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800" 
          alt="Camera Preview" 
          className="w-full h-full object-cover opacity-60 grayscale-[0.3]"
        />
        
        {/* Viewfinder Brackets */}
        <div className="absolute inset-12 border-2 border-white/20 pointer-events-none rounded-2xl flex items-center justify-center">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white rounded-tl-lg"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white rounded-tr-lg"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white rounded-bl-lg"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white rounded-br-lg"></div>
          
          <div className="w-1 bg-white/40 h-8 rounded-full"></div>
          <div className="h-1 bg-white/40 w-8 rounded-full absolute"></div>
        </div>
      </div>

      <header className="p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/60 to-transparent">
        <button onClick={onClose} className="size-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
        <div className="bg-black/40 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
          <p className="text-[10px] font-bold tracking-widest uppercase opacity-70 mb-0.5">Proof Task</p>
          <p className="text-xs font-black">SAFETY EQUIPMENT CHECK</p>
        </div>
        <button onClick={() => setTorch(!torch)} className={`size-10 rounded-full backdrop-blur-md flex items-center justify-center ${torch ? 'bg-yellow-400 text-black' : 'bg-black/40 text-white'}`}>
          <span className="material-symbols-outlined text-2xl">{torch ? 'flashlight_on' : 'flashlight_off'}</span>
        </button>
      </header>

      <div className="mt-auto p-8 flex flex-col items-center gap-8 z-10 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center gap-12">
          <div className="size-12 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden border border-white/20">
             <img src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" alt="Last capture" />
          </div>
          
          <button 
            onClick={capture}
            className="size-20 rounded-full border-4 border-white p-1 bg-transparent active:scale-90 transition-transform"
          >
            <div className="w-full h-full rounded-full bg-white shadow-lg"></div>
          </button>
          
          <button className="size-12 rounded-full bg-white/10 flex items-center justify-center text-white">
            <span className="material-symbols-outlined">sync</span>
          </button>
        </div>
        
        <p className="text-xs font-medium text-white/60 tracking-wide uppercase">Capture proof for Job #{jobId}</p>
      </div>
    </div>
  );
};

export default CameraView;
