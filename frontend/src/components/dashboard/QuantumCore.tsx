export default function QuantumCore() {
  return (
    <div className="glass relative overflow-hidden rounded-lg p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.12),transparent_55%)]" />

      <div className="relative">
        <div className="text-xs tracking-wider text-slate-500">
          QUANTUM AI CORE
        </div>

        <div className="flex min-h-[260px] items-center justify-center">
          <div className="relative flex h-40 w-40 items-center justify-center rounded-full border border-cyan-400/40 shadow-[0_0_50px_rgba(0,229,255,0.2)]">
            <div className="absolute h-28 w-28 rounded-full border border-cyan-400/30 animate-pulse" />

            <div className="h-16 w-16 rounded-full bg-[#004e58] shadow-[0_0_35px_rgba(0,229,255,0.5)]" />

            <span className="absolute text-xs font-semibold tracking-widest text-cyan-100">
              AI
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-cyan-300">
          <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#00e5ff]" />
          ACTIVE
        </div>
      </div>
    </div>
  );
}
