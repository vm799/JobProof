
import React from 'react';
import { UserRole } from '../types';

interface NavigationProps {
  activeTab: string;
  role: UserRole;
  onNavigate: (screen: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, role, onNavigate }) => {
  const isTech = role === UserRole.TECHNICIAN;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-safe pt-2 mx-auto max-w-md">
      <div className="flex justify-around items-end h-16">
        <button 
          onClick={() => onNavigate(isTech ? 'jobs' : 'dashboard')}
          className={`flex flex-col items-center gap-1 w-full ${activeTab === 'jobs' || activeTab === 'dashboard' ? 'text-primary' : 'text-slate-400'}`}
        >
          <span className={`material-symbols-outlined text-[26px] ${activeTab === 'jobs' || activeTab === 'dashboard' ? 'filled' : ''}`}>
            {isTech ? 'work' : 'dashboard'}
          </span>
          <span className="text-[10px] font-bold">{isTech ? 'My Jobs' : 'Overview'}</span>
        </button>

        <button 
          onClick={() => onNavigate('map')}
          className={`flex flex-col items-center gap-1 w-full text-slate-400`}
        >
          <span className="material-symbols-outlined text-[26px]">map</span>
          <span className="text-[10px] font-medium">Map</span>
        </button>

        {!isTech && (
          <div className="relative -top-6">
            <button className="flex items-center justify-center size-14 rounded-full bg-primary text-white shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-colors">
              <span className="material-symbols-outlined text-3xl">add</span>
            </button>
          </div>
        )}

        <button 
          onClick={() => onNavigate('team')}
          className={`flex flex-col items-center gap-1 w-full text-slate-400`}
        >
          <span className="material-symbols-outlined text-[26px]">groups</span>
          <span className="text-[10px] font-medium">Team</span>
        </button>

        <button 
          onClick={() => onNavigate('settings')}
          className={`flex flex-col items-center gap-1 w-full ${activeTab === 'settings' ? 'text-primary' : 'text-slate-400'}`}
        >
          <span className={`material-symbols-outlined text-[26px] ${activeTab === 'settings' ? 'filled' : ''}`}>settings</span>
          <span className="text-[10px] font-medium">Settings</span>
        </button>
      </div>
      <div className="h-[env(safe-area-inset-bottom)]"></div>
    </nav>
  );
};

export default Navigation;
