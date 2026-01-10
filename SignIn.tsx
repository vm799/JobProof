
import React from 'react';
import { UserRole } from '../types';

interface SignInProps {
  onSignIn: (role: UserRole) => void;
  onBack: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onSignIn, onBack }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col p-8">
      <button onClick={onBack} className="self-start p-2 -ml-2 mb-8">
        <span className="material-symbols-outlined text-slate-400">arrow_back</span>
      </button>

      <div className="mb-12">
        <h1 className="text-4xl font-black tracking-tight mb-2">Welcome Back.</h1>
        <p className="text-slate-500">Sign in to your organization to continue.</p>
      </div>

      <div className="flex flex-col gap-4">
        <button 
          onClick={() => onSignIn(UserRole.TECHNICIAN)}
          className="group relative flex items-center gap-4 p-6 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-primary transition-all text-left bg-white dark:bg-slate-800 shadow-sm"
        >
          <div className="size-14 rounded-full bg-blue-50 dark:bg-blue-900/30 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-3xl">engineering</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">Field Technician</h3>
            <p className="text-sm text-slate-500">Complete jobs and submit proof</p>
          </div>
          <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">chevron_right</span>
        </button>

        <button 
          onClick={() => onSignIn(UserRole.MANAGER)}
          className="group relative flex items-center gap-4 p-6 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-primary transition-all text-left bg-white dark:bg-slate-800 shadow-sm"
        >
          <div className="size-14 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">Field Operations</h3>
            <p className="text-sm text-slate-500">Manage team and review evidence</p>
          </div>
          <span className="material-symbols-outlined text-slate-300 group-hover:text-indigo-600 transition-colors">chevron_right</span>
        </button>
      </div>

      <div className="mt-auto py-8">
        <div className="relative flex items-center justify-center mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
          </div>
          <span className="relative bg-white dark:bg-slate-900 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Enterprise Auth</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-sm">
            <img src="https://www.svgrepo.com/show/355037/google.svg" className="size-4" alt="Google" /> Google
          </button>
          <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-sm">
            <img src="https://www.svgrepo.com/show/448234/microsoft.svg" className="size-4" alt="Microsoft" /> Azure AD
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
