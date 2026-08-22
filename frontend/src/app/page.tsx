"use client";

import { useState } from "react";

export default function Home() {
  const [active, setActive] = useState("Overview");

  return (
    <div className="min-h-screen bg-[#07122a] text-[#e2e2e6]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-white/10 bg-[#07122a]/80 backdrop-blur-xl">
        <div className="p-6">
          <div className="text-xl font-bold tracking-tight text-[#00e5ff]">
            NEXUS
          </div>

          <div className="mt-1 text-xs tracking-[0.2em] text-[#8e9099]">
            BANK AI
          </div>
        </div>

        <nav className="mt-8 space-y-1 px-3">
          {[
            "Overview",
            "AI Assistant",
            "Accounts",
            "Investments",
            "Transactions",
            "Security",
          ].map((item) => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`w-full rounded-lg px-4 py-3 text-left text-sm transition ${
                active === item
                  ? "border-l-2 border-[#00e5ff] bg-[#334a50]/60 text-[#00e5ff]"
                  : "text-[#c4c6d0] hover:bg-white/5"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-4 right-4 rounded-xl border border-white/10 bg-[#1c2841]/40 p-4 backdrop-blur-xl">
          <div className="text-xs text-[#8e9099]">AI SYSTEM</div>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.7)]" />
            Quantum Core Active
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 min-h-screen px-8 pb-12 pt-8">
        {/* Top bar */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <div className="text-xs tracking-[0.2em] text-[#8e9099]">
              FINANCIAL INTELLIGENCE CENTER
            </div>

            <h1 className="mt-2 text-3xl font-semibold">
              Good evening, Aneek
            </h1>

            <p className="mt-2 text-sm text-[#c4c6d0]">
              Your financial intelligence center is ready.
            </p>
          </div>

          <div className="rounded-full border border-[#00e5ff]/30 bg-[#004e58]/40 px-4 py-2 text-xs text-[#97f0ff]">
            ● AI ONLINE
          </div>
        </header>

        {/* Metrics */}
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Metric
            title="NET WORTH"
            value="₹8,42,500"
            change="↑ 4.8% this month"
          />

          <Metric
            title="INVESTMENTS"
            value="₹3,21,400"
            change="↑ 12.4%"
          />

          <Metric
            title="AVAILABLE BALANCE"
            value="₹2,14,800"
            change="Savings ••••4921"
          />

          <div className="rounded-xl border border-white/10 bg-[#1c2841]/40 p-5 backdrop-blur-xl">
            <div className="text-xs tracking-wider text-[#8e9099]">
              FINANCIAL SCORE
            </div>

            <div className="mt-3 flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                <span className="text-xl font-semibold text-[#97f0ff]">
                  82
                </span>
              </div>

              <div>
                <div className="font-medium">Excellent</div>
                <div className="mt-1 text-xs text-[#8e9099]">
                  +6 points this month
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI section */}
        <section className="mt-6 grid gap-6 xl:grid-cols-2">
          {/* Quantum Core */}
          <div className="rounded-xl border border-white/10 bg-[#1c2841]/40 p-6 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs tracking-wider text-[#8e9099]">
                  QUANTUM AI CORE
                </div>

                <h2 className="mt-2 text-xl font-semibold">
                  Banking Intelligence
                </h2>
              </div>

              <span className="rounded-full bg-[#004e58] px-3 py-1 text-xs text-[#97f0ff]">
                ACTIVE
              </span>
            </div>

            <div className="flex min-h-[280px] items-center justify-center">
              <div className="relative flex h-48 w-48 items-center justify-center rounded-full border border-[#00e5ff]/50 shadow-[0_0_60px_rgba(0,229,255,0.25)]">
                <div className="absolute h-36 w-36 rounded-full border border-[#00e5ff]/30 shadow-[0_0_40px_rgba(0,229,255,0.2)]" />

                <div className="absolute h-24 w-24 rounded-full bg-[#00e5ff]/20 shadow-[0_0_40px_rgba(0,229,255,0.4)]" />

                <div className="z-10 text-center">
                  <div className="text-2xl font-bold text-[#97f0ff]">
                    AI
                  </div>
                  <div className="mt-1 text-[10px] tracking-widest text-[#8e9099]">
                    PROCESSING
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-[#030d25]/60 p-4">
              <div className="text-xs text-[#8e9099]">
                CURRENT INSIGHT
              </div>

              <p className="mt-2 text-sm text-[#c4c6d0]">
                Your investment allocation is performing above your
                monthly target. Consider maintaining your current
                diversification strategy.
              </p>
            </div>
          </div>

          {/* AI Insights */}
          <div className="rounded-xl border border-white/10 bg-[#1c2841]/40 p-6 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
            <div className="text-xs tracking-wider text-[#8e9099]">
              AI INSIGHTS
            </div>

            <h2 className="mt-2 text-xl font-semibold">
              Financial Intelligence
            </h2>

            <div className="mt-6 space-y-4">
              <Insight
                title="Cash Flow"
                text="Your monthly cash flow is healthy and trending upward."
              />

              <Insight
                title="Investment"
                text="Equity exposure is slightly below your recommended target."
              />

              <Insight
                title="Savings"
                text="You are on track to exceed your monthly savings goal."
              />

              <Insight
                title="Risk"
                text="Portfolio risk remains within your preferred range."
              />
            </div>

            <button className="mt-6 w-full rounded-lg bg-[#00e5ff] px-4 py-3 text-sm font-semibold text-[#00363d] shadow-[0_0_15px_rgba(0,229,255,0.3)] transition hover:brightness-110">
              OPEN AI FINANCIAL ADVISOR
            </button>
          </div>
        </section>

        {/* Recent activity */}
        <section className="mt-6 rounded-xl border border-white/10 bg-[#1c2841]/40 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs tracking-wider text-[#8e9099]">
                RECENT ACTIVITY
              </div>

              <h2 className="mt-2 text-xl font-semibold">
                Transaction Intelligence
              </h2>
            </div>

            <button className="text-xs text-[#00e5ff]">
              VIEW ALL
            </button>
          </div>

          <div className="mt-5 space-y-3">
            <Transaction
              name="Amazon"
              type="Card Payment"
              amount="-₹2,499"
            />

            <Transaction
              name="Salary Credit"
              type="Income"
              amount="+₹85,000"
            />

            <Transaction
              name="Zerodha"
              type="Investment"
              amount="-₹10,000"
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function Metric({
  title,
  value,
  change,
}: {
  title: string;
  value: string;
  change: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#1c2841]/40 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
      <div className="text-xs tracking-wider text-[#8e9099]">
        {title}
      </div>

      <div className="mt-4 text-2xl font-semibold">
        {value}
      </div>

      <div className="mt-2 text-xs text-[#97f0ff]">
        {change}
      </div>
    </div>
  );
}

function Insight({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#030d25]/50 p-4">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#00e5ff] shadow-[0_0_10px_rgba(0,229,255,0.6)]" />
        <div className="text-sm font-medium">{title}</div>
      </div>

      <p className="mt-2 text-sm leading-6 text-[#c4c6d0]">
        {text}
      </p>
    </div>
  );
}

function Transaction({
  name,
  type,
  amount,
}: {
  name: string;
  type: string;
  amount: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-[#030d25]/50 p-4">
      <div>
        <div className="text-sm font-medium">{name}</div>
        <div className="mt-1 text-xs text-[#8e9099]">{type}</div>
      </div>

      <div className="text-sm font-medium">{amount}</div>
    </div>
  );
}
