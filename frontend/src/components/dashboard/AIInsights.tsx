import { ArrowUpRight, BrainCircuit, ShieldCheck } from "lucide-react";

const insights = [
  {
    title: "Spending increased",
    text: "Discretionary spending is 12% higher this month.",
  },
  {
    title: "Portfolio risk is low",
    text: "Your current asset allocation remains within your target risk band.",
  },
  {
    title: "Investment opportunity",
    text: "Your idle balance may support a diversified investment allocation.",
  },
];

export default function AIInsights() {
  return (
    <div className="glass rounded-lg p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs tracking-wider text-slate-500">
            AI INSIGHTS
          </div>
          <div className="mt-1 text-lg font-semibold">Financial Intelligence</div>
        </div>

        <BrainCircuit size={20} className="text-cyan-400" />
      </div>

      <div className="mt-5 space-y-3">
        {insights.map((insight) => (
          <div
            key={insight.title}
            className="rounded-lg border border-white/5 bg-[#101b33] p-4"
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              <ShieldCheck size={15} className="text-cyan-400" />
              {insight.title}
            </div>

            <div className="mt-2 text-xs leading-5 text-slate-400">
              {insight.text}
            </div>

            <button className="mt-3 flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-200">
              Explore
              <ArrowUpRight size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
