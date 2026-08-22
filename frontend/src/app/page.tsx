'use client';

import { useState, useEffect, useRef } from 'react';
import { NexusAPI, ChatMessage } from '../lib/api';
import Sidebar from '../components/layout/Sidebar';

export default function Dashboard() {
  // Nexus Score Animation State
  const [animatedScore, setAnimatedScore] = useState(0);
  const targetScore = 842;

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'ai', 
      content: "Welcome back, Alexander. I've analyzed your recent TSLA purchase. Would you like a risk assessment?", 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ]);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isChatOpen]);

  // Animate the Nexus Score on load
  useEffect(() => {
    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setAnimatedScore(Math.floor((targetScore / steps) * currentStep));
      if (currentStep >= steps) {
        setAnimatedScore(targetScore);
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  // Handle sending messages to the backend
  const handleSendMessage = async () => {
    if (!chatInput.trim() || isTyping) return;
    
    const newUserMsg: ChatMessage = {
      role: 'user',
      content: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    // Optimistically add user message and set typing state
    setMessages(prev => [...prev, newUserMsg]);
    setChatInput('');
    setIsTyping(true);
    
    try {
      const res = await NexusAPI.sendMessage(newUserMsg.content);
      
      const newAiMsg: ChatMessage = {
        role: 'ai',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, newAiMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      // Optional: Add an error message to the chat if the backend fails
      setMessages(prev => [...prev, { role: 'ai', content: "Error: Connection to Quantum Core lost.", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="font-sans mesh-bg min-h-screen overflow-x-hidden selection:bg-[#00daf3] selection:text-[#00363d]">
      <Sidebar />
      
      <main className="md:ml-64 min-h-screen flex flex-col relative z-10">
        {/* TopAppBar */}
        <header className="flex justify-between items-center px-8 py-4 sticky top-0 z-40 bg-[#07122a]/60 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-6 flex-1">
            <div className="relative w-full max-w-md hidden md:block group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-[#bac9cc] group-focus-within:text-[#00daf3] transition-colors">search</span>
              <input className="w-full bg-[#2a344e]/30 border border-white/10 rounded-full py-2 pl-10 pr-4 text-[#d9e2ff] text-sm focus:outline-none focus:border-[#00daf3] focus:bg-[#2a344e]/60 transition-all placeholder:text-[#bac9cc]/50 shadow-inner" placeholder="Query Quantum AI..." type="text"/>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-[#bac9cc] hover:text-[#00daf3] bg-[#2a344e]/20 hover:bg-[#2a344e]/50 relative transition-all hover:scale-110">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#00daf3] rounded-full shadow-[0_0_8px_#00daf3] animate-pulse"></span>
            </button>
            <div className="w-10 h-10 rounded-full border border-[#00daf3]/30 overflow-hidden cursor-pointer hover:border-[#00daf3] hover:shadow-[0_0_15px_rgba(0,218,243,0.3)] transition-all ml-2">
              <img alt="User Profile" className="w-full h-full object-cover" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander&backgroundColor=07122a" />
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full">
          {/* Hero Section */}
          <section className="glass-panel rounded-xl overflow-hidden relative flex flex-col md:flex-row items-center group hover:border-white/20 transition-colors">
            <div className="p-8 md:p-12 md:w-1/2 z-10 flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d1bcff]/10 border border-[#d1bcff]/30 w-fit">
                <span className="material-symbols-outlined text-[#d1bcff] text-[14px]">psychology</span>
                <span className="font-mono text-xs text-[#d1bcff] uppercase tracking-widest">AI Core Active</span>
              </div>
              <h2 className="text-5xl text-[#d9e2ff] leading-tight font-bold">Welcome back, <br/><span className="text-gradient-cyan">Alexander</span>.</h2>
              <p className="text-[#bac9cc]">Your AI is continuously optimizing your wealth across global markets.</p>
            </div>
            <div className="md:w-1/2 h-64 md:h-auto absolute right-0 top-0 bottom-0 opacity-40 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-[rgba(42,52,78,0.4)] to-transparent z-10"></div>
              <div className="w-full h-full bg-[#00daf3]/5 flex items-center justify-center">
                 <div className="w-48 h-48 rounded-full border border-[#00daf3]/20 animate-[spin_10s_linear_infinite] flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border border-[#d1bcff]/30 animate-[spin_7s_linear_infinite_reverse]"></div>
                 </div>
              </div>
            </div>
          </section>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Primary Account */}
              <div className="glass-panel-glow rounded-xl p-6 flex flex-col relative overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all duration-300">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#00daf3]/20 rounded-full blur-2xl group-hover:bg-[#00daf3]/30 group-hover:scale-150 transition-all duration-500"></div>
                <div className="flex justify-between items-start mb-8 z-10">
                  <div>
                    <h3 className="font-mono text-sm text-[#bac9cc] uppercase tracking-wider mb-1">Primary Account</h3>
                    <div className="flex items-center gap-1">
                      <span className="text-3xl font-bold text-[#d9e2ff]">$124,500</span>
                      <span className="text-[#bac9cc]">.00</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#2a344e]/50 flex items-center justify-center border border-white/10 group-hover:border-[#00daf3]/50 transition-colors">
                    <span className="material-symbols-outlined text-[#00daf3]">account_balance</span>
                  </div>
                </div>
                <div className="mt-auto z-10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-mono text-[#bac9cc]">•••• 4829</span>
                    <span className="text-[#4ade80] flex items-center gap-1 font-mono">
                      <span className="material-symbols-outlined text-[14px]">arrow_upward</span> +2.4% this week
                    </span>
                  </div>
                </div>
              </div>

              {/* Investment Portfolio */}
              <div className="glass-panel rounded-xl p-6 flex flex-col relative overflow-hidden group cursor-pointer hover:-translate-y-1 hover:border-[#d1bcff]/50 transition-all duration-300">
                <div className="flex justify-between items-start mb-8 z-10">
                  <div>
                    <h3 className="font-mono text-sm text-[#bac9cc] uppercase tracking-wider mb-1">Investment Portfolio</h3>
                    <div className="flex items-center gap-1">
                      <span className="text-3xl font-bold text-[#d9e2ff]">$450,230</span>
                      <span className="text-[#bac9cc]">.15</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#2a344e]/50 flex items-center justify-center border border-white/10 group-hover:border-[#d1bcff]/50 transition-colors">
                    <span className="material-symbols-outlined text-[#d1bcff]">show_chart</span>
                  </div>
                </div>
                <div className="mt-auto z-10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-mono text-[#bac9cc]">Quantum Alpha Fund</span>
                    <span className="text-[#4ade80] flex items-center gap-1 font-mono">
                      <span className="material-symbols-outlined text-[14px]">trending_up</span> +8.1% YTD
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* KYC Verification Hub */}
            <div className="md:col-span-4 glass-panel rounded-xl p-6 flex flex-col border-l-2 border-l-[#00daf3] hover:bg-[#2a344e]/20 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#d9e2ff] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00daf3]">fingerprint</span> KYC Hub
                </h3>
                <span className="font-mono text-xs text-[#4ade80] bg-[#4ade80]/10 px-2 py-1 rounded-full border border-[#4ade80]/30">Verified</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-[#2a344e]/20 rounded-lg group">
                  <div className="w-10 h-10 rounded-full bg-[#00daf3]/10 flex items-center justify-center group-hover:bg-[#00daf3]/20 transition-colors">
                    <span className="material-symbols-outlined text-[#00daf3]">face</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[#d9e2ff]">Biometric Match</p>
                    <div className="w-full bg-white/5 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-[#00daf3] h-full rounded-full w-[98%] shadow-[0_0_10px_#00daf3]"></div>
                    </div>
                  </div>
                  <span className="font-mono text-[#00daf3]">98%</span>
                </div>
              </div>
            </div>

            {/* Nexus Score */}
            <div className="md:col-span-12 glass-panel rounded-xl p-6 border-t-2 border-t-[#00daf3] flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00daf3]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="flex items-center justify-between mb-6 z-10">
                <h3 className="text-xl font-bold text-[#d9e2ff] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00daf3]">analytics</span> Nexus Score
                </h3>
                <span className="font-mono text-xs text-[#4ade80] bg-[#4ade80]/10 px-3 py-1 rounded-full border border-[#4ade80]/30 shadow-[0_0_10px_rgba(74,222,128,0.2)]">Risk Level: Minimal</span>
              </div>
              
              <div className="flex flex-col items-center justify-center py-4 relative z-10">
                <div className="relative w-40 h-40 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle className="text-white/5" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="6"></circle>
                    <circle className="text-[#00daf3] shadow-[0_0_15px_#00daf3] transition-all duration-1000 ease-out" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeDasharray="440" strokeDashoffset={440 - (440 * (animatedScore / 1000))} strokeWidth="6"></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl text-[#d9e2ff] font-bold text-glow">{animatedScore}</span>
                    <span className="font-mono text-xs text-[#bac9cc]/50 uppercase mt-1">Excellent</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Interactive AI Chatbot Widget */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
        
        {/* Chat Window */}
        <div className={`w-80 md:w-96 glass-panel rounded-2xl overflow-hidden flex flex-col shadow-[0_0_30px_rgba(0,218,243,0.2)] border-[#00daf3]/30 transition-all duration-300 origin-bottom-right ${isChatOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
          <div className="p-4 bg-[#2a344e]/80 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="material-symbols-outlined text-[#00daf3]">smart_toy</span>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#4ade80] rounded-full border-2 border-[#07122a]"></span>
              </div>
              <div>
                <h4 className="font-mono text-sm text-[#d9e2ff]">Quantum AI Assistant</h4>
                <p className="text-[10px] text-[#4ade80] uppercase tracking-widest">{isTyping ? 'Typing...' : 'Online'}</p>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-[#bac9cc] hover:text-[#d9e2ff]">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
          
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-[#101b33]/90 flex flex-col">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col gap-1 max-w-[85%] ${msg.role === 'user' ? 'items-end self-end' : 'items-start self-start'}`}>
                <div className={`p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'rounded-tr-none bg-[#00daf3]/20 border border-[#00daf3]/30 text-[#d9e2ff]' 
                    : 'rounded-tl-none bg-[#2a344e]/50 border border-white/5 text-[#d9e2ff]'
                }`}>
                  {msg.content}
                </div>
                <span className="text-[10px] text-[#bac9cc]/50 mx-1">{msg.timestamp}</span>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex flex-col items-start gap-1 max-w-[85%] self-start">
                <div className="p-4 rounded-2xl rounded-tl-none bg-[#2a344e]/50 border border-white/5 flex gap-1">
                  <span className="w-1.5 h-1.5 bg-[#00daf3] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-[#00daf3] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-[#00daf3] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          
          <div className="p-4 bg-[#2a344e]/40 border-t border-white/10">
            <div className="relative flex items-center gap-2">
              <input 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isTyping}
                className="w-full bg-[#07122a]/50 border border-white/10 rounded-full py-2 pl-4 pr-10 text-[#d9e2ff] text-sm focus:outline-none focus:border-[#00daf3] transition-all disabled:opacity-50" 
                placeholder="Ask Quantum..." 
                type="text"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isTyping}
                className="w-10 h-10 min-w-10 rounded-full bg-[#00daf3] text-[#00363d] flex items-center justify-center hover:scale-105 transition-transform hover:shadow-[0_0_15px_#00daf3] disabled:opacity-50 disabled:hover:scale-100"
              >
                <span className="material-symbols-outlined text-[20px]">send</span>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Trigger Button */}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00daf3] to-[#d1bcff] flex items-center justify-center text-[#001f24] shadow-[0_0_20px_rgba(0,218,243,0.4)] hover:shadow-[0_0_30px_rgba(0,218,243,0.6)] hover:scale-110 transition-all duration-300 group"
        >
          <span className={`material-symbols-outlined text-[28px] transition-transform duration-300 ${isChatOpen ? 'rotate-90 scale-0 hidden' : 'rotate-0 scale-100'}`}>smart_toy</span>
          <span className={`material-symbols-outlined text-[28px] transition-transform duration-300 absolute ${isChatOpen ? 'rotate-0 scale-100' : '-rotate-90 scale-0'}`}>close</span>
        </button>
      </div>
    </div>
  );
}