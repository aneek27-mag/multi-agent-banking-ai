'use client';
/* eslint-disable @next/next/no-html-link-for-pages */

import { ReactNode, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Activity, AlertTriangle, ArrowUpRight, Bell, Bot, Check, CheckCircle2, ChevronDown, ChevronRight,
  Download, FileCheck2, LayoutDashboard, Loader2, LogOut, Menu, MessageSquareText, MonitorPlay,
  Network, RefreshCcw, Settings, ShieldAlert, Sparkles, UserCircle2, Users,
} from 'lucide-react';
import { kpis } from '../data/mockData';
import { ModulePlaceholderContent } from '../data/modulePlaceholders';
import { downloadReport, INTELLIGENCE_SCAN_STEPS, runIntelligenceScan } from '../services/analyticsService';
import { DashboardInsights, hydrateFromSession, useActivityFeed, useDashboardInsights } from '../state/demoStore';
import { showToast } from '../state/toastStore';
import { NavItem } from '../types/banking';
import { ExecutiveOverview } from './analytics/ExecutiveOverview';
import { GlobalSearch } from './GlobalSearch';

const navGroups: { label: string; items: NavItem[] }[] = [
  { label: 'Overview', items: [{ label: 'Dashboard', href: '/', icon: 'dashboard' }, { label: 'Customers', href: '/customers', icon: 'customers' }, { label: 'Customer 360', href: '/customers/CUS-20481', icon: 'wallet' }] },
  { label: 'AI Intelligence', items: [{ label: 'AI Assistant', href: '/assistant', icon: 'assistant' }, { label: 'Agents', href: '/agents', icon: 'workflow' }, { label: 'Analytics', href: '/analytics', icon: 'analytics' }] },
  { label: 'Customer Lifecycle', items: [{ label: 'Onboarding', href: '/onboarding', icon: 'kyc' }, { label: 'Engagement', href: '/engagement', icon: 'engagement' }] },
  { label: 'Risk & Governance', items: [{ label: 'Risk & Fraud', href: '/risk', icon: 'risk' }] },
  { label: 'Workspace', items: [{ label: 'Settings', href: '/settings', icon: 'settings' }] },
];

const iconMap = { dashboard: LayoutDashboard, assistant: Bot, customers: Users, wallet: UserCircle2, kyc: FileCheck2, workflow: Network, engagement: MessageSquareText, risk: ShieldAlert, analytics: Activity, settings: Settings };

/** Shared click-outside + Escape close behavior for the small header/panel dropdown menus. */
function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    function handleClick(event: MouseEvent) { if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false); }
    function handleEscape(event: KeyboardEvent) { if (event.key === 'Escape') setOpen(false); }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEscape);
    return () => { document.removeEventListener('mousedown', handleClick); document.removeEventListener('keydown', handleEscape); };
  }, [open]);
  return { open, setOpen, ref };
}

function WorkspaceSwitcher() {
  const { open, setOpen, ref } = useDropdown();
  return (
    <div className="menu-dropdown" ref={ref}>
      <button type="button" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <span className="workspace-avatar">AM</span>Acme Bank<ChevronDown size={14} />
      </button>
      {open && (
        <div className="menu-dropdown-panel align-left">
          <div className="menu-dropdown-item active"><Check size={13} />Acme Bank</div>
          <span className="menu-dropdown-note">Single workspace in this demo environment.</span>
        </div>
      )}
    </div>
  );
}

function UserMenu() {
  const { open, setOpen, ref } = useDropdown();
  return (
    <div className="menu-dropdown" ref={ref}>
      <button type="button" aria-label="User menu" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen((value) => !value)}><ChevronDown size={14} /></button>
      {open && (
        <div className="menu-dropdown-panel">
          <Link href="/settings" className="menu-dropdown-item" onClick={() => setOpen(false)}><Settings size={14} />Workspace settings</Link>
          <button
            type="button"
            className="menu-dropdown-item"
            onClick={() => { setOpen(false); showToast('Signed out of demo session', { description: 'This is a simulated environment — no real account was affected.', tone: 'info' }); }}
          >
            <LogOut size={14} />Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function AlertsMenu({ insights }: { insights: DashboardInsights }) {
  const { open, setOpen, ref } = useDropdown();
  return (
    <div className="menu-dropdown" ref={ref}>
      <button type="button" className="header-alert" aria-label="View alerts" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <span /> <Bell size={18} />
      </button>
      {open && (
        <div className="menu-dropdown-panel">
          <p className="menu-dropdown-title">Alerts</p>
          <Link href="/onboarding" className="menu-dropdown-item" onClick={() => setOpen(false)}>
            <ShieldAlert size={14} /><span><strong>{insights.humanReview} KYC cases</strong><small>Require human verification</small></span>
          </Link>
          <Link href="/analytics#engagement" className="menu-dropdown-item" onClick={() => setOpen(false)}>
            <Activity size={14} /><span><strong>{insights.decliningEngagement} customers</strong><small>Show declining digital engagement</small></span>
          </Link>
          <Link href="/analytics#risk" className="menu-dropdown-item" onClick={() => setOpen(false)}>
            <AlertTriangle size={14} /><span><strong>{insights.riskSignals} risk signals</strong><small>Flagged this period</small></span>
          </Link>
        </div>
      )}
    </div>
  );
}

export function BankingShell({ children, activePath = '/' }: { children: ReactNode; activePath?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => { hydrateFromSession(); }, []);
  const insights = useDashboardInsights();
  const activeGroup = navGroups.find((group) => group.items.some((item) => item.href === activePath))?.label ?? 'Overview';
  return (
    <div className="bank-shell">
      <aside className={`bank-sidebar ${mobileOpen ? 'bank-sidebar-open' : ''}`}>
        <div className="bank-brand"><span className="bank-brand-mark"><Sparkles size={16} /></span><span>Nexus</span><small>AI banking OS</small><span className="demo-badge">Demo</span></div>
        <div className="bank-workspace"><span>Workspace</span><WorkspaceSwitcher /></div>
        <nav className="bank-nav" aria-label="Main navigation">
          {navGroups.map((group) => (
            <div className="bank-nav-group" key={group.label}>
              <p>{group.label}</p>
              {group.items.map((item) => {
                const Icon = iconMap[item.icon as keyof typeof iconMap];
                return <a className={activePath === item.href ? 'bank-nav-link active' : 'bank-nav-link'} href={item.href} key={item.href} onClick={() => setMobileOpen(false)}><Icon size={16} />{item.label}</a>;
              })}
            </div>
          ))}
        </nav>
        <a className="demo-mode-link" href="/demo"><MonitorPlay size={16} />SIH Demo Mode</a>
        <div className="bank-user">
          <div className="user-avatar">AM</div>
          <div><strong>Arjun Mehta</strong><span>Relationship manager</span></div>
          <UserMenu />
        </div>
      </aside>
      <button className="bank-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} hidden={!mobileOpen} />
      <div className="bank-main">
        <header className="bank-header">
          <button className="mobile-nav-button" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
          <div className="bank-breadcrumb"><span>{activeGroup}</span><ChevronRight size={14} /><strong>{activePath === '/' ? 'Dashboard' : activePath.split('/')[1]?.replace(/-/g, ' ')}</strong></div>
          <div className="bank-header-actions">
            <GlobalSearch />
            <span className="ai-status-pill"><span className="status-pulse" />AI System Operational</span>
            <AlertsMenu insights={insights} />
            <div className="header-date">Monday, 24 Aug 2026</div>
          </div>
        </header>
        <main>{children}</main>
      </div>
      <a className="assistant-fab" href="/assistant"><Bot size={17} />Ask Nexus</a>
    </div>
  );
}

const GROWTH_DATA_12: { month: string; primary: number; secondary: number }[] = [
  { month: 'Sep', primary: 30, secondary: 20 },
  { month: 'Oct', primary: 34, secondary: 24 },
  { month: 'Nov', primary: 29, secondary: 22 },
  { month: 'Dec', primary: 38, secondary: 27 },
  { month: 'Jan', primary: 33, secondary: 25 },
  { month: 'Feb', primary: 41, secondary: 30 },
  { month: 'Mar', primary: 35, secondary: 24 },
  { month: 'Apr', primary: 43, secondary: 33 },
  { month: 'May', primary: 51, secondary: 42 },
  { month: 'Jun', primary: 59, secondary: 51 },
  { month: 'Jul', primary: 67, secondary: 60 },
  { month: 'Aug', primary: 75, secondary: 69 },
];
const GROWTH_DATA_6 = GROWTH_DATA_12.slice(6);

function PeriodSelector({ period, onChange }: { period: '6' | '12'; onChange: (period: '6' | '12') => void }) {
  const { open, setOpen, ref } = useDropdown();
  return (
    <div className="menu-dropdown" ref={ref}>
      <button type="button" className="period-button" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        {period === '6' ? 'Last 6 months' : 'Last 12 months'} <ChevronDown size={14} />
      </button>
      {open && (
        <div className="menu-dropdown-panel">
          <button type="button" className={`menu-dropdown-item ${period === '6' ? 'active' : ''}`} onClick={() => { onChange('6'); setOpen(false); }}>Last 6 months</button>
          <button type="button" className={`menu-dropdown-item ${period === '12' ? 'active' : ''}`} onClick={() => { onChange('12'); setOpen(false); }}>Last 12 months</button>
        </div>
      )}
    </div>
  );
}

function ActionCenterMenu({ onRefresh }: { onRefresh: () => void }) {
  const { open, setOpen, ref } = useDropdown();
  return (
    <div className="menu-dropdown" ref={ref}>
      <button type="button" className="more-button" aria-label="More actions" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen((value) => !value)}>•••</button>
      {open && (
        <div className="menu-dropdown-panel">
          <button type="button" className="menu-dropdown-item" onClick={() => { setOpen(false); onRefresh(); }}><RefreshCcw size={13} />Refresh list</button>
          <button
            type="button"
            className="menu-dropdown-item"
            onClick={() => { setOpen(false); downloadReport('30d'); showToast('Report exported', { description: 'nexus-banking-intelligence-30d.csv downloaded.' }); }}
          >
            <Download size={13} />Export CSV
          </button>
        </div>
      )}
    </div>
  );
}

type ScanState = 'idle' | 'scanning' | 'done';

export function DashboardView() {
  const agentActivity = useActivityFeed();
  const insights = useDashboardInsights();
  const [period, setPeriod] = useState<'6' | '12'>('6');
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [scanStepIndex, setScanStepIndex] = useState(-1);
  const growthData = period === '6' ? GROWTH_DATA_6 : GROWTH_DATA_12;

  async function handleScan() {
    if (scanState === 'scanning') return;
    setScanState('scanning');
    setScanStepIndex(0);
    const result = await runIntelligenceScan((index) => setScanStepIndex(index));
    setScanStepIndex(INTELLIGENCE_SCAN_STEPS.length);
    setScanState('done');
    showToast('Intelligence Scan Complete', {
      description: `✓ ${result.customersAnalyzed.toLocaleString('en-IN')} customers analyzed · ✓ ${result.engagementSignals} engagement signals identified · ✓ ${result.productOpportunities} product opportunities identified · ✓ ${result.riskSignals} risk signals reviewed. Scan completed successfully.`,
    });
    setTimeout(() => setScanState('idle'), 3000);
  }

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div>
          <p className="dashboard-eyebrow"><span className="status-pulse" />AI command center / simulated environment</p>
          <h1>Good morning, Arjun.</h1>
          <p>Here is what your customer portfolio needs today.</p>
        </div>
        <div className="hero-actions">
          <button className="outline-action" onClick={() => downloadReport('30d')}><Download size={15} />Export report</button>
          <button type="button" className="primary-action" onClick={handleScan} disabled={scanState === 'scanning'}>
            {scanState === 'scanning' ? <Loader2 size={16} className="ai-spin" /> : <Sparkles size={16} />}
            {scanState === 'scanning' ? 'Scanning…' : scanState === 'done' ? 'Scan complete' : 'Run intelligence scan'}
          </button>
        </div>
      </section>

      {scanStepIndex >= 0 && (
        <div className="scan-progress" aria-live="polite">
          {INTELLIGENCE_SCAN_STEPS.map((step, index) => {
            const state = index < scanStepIndex || scanStepIndex >= INTELLIGENCE_SCAN_STEPS.length ? 'done' : index === scanStepIndex ? 'active' : '';
            return (
              <span className={`scan-progress-step ${state}`} key={step.label}>
                {state === 'done' ? <Check size={11} /> : state === 'active' ? <Loader2 size={11} className="ai-spin" /> : <ChevronRight size={11} />}
                {step.label}
              </span>
            );
          })}
        </div>
      )}

      <ExecutiveOverview />

      <section className="kpi-grid" aria-label="Portfolio performance">
        <div className="kpi-intro"><p>Portfolio pulse</p><strong>Today’s signal</strong><span>Across 248,392 customers</span></div>
        {kpis.map((kpi) => <article className={`kpi-card ${kpi.tone}`} key={kpi.label}><span>{kpi.label}</span><strong>{kpi.value}</strong><small>{kpi.delta} <ArrowUpRight size={12} /></small></article>)}
      </section>

      <section className="intelligence-strip">
        <div className="intelligence-icon"><Sparkles size={19} /></div>
        <div className="intelligence-copy">
          <p>AI intelligence</p>
          <h2>Your next best opportunities are ready.</h2>
          <span>The platform found {insights.highIntent} customers with a high probability of adopting premium products.</span>
        </div>
        <div className="intelligence-numbers">
          <div><strong>{insights.highIntent}</strong><span>high intent</span></div>
          <div><strong>{insights.decliningEngagement}</strong><span>declining engagement</span></div>
          <div><strong>{insights.humanReview}</strong><span>human review</span></div>
        </div>
        <Link className="intelligence-action" href="/onboarding">Review queue <ChevronRight size={16} /></Link>
      </section>

      <section className="dashboard-panel ai-brief-panel">
        <div className="ai-brief-heading"><span className="ai-brief-icon"><Bot size={16} /></span><div><p>AI daily brief</p><h2>What Nexus intelligence found today</h2></div></div>
        <ul className="ai-brief-list">
          <li>{insights.highIntent} customers show high product adoption potential.</li>
          <li>{insights.decliningEngagement} customers show declining engagement.</li>
          <li>{insights.humanReview} KYC cases require human review.</li>
        </ul>
        <a className="ai-brief-cta" href="/assistant"><Sparkles size={13} />Ask AI</a>
      </section>

      <section className="dashboard-columns">
        <article className="dashboard-panel performance-panel">
          <div className="panel-heading">
            <div><p>Customer growth</p><h2>Acquisition performance</h2></div>
            <PeriodSelector period={period} onChange={setPeriod} />
          </div>
          <div className="chart-legend"><span><i className="legend-dot green" />New customers</span><span><i className="legend-dot pale" />Digital adoption</span></div>
          <div className="bar-chart" aria-label={`Customer growth increased over the last ${period === '6' ? 'six' : 'twelve'} months`}>
            {growthData.map((point) => (
              <div className="bar-column" key={point.month}>
                <div className="bars"><i style={{ height: `${point.primary}%` }} /><i style={{ height: `${point.secondary}%` }} /></div>
                <span>{point.month}</span>
              </div>
            ))}
          </div>
          <div className="chart-footer"><span><strong>1,284</strong> new customers this month</span><span className="positive-text">+18.2% vs last month</span></div>
        </article>
        <article className="dashboard-panel attention-panel">
          <div className="panel-heading">
            <div><p>Action center</p><h2>Needs your attention</h2></div>
            <ActionCenterMenu onRefresh={() => showToast('Action center refreshed', { description: 'Showing the latest simulated signals.', tone: 'info' })} />
          </div>
          <div className="attention-list">
            <Link href="/onboarding">
              <span className="attention-mark red"><ShieldAlert size={15} /></span>
              <p><strong>{insights.humanReview} KYC cases</strong><small>Require human verification</small></p>
              <ChevronRight size={15} />
            </Link>
            <Link href="/analytics#engagement">
              <span className="attention-mark amber"><Activity size={15} /></span>
              <p><strong>{insights.decliningEngagement} customers</strong><small>Show declining digital engagement</small></p>
              <ChevronRight size={15} />
            </Link>
            <Link href="/customers">
              <span className="attention-mark blue"><MessageSquareText size={15} /></span>
              <p><strong>26 warm leads</strong><small>Ready for a personalized offer</small></p>
              <ChevronRight size={15} />
            </Link>
          </div>
          <Link className="view-queue" href="/onboarding">Open action queue <ArrowUpRight size={14} /></Link>
        </article>
      </section>

      <section className="dashboard-columns bottom-panels">
        <article className="dashboard-panel activity-panel">
          <div className="panel-heading"><div><p>Agent activity</p><h2>What AI is doing now</h2></div><a href="/agents">View workflow <ChevronRight size={14} /></a></div>
          <div className="agent-list">
            {agentActivity.map((activity, index) => (
              <div className="agent-row" key={`${activity.action}-${activity.time}-${index}`}>
                <span className={`agent-status ${activity.status.toLowerCase().replace(' ', '-')}`}><Bot size={14} /></span>
                <p><strong>{activity.agent}</strong><span>{activity.action} · {activity.customer}</span></p>
                <time>{activity.time}</time>
              </div>
            ))}
          </div>
        </article>
        <article className="dashboard-panel customers-panel">
          <div className="panel-heading"><div><p>Customer signals</p><h2>Portfolio segments</h2></div><a href="/customers">Open customers <ChevronRight size={14} /></a></div>
          <div className="segment-rows">
            <div><span className="segment-name"><i className="segment-dot green" />High value</span><strong>24,812</strong><span>+8.4%</span></div>
            <div><span className="segment-name"><i className="segment-dot blue" />Emerging affluent</span><strong>68,430</strong><span>+12.1%</span></div>
            <div><span className="segment-name"><i className="segment-dot amber" />At risk</span><strong>1,842</strong><span className="negative-text">-8.4%</span></div>
          </div>
          <div className="panel-note"><CheckCircle2 size={14} />{insights.lastScanLabel}</div>
        </article>
      </section>
    </div>
  );
}

export function ModulePlaceholder({ title, description, cta }: ModulePlaceholderContent) {
  return (
    <div className="module-page">
      <p className="dashboard-eyebrow"><span className="status-pulse" />Nexus workspace / demo environment</p>
      <h1>{title}</h1>
      <p>{description}</p>
      <div className="module-placeholder">
        <span className="module-placeholder-icon"><Sparkles size={22} /></span>
        <strong>This workspace is next on the platform roadmap.</strong>
        <span>The typed data model and navigation are already wired in, so this view can come online without changing the rest of the product.</span>
        {cta && <Link className="outline-action" href={cta.href}>{cta.label}<ArrowUpRight size={13} /></Link>}
      </div>
    </div>
  );
}
