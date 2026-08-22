export default function Sidebar() {
  return (
    <nav className="fixed left-0 top-0 h-screen flex-col w-64 border-r border-white/10 bg-surface-dim/80 backdrop-blur-xl z-50 shadow-[0_0_15px_rgba(0,218,243,0.1)] hidden md:flex">
      {/* Header */}
      <div className="p-6 flex flex-col gap-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-fixed-dim/20 flex items-center justify-center border border-primary-fixed-dim overflow-hidden relative">
            <span className="material-symbols-outlined text-primary-fixed-dim absolute">account_circle</span>
          </div>
          <div>
            <h1 className="font-headline-md text-xl font-bold tracking-tighter text-primary-fixed-dim">NEXUS BANK AI</h1>
            <p className="font-label-sm text-on-surface-variant uppercase tracking-widest text-[10px]">AI-Powered Finance</p>
          </div>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-2">
        <a className="flex items-center gap-3 px-4 py-3 bg-secondary-container/30 text-primary-fixed-dim border-l-4 border-primary-fixed-dim rounded-r-lg font-label-md" href="#">
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
          <span>Accounts</span>
        </a>
        {['AI Assistant', 'Transfers', 'Investments', 'Security'].map((item, i) => (
          <a key={i} className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary-fixed-dim hover:bg-surface-variant/50 transition-colors rounded-lg font-label-md" href="#">
            <span className="material-symbols-outlined text-[20px]">
              {item === 'AI Assistant' ? 'smart_toy' : item === 'Transfers' ? 'swap_horiz' : item === 'Investments' ? 'trending_up' : 'verified_user'}
            </span>
            <span>{item}</span>
          </a>
        ))}
      </div>
      
      {/* Footer / CTA */}
      <div className="p-6 mt-auto">
        <button className="w-full py-3 px-4 bg-gradient-to-r from-primary-fixed-dim/80 to-tertiary-fixed-dim/80 hover:from-primary-fixed-dim hover:to-tertiary-fixed-dim text-on-primary font-label-md rounded-lg flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,218,243,0.3)] transition-all duration-300">
          <span className="material-symbols-outlined text-[18px]">bolt</span>
          Upgrade to Quantum
        </button>
      </div>
    </nav>
  );
}