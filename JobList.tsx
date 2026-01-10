
import React from 'react';
import { JobStatus } from '../types';

interface JobListProps {
  onSelectJob: (id: string) => void;
}

const JobList: React.FC<JobListProps> = ({ onSelectJob }) => {
  const jobs = [
    { 
      id: '4921', 
      title: 'Acme Corp HQ', 
      address: '1200 Industrial Way, Building B', 
      status: JobStatus.IN_PROGRESS, 
      priority: 'HIGH',
      time: '09:00 AM - 11:00 AM',
      distance: '2.4 mi away',
      actionRequired: true
    },
    { 
      id: '4922', 
      title: 'Residential - Smith', 
      address: '45 Maple Drive, Apt 4B', 
      status: JobStatus.IN_PROGRESS, 
      priority: 'MEDIUM',
      time: '11:30 AM',
      est: '1h'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen pb-24">
      <header className="sticky top-0 z-20 bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center p-4 justify-between">
          <div className="size-10 rounded-full overflow-hidden bg-slate-200">
             <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDLXeYcRH3UOmacgQa6ZjYhdHVQ4yiH-f11ov2meUHK1w2pfxixwTa6GpDVrAdq54c6oi60G-ErzPk7f1bLNCwwCFe5SguOS9oJDxr4l_j5N3ztqTwlgPVIurJOROr748Ji1jjnd1yvjOagelrq_g1PFKezaOOGGTkpETahWwkBmwPUi51NCcUMDcCaaiisCVtBH6GJrCcwEp9GfToCGZlx8Y20MC6MrrGK00l7pw7K7BvPTYB2yXByRolTZ4vfN6RKbNC1OVxDp7e" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-lg font-bold flex-1 text-center">My Jobs</h2>
          <button className="p-2 text-slate-500"><span className="material-symbols-outlined">filter_list</span></button>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/10 py-2 border-y border-emerald-100 dark:border-emerald-900/20 text-center">
          <p className="text-emerald-700 dark:text-emerald-400 text-xs font-bold">Online • Last synced 2m ago</p>
        </div>
      </header>

      <main className="p-4 flex flex-col gap-6">
        {/* Day Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 -mx-4 px-4 snap-x">
          {['Today', 'Tomorrow', 'Oct 26', 'Oct 27'].map((day, idx) => (
            <button 
              key={day} 
              className={`snap-start px-5 py-2 rounded-full text-sm font-semibold transition-all ${idx === 0 ? 'bg-primary text-white shadow-md' : 'bg-white dark:bg-slate-800 border border-slate-200 text-slate-500'}`}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">Today, Oct 24</h3>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">3 Tasks</span>
        </div>

        <div className="flex flex-col gap-4">
          {jobs.map(job => (
            <div 
              key={job.id} 
              className={`bg-white dark:bg-slate-800 rounded-xl shadow-md border overflow-hidden ${job.actionRequired ? 'border-orange-200 ring-1 ring-orange-100' : 'border-slate-100'}`}
            >
              {job.actionRequired && (
                <div className="relative h-32 bg-slate-200 overflow-hidden">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEwBrUQ8kFpl8JPWfVOnWxGvnF81z9XkHkH8tQp_D6DNhCgbc25NFq1DzN5eDo1i5fdrmQPupOUL5zNzw-7Ouvq5v5s5KYye-pAZKcln5BDxJRL_uH2wOSqqFuxSxCxIPOgGvCwlHCRQvsOupeZUKklvYQwql9hC8ycorkVOJZ4rfeeIXcwZxPbx7OYTFessz0YRLVHqBnQyDpOsW4Tn57inU2K5epIVrBSBneO8aYpv4rv_3EjZHs4bZCsDJRkVuklDJP_TVpY2Yr" alt="Job" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-orange-500 text-white px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 shadow-sm uppercase tracking-wide">
                      <span className="material-symbols-outlined text-[14px]">warning</span> Action Required
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-4 text-white">
                    <h4 className="text-xl font-bold">{job.title}</h4>
                  </div>
                </div>
              )}
              
              <div className="p-4 flex flex-col gap-3">
                {!job.actionRequired && <h4 className="text-lg font-bold">{job.title}</h4>}
                
                <div className="flex items-start gap-3">
                  <div className={`mt-1 size-8 rounded-full flex items-center justify-center shrink-0 ${job.actionRequired ? 'bg-orange-50 text-orange-600' : 'bg-slate-50 text-slate-400'}`}>
                    <span className="material-symbols-outlined text-[20px]">location_on</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm leading-tight">{job.address}</p>
                    {job.distance && <p className="text-xs text-slate-500 mt-0.5">San Francisco • {job.distance}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-11">
                  <div className="bg-slate-50 dark:bg-slate-700/50 px-2 py-1 rounded text-xs font-semibold text-slate-600 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">schedule</span> {job.time}
                  </div>
                </div>

                <div className="mt-2 pt-3 border-t border-slate-50 dark:border-slate-700 flex gap-3">
                  <button 
                    onClick={() => onSelectJob(job.id)}
                    className="flex-1 py-3 bg-primary text-white rounded-lg font-bold text-sm shadow-md shadow-blue-500/10 active:scale-[0.98] transition-all"
                  >
                    Start Job
                  </button>
                  <button className="size-12 rounded-lg bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <span className="material-symbols-outlined">call</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      <button className="fixed bottom-24 right-5 size-14 rounded-2xl bg-primary text-white shadow-lg shadow-blue-500/40 flex items-center justify-center active:scale-95 transition-all">
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </div>
  );
};

export default JobList;
