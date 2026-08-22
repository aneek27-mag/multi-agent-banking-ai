"use client";

import {
  LayoutDashboard,
  WalletCards,
  ArrowLeftRight,
  TrendingUp,
  Landmark,
  Globe2,
  Sparkles,
  ShieldCheck,
  ScrollText,
  Settings,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Accounts", icon: WalletCards },
  { label: "Payments", icon: ArrowLeftRight },
  { label: "Investments", icon: TrendingUp },
  { label: "Demat", icon: Landmark },
  { label: "Forex", icon: Globe2 },
];

const secondary = [
  { label: "AI Assistant", icon: Sparkles },
  { label: "Security", icon: ShieldCheck },
  { label: "Audit Log", icon: ScrollText },
  { label: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10 bg-[#07122a]/90 backdrop-blur-xl">
      <div className="flex h-full flex-col p-4">
        <div className="mb-8 px-3 py-4">
          <div className="text-xl font-bold tracking-tight text-[#00e5ff]">
            NEXUS
          </div>
          <div className="text-xs font-medium tracking-[0.25em] text-slate-400">
            BANK AI
          </div>
        </div>

        <nav className="space-y-1">
          {navigation.map((item, index) => {
            const Icon = item.icon;
            const active = index === 0;

            return (
              <button
                key={item.label}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
                  active
                    ? "border-l-2 border-[#00e5ff] bg-[#334a50] text-[#97f0ff]"
                    : "border-l-2 border-transparent text-slate-400 hover:bg-[#1c2841] hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="my-6 border-t border-white/10" />

        <nav className="space-y-1">
          {secondary.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                className="flex w-full items-center gap-3 rounded-lg border-l-2 border-transparent px-3 py-3 text-sm text-slate-400 transition hover:bg-[#1c2841] hover:text-white"
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto rounded-lg border border-white/10 bg-[#101b33] p-3">
          <div className="text-xs text-slate-500">SYSTEM STATUS</div>
          <div className="mt-2 flex items-center gap-2 text-sm text-[#97f0ff]">
            <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#00e5ff]" />
            All systems operational
          </div>
        </div>
      </div>
    </aside>
  );
}

