
import React from 'react';

interface ReviewQueueProps {
  onBack: () => void;
}

const ReviewQueue: React.FC<ReviewQueueProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col min-h-screen pb-24">
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#101922]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-600 dark:text-slate-400">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold">Pending Approval</h1>
          <span className="ml-auto bg-primary text-white text-[10px] font-black px-2 py-1 rounded-full">5 NEW</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="relative aspect-square bg-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600" 
                alt="Evidence" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                 <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1">
                   <span className="material-symbols-outlined text-[14px]">location_on</span> San Francisco, CA
                 </span>
                 <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1">
                   <span className="material-symbols-outlined text-[14px]">schedule</span> 10:24 AM Oct 24
                 </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">Compressor Seal Repair</h3>
                  <p className="text-slate-500 text-sm">Job #4029 • Mike Ross</p>
                </div>
                <div className="size-12 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-3xl">verified_user</span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl mb-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Worker Notes</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  "Applied industrial sealant and pressure tested. Verified no leaks at 120 PSI. Ready for full system restart."
                </p>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 py-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-slate-50 transition-colors">
                  Request Info
                </button>
                <button className="flex-1 py-4 rounded-xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-colors">
                  Reject
                </button>
              </div>
              
              <button className="w-full mt-4 py-4 rounded-xl bg-primary text-white font-bold text-lg shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all">
                Approve & Mark Complete
              </button>
            </div>
          </div>
          
          <div className="text-center py-8">
            <p className="text-slate-400 text-sm font-medium">Swipe to see next pending item</p>
            <div className="flex justify-center gap-1 mt-3">
              <div className="h-1.5 w-6 rounded-full bg-primary"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReviewQueue;
