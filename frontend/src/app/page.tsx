'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Bot, Check, ChevronRight, CircleHelp, Clock3, CreditCard, Download, Landmark, Menu, MoreHorizontal, Plus, Search, Send, ShieldCheck, Sparkles, TrendingUp, Wallet, X } from 'lucide-react';
import { ChatMessage, NexusAPI } from '../lib/api';

const transactions = [
  { merchant: 'Whole Foods Market', category: 'Groceries', date: 'Today, 9:42 AM', amount: '-$86.42', status: 'Completed', icon: CreditCard },
  { merchant: 'Acme Payroll', category: 'Income', date: 'Aug 21, 8:00 AM', amount: '+$6,240.00', status: 'Completed', icon: ArrowDownLeft },
  { merchant: 'Atlas Air', category: 'Travel', date: 'Aug 20, 6:18 PM', amount: '-$412.80', status: 'Completed', icon: ArrowUpRight },
  { merchant: 'Rent transfer', category: 'Housing', date: 'Aug 18, 10:02 AM', amount: '-$2,100.00', status: 'Pending', icon: Landmark },
];

export default function Dashboard() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'ai', content: 'Good morning, Alexander. Your spending is 12% lower than this time last month.', timestamp: '9:05 AM' }]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  async function handleSendMessage() {
    if (!chatInput.trim() || isTyping) return;
    const content = chatInput.trim();
    setChatInput('');
    setMessages((current) => [...current, { role: 'user', content, timestamp: 'Now' }]);
    setIsTyping(true);
    try {
      const response = await NexusAPI.sendMessage(content);
      setMessages((current) => [...current, { role: 'ai', content: response.reply, timestamp: 'Now' }]);
    } catch {
      setMessages((current) => [...current, { role: 'ai', content: 'I could not reach the banking service. Please try again shortly.', timestamp: 'Now' }]);
    } finally { setIsTyping(false); }
  }

  return <div className="app-shell">
    <aside className={`sidebar ${isMobileNavOpen ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><Sparkles size={17} /></div><span>Nexus</span><span className="brand-badge">Private</span></div>
      <nav aria-label="Primary navigation" className="nav-list">
        <p className="nav-label">Workspace</p>
        <a className="nav-link active" href="#overview"><Wallet size={18} />Overview</a>
        <a className="nav-link" href="#transactions"><CreditCard size={18} />Transactions</a>
        <a className="nav-link" href="#investments"><TrendingUp size={18} />Investments</a>
        <a className="nav-link" href="#security"><ShieldCheck size={18} />Security</a>
        <p className="nav-label nav-label-spaced">Support</p>
        <button className="nav-link" onClick={() => setIsChatOpen(true)}><Bot size={18} />AI concierge</button>
        <button className="nav-link"><CircleHelp size={18} />Help center</button>
      </nav>
      <div className="sidebar-bottom"><div className="advisor-card"><div className="advisor-avatar">AM</div><div><strong>Alex Morgan</strong><span>Private client</span></div><MoreHorizontal size={17} /></div><button className="sign-out">Sign out</button></div>
    </aside>

    <main className="main-content">
      <header className="topbar"><button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setIsMobileNavOpen(true)}><Menu size={20} /></button><div className="breadcrumb"><span>Personal</span><ChevronRight size={15} /><strong>Overview</strong></div><div className="topbar-actions"><label className="search-field"><Search size={17} /><span className="sr-only">Search</span><input type="search" placeholder="Search your finances" /></label><button className="icon-button" aria-label="Notifications" title="Notifications"><span className="notification-dot" /><Clock3 size={19} /></button><button className="top-avatar" aria-label="Open profile">AM</button></div></header>
      {isMobileNavOpen && <button className="nav-scrim" aria-label="Close navigation" onClick={() => setIsMobileNavOpen(false)} />}
      <div className="content-wrap">
        <section className="page-intro" id="overview"><div><p className="eyebrow">Monday, August 24, 2026</p><h1>Good morning, Alexander.</h1><p className="intro-copy">A clear view of your money, with the details ready when you need them.</p></div><div className="intro-actions"><button className="button button-secondary"><Download size={16} />Statement</button><button className="button button-primary"><Plus size={17} />New transfer</button></div></section>
        <section className="metric-grid" aria-label="Account summary">
          <article className="summary-card summary-card-featured"><div className="card-heading"><span className="card-kicker">Total balance</span><button className="icon-button small" aria-label="Balance options"><MoreHorizontal size={17} /></button></div><div className="balance">$582,430<span>.15</span></div><div className="balance-meta"><span className="positive"><ArrowUpRight size={15} />$8,240.50 (1.43%)</span><span>vs. last month</span></div><div className="balance-chart" aria-label="Balance increased steadily over six months"><div className="chart-line" /><div className="chart-months"><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span></div></div></article>
          <article className="summary-card"><div className="card-heading"><span className="card-kicker">Available to spend</span><Wallet size={18} className="muted-icon" /></div><div className="small-balance">$124,500<span>.00</span></div><div className="progress-track"><div className="progress-value" /></div><div className="card-foot"><span>Daily account</span><span>82% available</span></div></article>
          <article className="summary-card"><div className="card-heading"><span className="card-kicker">Investments</span><TrendingUp size={18} className="muted-icon" /></div><div className="small-balance">$457,930<span>.15</span></div><div className="card-foot investment-foot"><span className="positive"><ArrowUpRight size={15} />8.1% YTD</span><span>View portfolio <ChevronRight size={14} /></span></div><div className="mini-bars" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /></div></article>
        </section>
        <section className="section-grid">
          <article className="panel transactions-panel" id="transactions"><div className="panel-header"><div><p className="eyebrow">Activity</p><h2>Recent transactions</h2></div><button className="text-button">View all <ChevronRight size={15} /></button></div><div className="transaction-list">{transactions.map((transaction) => { const Icon = transaction.icon; return <div className="transaction-row" key={transaction.merchant}><div className="transaction-icon"><Icon size={18} /></div><div className="transaction-details"><strong>{transaction.merchant}</strong><span>{transaction.category} · {transaction.date}</span></div><div className="transaction-amount"><strong className={transaction.amount.startsWith('+') ? 'positive' : ''}>{transaction.amount}</strong><span className={transaction.status === 'Pending' ? 'status pending' : 'status'}>{transaction.status === 'Pending' ? <Clock3 size={12} /> : <Check size={12} />}{transaction.status}</span></div></div>; })}</div></article>
          <article className="panel insights-panel" id="investments"><div className="panel-header"><div><p className="eyebrow">Nexus intelligence</p><h2>Worth knowing</h2></div><div className="insight-orb"><Sparkles size={18} /></div></div><div className="insight-copy"><h3>Your cash is working harder.</h3><p>Moving $15,000 from your daily account to your high-yield reserve could earn an estimated <strong>$612 more</strong> over the next year.</p></div><button className="button button-dark">Review suggestion <ArrowUpRight size={16} /></button><div className="insight-note"><ShieldCheck size={15} />Based on your 6-month cash flow</div></article>
        </section>
        <section className="bottom-grid" id="security"><article className="panel score-panel"><div><p className="eyebrow">Financial health</p><h2>Strong position</h2><p className="muted-copy">Your habits are building a resilient financial foundation.</p></div><div className="score-ring"><strong>842</strong><span>of 1000</span></div><div className="score-footer"><span><span className="score-dot" />Excellent</span><button className="text-button">See details <ChevronRight size={15} /></button></div></article><article className="panel security-panel"><div className="security-icon"><ShieldCheck size={22} /></div><div><p className="eyebrow">Account security</p><h2>Everything looks good</h2><p className="muted-copy">Last checked 4 minutes ago. No unusual activity detected.</p></div><button className="icon-button" aria-label="Security details"><ChevronRight size={18} /></button></article></section>
      </div>
    </main>

    <div className={`concierge ${isChatOpen ? 'concierge-open' : ''}`} role="dialog" aria-label="Nexus AI concierge" aria-hidden={!isChatOpen}><div className="concierge-header"><div className="concierge-title"><div className="bot-avatar"><Bot size={17} /></div><div><strong>AI concierge</strong><span>Here to help</span></div></div><button className="icon-button" aria-label="Close concierge" onClick={() => setIsChatOpen(false)}><X size={18} /></button></div><div className="messages" aria-live="polite">{messages.map((message, index) => <div className={`message ${message.role}`} key={`${message.timestamp}-${index}`}><p>{message.content}</p><span>{message.timestamp}</span></div>)}{isTyping && <div className="typing" aria-label="AI is typing"><i /><i /><i /></div>}<div ref={chatEndRef} /></div><form className="message-form" onSubmit={(event) => { event.preventDefault(); void handleSendMessage(); }}><label className="sr-only" htmlFor="concierge-input">Ask your concierge</label><input id="concierge-input" value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder="Ask about your finances" disabled={isTyping} /><button className="send-button" aria-label="Send message" disabled={!chatInput.trim() || isTyping}><Send size={16} /></button></form></div>
    <button className="concierge-trigger" aria-label={isChatOpen ? 'Close AI concierge' : 'Open AI concierge'} onClick={() => setIsChatOpen((open) => !open)}>{isChatOpen ? <X size={21} /> : <Bot size={21} />}<span>{isChatOpen ? 'Close' : 'Ask Nexus'}</span></button>
  </div>;
}