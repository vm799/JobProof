
import React from 'react';

interface LandingPageProps {
  onSignIn: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSignIn }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col overflow-hidden relative">
      {/* Abstract Background Decoration */}
      <div className="absolute top-[-10%] right-[-20%] w-[80%] h-[50%] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-20%] w-[60%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 p-8 pt-16 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-16">
          <div className="size-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50">
            <span className="material-symbols-outlined text-white text-2xl font-bold">verified</span>
          </div>
          <span className="text-2xl font-black tracking-tighter">JOBPROOF</span>
        </div>

        <div className="flex-1 flex flex-col justify-center gap-6">
          <div className="space-y-4">
            <h1 className="text-5xl font-black leading-[1.1] tracking-tight">
              Field work, <br/>
              <span className="text-primary italic">verified</span> in <br/>
              real-time.
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-[280px]">
              Eliminate disputes with automated GPS and AI-powered visual evidence.
            </p>
          </div>

          <div className="space-y-4 mt-8">
            <div className="flex items-center gap-4 text-sm font-bold text-slate-300">
              <span className="material-symbols-outlined text-primary">check_circle</span>
              Visual Proof-of-Work
            </div>
            <div className="flex items-center gap-4 text-sm font-bold text-slate-300">
              <span className="material-symbols-outlined text-primary">check_circle</span>
              Geo-Fenced Verification
            </div>
            <div className="flex items-center gap-4 text-sm font-bold text-slate-300">
              <span className="material-symbols-outlined text-primary">check_circle</span>
              Automated Compliance
            </div>
          </div>
        </div>

        <div className="mt-auto py-12 flex flex-col gap-4">
          <button 
            onClick={onSignIn}
            className="w-full py-5 bg-primary hover:bg-blue-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-blue-500/30 transition-all active:scale-95"
          >
            Launch Terminal
          </button>
          <p className="text-center text-slate-500 text-sm font-medium">
            Used by over 500+ field service teams worldwide.
          </p>
        </div>
      </div>
      
      {/* Decorative Image Mask */}
      <div className="absolute bottom-0 right-0 w-32 opacity-10">
        <span className="material-symbols-outlined text-[200px]">construction</span>
      </div>
    </div>
  );
};

export default LandingPage;
