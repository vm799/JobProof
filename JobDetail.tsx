
import React from 'react';
import { JobStatus } from '../types';

interface JobDetailProps {
  jobId: string;
  onBack: () => void;
  onCapture: () => void;
}

const JobDetail: React.FC<JobDetailProps> = ({ jobId, onBack, onCapture }) => {
  return (
    <div className="flex flex-col min-h-screen pb-32">
      <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center p-4 justify-between">
          <button onClick={onBack} className="p-2 -ml-2"><span className="material-symbols-outlined">arrow_back</span></button>
          <div className="flex flex-col items-center">
            <h2 className="font-bold">Job #{jobId}</h2>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">In Progress</span>
          </div>
          <button className="p-2 -mr-2 text-slate-400"><span className="material-symbols-outlined">help</span></button>
        </div>
      </header>

      <main className="p-4 flex flex-col gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border overflow-hidden">
          <div className="h-32 bg-slate-200 relative">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsUeSpXtWbnpXZuNm48aTE1dSoX0xor2zFHV2ErNAIohKWsgouVoD9BHrGIZLosrkRf8n_T5iQQdtkUWX0rnfo6PTPkyUCOlQYbdH00P23nfd3if9duWSmtMS_fdm6t_m9IJkdWhkddVCK13tBm9PBu0F3AVoYExxHwnfxA1i8OIB2z9qAxy3zUVcmrRAoAOuYZjKPXJhg6SZizWPyEu3VueKkC8jdNCUaNyA3YqADm7mCxeZJFWF_vGPRcLbxSfPMT6AprO5ZDmnV" alt="Site" className="w-full h-full object-cover" />
            <span className="absolute top-3 right-3 bg-red-100 text-red-700 px-2 py-1 rounded text-[10px] font-bold uppercase">High Priority</span>
          </div>
          <div className="p-4">
            <h3 className="text-xl font-bold">Apex Industries</h3>
            <p className="text-sm text-slate-500">Building B, Unit 402</p>
            <div className="flex items-center justify-between mt-3">
              <p className="text-sm font-medium flex items-center gap-1 text-slate-600"><span className="material-symbols-outlined text-[18px]">location_on</span> 123 Industrial Way</p>
              <button className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">navigation</span> Navigate
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100">
           <div className="flex items-end justify-between mb-2">
             <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Progress</p>
               <p className="text-2xl font-black">33%</p>
             </div>
             <p className="text-xs font-bold text-slate-400">1 of 3 steps</p>
           </div>
           <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
             <div className="h-full bg-primary w-1/3 transition-all duration-500"></div>
           </div>
        </div>

        <h3 className="font-bold flex items-center gap-2">Proof Requirements <span className="material-symbols-outlined text-slate-400 text-[18px]">info</span></h3>

        <div className="flex flex-col gap-3">
          {/* Completed */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-emerald-100 opacity-70 flex items-center gap-4">
            <div className="size-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><span className="material-symbols-outlined text-[20px]">check</span></div>
            <div className="flex-1">
              <h4 className="font-bold line-through">Arrival Photo</h4>
              <p className="text-xs text-slate-400">Captured at 08:45 AM</p>
            </div>
            <div className="size-10 rounded-lg bg-slate-100 overflow-hidden">
               <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdlfMC6K6tO2-LeYNmLv7_9rtxZfxBv5cAr7dhVnu1V4ZEX_S-ExMQG2-T5UkN-Vy9ajTo0dKR6NOFL-2ecTsLBmLfKVfPIOU6kDZQgrJu1dXjfRnk9M9C-yMTnV0N15xIWL9fWBaVK4bisqYUXGTYRoVY7urXzM0l6Xg8ymTUDubxMa-UKvJKYiLjLxxh_0eFJM9VvIIWbDAFqCEumQvamwD1FrWPCeQbUGrdu_VQydzI066Vy5z3m5X2ETYkoAu-edcKcwCDnH8M" alt="Proof" className="w-full h-full object-cover" />
            </div>
          </div>
          {/* Active */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border-l-4 border-primary shadow-md flex items-center gap-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5"></div>
            <div className="size-8 rounded-full border-2 border-primary text-primary flex items-center justify-center relative z-10"><span className="material-symbols-outlined text-[18px]">camera_alt</span></div>
            <div className="flex-1 relative z-10">
              <div className="flex items-center gap-2">
                <h4 className="font-black">Safety Equipment</h4>
                <span className="bg-red-100 text-red-700 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">Required</span>
              </div>
              <p className="text-xs text-slate-500">Photo of PPE and workspace setup</p>
            </div>
            <button onClick={onCapture} className="size-8 text-slate-400 hover:text-primary relative z-10"><span className="material-symbols-outlined">chevron_right</span></button>
          </div>
          {/* Pending */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-transparent opacity-60 flex items-center gap-4">
            <div className="size-8 rounded-full border-2 border-slate-200 text-slate-300 flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">edit</span></div>
            <div className="flex-1">
              <h4 className="font-bold">Customer Signature</h4>
              <p className="text-xs text-slate-500">Sign-off on completed work</p>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 z-40 mx-auto max-w-md">
        <button onClick={onCapture} className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
          <span className="material-symbols-outlined">add_a_photo</span>
          Capture Evidence
        </button>
      </div>
    </div>
  );
};

export default JobDetail;
