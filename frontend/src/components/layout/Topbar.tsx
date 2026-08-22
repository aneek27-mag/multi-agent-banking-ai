"use client";

import { Bell, Search, ShieldCheck } from "lucide-react";

export default function Topbar() {
  return (
    <header className="fixed left-64 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-[#07122a]/80 px-8 backdrop-blur-xl">
      <div>
        <div className="text-sm text-slate-400">
          Financial Intelligence Center
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-[#101b33] px-3 py-2 md:flex">
          <Search size={16} className="text-slate-500" />
          <input
            placeholder="Search Nexus..."
            className="w-48 bg-transparent text-sm outline-none placeholder:text-slate-600"
          />
        </div>

        <button className="relative rounded-lg p-2 text-slate-400 hover:bg-[#1c2841] hover:text-white">
          <Bell size={19} />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-cyan-400" />
        </button>

        <div className="flex items-center gap-3 border-l border-white/10 pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#004e58] text-sm font-semibold text-[#97f0ff]">
            AJ
          </div>

          <div className="hidden md:block">
            <div className="text-sm font-medium">Aneek</div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <ShieldCheck size={11} />
              Verified
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
