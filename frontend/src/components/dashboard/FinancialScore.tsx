export default function FinancialScore() {
  return (
    <div className="glass rounded-lg p-5">
      <div className="text-xs font-medium tracking-wider text-slate-500">
        AI FINANCIAL SCORE
      </div>

      <div className="mt-5 flex items-center justify-center">
        <div className="flex h-32 w-32 items-center justify-center rounded-full border-[8px] border-[#004e58] shadow-[0_0_25px_rgba(0,229,255,0.25)]">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#00e5ff]">87</div>
            <div className="text-[10px] tracking-widest text-slate-500">
              /100
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <div className="text-sm font-medium text-[#97f0ff]">OPTIMAL</div>
        <div className="mt-1 text-xs text-slate-500">
          Based on your financial profile
        </div>
      </div>
    </div>
  );
}
