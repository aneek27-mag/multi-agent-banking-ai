'use client';

import { useState } from 'react';
import { Bell, Check, CheckCircle2, MonitorPlay, Moon, RotateCcw, ShieldCheck, Sparkles, Sun } from 'lucide-react';
import { showToast } from '../state/toastStore';

const DEFAULTS = { theme: 'light' as const, notifyRisk: true, notifyEngagement: true, structuredReplies: true, autoSuggest: true };

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} className={`settings-toggle ${checked ? 'on' : ''}`} onClick={onChange}>
      <span />
    </button>
  );
}

export function SettingsView() {
  const [theme, setTheme] = useState<'light' | 'dark'>(DEFAULTS.theme);
  const [notifyRisk, setNotifyRisk] = useState(DEFAULTS.notifyRisk);
  const [notifyEngagement, setNotifyEngagement] = useState(DEFAULTS.notifyEngagement);
  const [structuredReplies, setStructuredReplies] = useState(DEFAULTS.structuredReplies);
  const [autoSuggest, setAutoSuggest] = useState(DEFAULTS.autoSuggest);

  function saveSettings() {
    showToast('Settings saved', { description: 'Your workspace preferences were saved for this demo session.' });
  }

  function resetSettings() {
    setTheme(DEFAULTS.theme);
    setNotifyRisk(DEFAULTS.notifyRisk);
    setNotifyEngagement(DEFAULTS.notifyEngagement);
    setStructuredReplies(DEFAULTS.structuredReplies);
    setAutoSuggest(DEFAULTS.autoSuggest);
    showToast('Settings reset', { description: 'Workspace preferences were restored to their defaults.', tone: 'info' });
  }

  return (
    <div className="module-page settings-page">
      <p className="dashboard-eyebrow"><span className="status-pulse" />Workspace / demo environment</p>
      <h1>Settings</h1>
      <p>Lightweight workspace preferences for this demo environment. Not connected to any real account or banking system.</p>

      <section className="detail-panel settings-panel">
        <div className="detail-heading"><div><p>Appearance</p><h2>Theme</h2></div></div>
        <div className="settings-row">
          <div className="settings-row-icon">{theme === 'light' ? <Sun size={15} /> : <Moon size={15} />}</div>
          <div className="settings-row-copy"><strong>Light theme</strong><span>Nexus is currently optimized for light mode.</span></div>
          <Toggle checked={theme === 'dark'} onChange={() => setTheme((value) => (value === 'light' ? 'dark' : 'light'))} label="Toggle dark theme" />
        </div>
      </section>

      <section className="detail-panel settings-panel">
        <div className="detail-heading"><div><p>Notifications</p><h2>Notification preferences</h2></div></div>
        <div className="settings-row">
          <div className="settings-row-icon"><Bell size={15} /></div>
          <div className="settings-row-copy"><strong>Risk & fraud alerts</strong><span>Notify when a case requires human review.</span></div>
          <Toggle checked={notifyRisk} onChange={() => setNotifyRisk((value) => !value)} label="Toggle risk alerts" />
        </div>
        <div className="settings-row">
          <div className="settings-row-icon"><Bell size={15} /></div>
          <div className="settings-row-copy"><strong>Engagement activity</strong><span>Notify when a personalized offer is generated.</span></div>
          <Toggle checked={notifyEngagement} onChange={() => setNotifyEngagement((value) => !value)} label="Toggle engagement notifications" />
        </div>
      </section>

      <section className="detail-panel settings-panel">
        <div className="detail-heading"><div><p>AI behavior</p><h2>AI response preferences</h2></div></div>
        <div className="settings-row">
          <div className="settings-row-icon"><Sparkles size={15} /></div>
          <div className="settings-row-copy"><strong>Structured responses</strong><span>Prefer INSIGHT / KEY SIGNALS / RECOMMENDATION formatting over long paragraphs.</span></div>
          <Toggle checked={structuredReplies} onChange={() => setStructuredReplies((value) => !value)} label="Toggle structured responses" />
        </div>
        <div className="settings-row">
          <div className="settings-row-icon"><Sparkles size={15} /></div>
          <div className="settings-row-copy"><strong>Suggested prompts</strong><span>Show suggested prompts in the AI Assistant.</span></div>
          <Toggle checked={autoSuggest} onChange={() => setAutoSuggest((value) => !value)} label="Toggle suggested prompts" />
        </div>
      </section>

      <section className="detail-panel settings-panel">
        <div className="detail-heading"><div><p>Environment</p><h2>System status</h2></div></div>
        <div className="settings-status-grid">
          <div className="settings-status-item">
            <MonitorPlay size={16} />
            <div><strong>Demo environment</strong><span>Active — no real banking systems connected</span></div>
          </div>
          <div className="settings-status-item">
            <CheckCircle2 size={16} />
            <div><strong>AI system</strong><span>Operational — live or mock, both supported</span></div>
          </div>
          <div className="settings-status-item">
            <ShieldCheck size={16} />
            <div><strong>Data</strong><span>Synthetic demo data only</span></div>
          </div>
        </div>
      </section>

      <div className="settings-actions">
        <button type="button" className="primary-action" onClick={saveSettings}><Check size={15} />Save changes</button>
        <button type="button" className="outline-action" onClick={resetSettings}><RotateCcw size={14} />Reset to defaults</button>
      </div>
    </div>
  );
}
