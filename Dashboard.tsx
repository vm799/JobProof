
import React from 'react';

interface DashboardProps {
  onReviewJob: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onReviewJob }) => {
  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-[#101922]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full border border-gray-200 dark:border-gray-700">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgqvDkTj8BMpWdxV6QvQpLAKmKwaC7ELf7lA-QbAnO6IVnZYmBZnQXPHelKyAnUkiVNZXkViYHCrnxj2rdL669NkLGoQP030_4SxqfogBG1ocjTm9W1jzOKSv9j3ZdMpNVk0P6bKKhJZn3Axwnx1QaGpeM1TxHzFU2on46eB5NqcyoLMFkN8bR0VoIj2AXfTVpd7tNSkqBIxAjGMD6jYLeDgK_z9wGMUMqLohsWgm183fY9wh11o2WVxDg2ZAymER8r1bun_x2Y2Uw" alt="Sarah" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Tue, Oct 24</p>
              <h1 className="text-base font-bold leading-tight">Good Morning, Sarah</h1>
            </div>
          </div>
          <button className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900"></span>
          </button>
        </div>
      </header>

      <main className="p-4 flex flex-col gap-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[18px]">engineering</span> Active Jobs
            </div>
            <p className="text-3xl font-black text-primary">12</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-amber-100 dark:border-amber-900/40 shadow-sm ring-1 ring-amber-500/10">
            <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[18px]">rate_review</span> Pending
            </div>
            <p className="text-3xl font-black text-orange-500">5</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span> Done Today
            </div>
            <p className="text-3xl font-black">8</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[18px]">group</span> Team
            </div>
            <p className="text-3xl font-black">8<span className="text-lg font-medium text-slate-400">/10</span></p>
          </div>
        </div>

        {/* Review Queue */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Proof Review Queue</h2>
            <button className="text-sm font-semibold text-primary">See all (5)</button>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">HVAC Repair - Unit 4B</h3>
                <p className="text-xs text-slate-500">Job #4092 • 14 mins ago</p>
              </div>
              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wider rounded">Urgent</span>
            </div>
            <div className="p-4 flex gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="size-8 rounded-full overflow-hidden">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIP265ebbW1SjVc2Mo93JdtS-hyPMuF_tUqsowgS6u1eqHEnTVVhKnetbVs-7SDoEd3HGVUwQWqOgjwfm-fnZlzUzFk4YxAW0wjFOe4YLG14lTyYfQj2jkeN5DBn-yXRmwfo7zsc_G850eld7QmOKzcf1MQKAqCQHg9O3nX1ukPqldEeJZ-7SyL9E9en7ykB7vbbL6pxH4w6Wum6VicQ22ZCJ-V6_zrhz4YI__JnMs9mqWU6fqn8jC7Gm4hIATDinYg5jZ_BJnEPoh" alt="Mike" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold">Mike Ross</p>
                    <p className="text-slate-500">Technician</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 italic">"Replaced the compressor fan. System running at optimal pressure."</p>
              </div>
              <div className="shrink-0 size-20 rounded-lg overflow-hidden border border-slate-200">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5yvYN3cZ-VpxlpLeN_8R34KmDnpW5nAyTD4m7CHtS9Xkl_hNWt1D-X4sEEMH3vJltMvQsvl3onmB0cKwHQHJeem8pTsFnL1qdknlhrkIPCaSvEyC6WpQswgtZGzMj8SWs2xnDTl8QSb3WUIRGO_ro6pPDt-NZfgQkjZCUGnncZfsQBCRhAo02ofGEvWE7rcwVIdN_knhOgMnrI-UEWz5hBSpErgKFfY8PxsEvW7F_V4OHkupdqpcPC2x8uwqwHEd_BjDWVKuSdCjM" alt="HVAC" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="px-4 pb-4 flex gap-3">
              <button className="flex-1 py-2 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-white rounded-lg font-bold text-sm">Reject</button>
              <button 
                onClick={() => onReviewJob('4092')}
                className="flex-[2] py-2 bg-primary text-white rounded-lg font-bold text-sm shadow-md shadow-blue-500/20"
              >
                Approve
              </button>
            </div>
          </div>
        </section>

        {/* Team Status */}
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-bold">Team Status</h2>
          <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
            {[
              { name: 'John Doe', loc: 'On Site (15m)', status: 'ACTIVE', color: 'bg-green-500' },
              { name: 'Sarah Jones', loc: 'Traveling', status: 'ON_SITE', color: 'bg-yellow-500' },
              { name: 'Robert Fox', loc: 'Idle', status: 'OFFLINE', color: 'bg-slate-400' }
            ].map((tech, i) => (
              <div key={i} className="flex items-center justify-between p-4 border-b last:border-0 border-slate-50 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="size-10 bg-slate-200 rounded-full"></div>
                    <span className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-white dark:border-slate-800 ${tech.color}`}></span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">{tech.name}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      {tech.loc}
                    </p>
                  </div>
                </div>
                <button className="text-primary p-2">
                  <span className="material-symbols-outlined">chat_bubble</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
