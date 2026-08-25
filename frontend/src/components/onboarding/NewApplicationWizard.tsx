'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, ChevronRight, FileCheck2, Loader2, Sparkles, UserCircle2 } from 'lucide-react';
import { AccountRecommendationResult, PROCESS_STEPS, recommendAccount, submitNewApplication } from '../../services/onboardingService';

const STEPS = ['Welcome', 'Personal Details', 'Account Selection', 'Upload Documents', 'AI Verification', 'Review', 'Complete'];
const DOC_TYPES = ['PAN', 'Aadhaar', 'Address Proof', 'Photograph'] as const;

interface FormState {
  name: string;
  dob: string;
  phone: string;
  email: string;
  address: string;
  occupation: string;
  monthlyIncome: string;
  expectedMonthlyTransactions: string;
  primaryUsage: string;
  accountType: string;
}

const EMPTY_FORM: FormState = { name: '', dob: '', phone: '', email: '', address: '', occupation: '', monthlyIncome: '', expectedMonthlyTransactions: '', primaryUsage: 'Digital payments', accountType: '' };

export function NewApplicationWizard() {
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [uploaded, setUploaded] = useState<Record<string, string>>({});
  const [verifying, setVerifying] = useState(false);
  const [verifyStep, setVerifyStep] = useState(-1);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [result, setResult] = useState<{ applicationId: string; customerId: string } | null>(null);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  const recommendation: AccountRecommendationResult = useMemo(() => recommendAccount({
    monthlyIncome: Number(form.monthlyIncome) || 0,
    expectedMonthlyTransactions: Number(form.expectedMonthlyTransactions) || 0,
    primaryUsage: form.primaryUsage,
  }), [form.monthlyIncome, form.expectedMonthlyTransactions, form.primaryUsage]);

  const selectedAccountType = form.accountType || recommendation.recommended;

  const personalValid = form.name.trim() && form.dob.trim() && form.phone.trim() && form.email.trim() && form.address.trim() && form.occupation.trim();
  const allUploaded = DOC_TYPES.every((type) => uploaded[type]);

  function goNext() {
    setStepIndex((index) => Math.min(index + 1, STEPS.length - 1));
  }
  function goBack() {
    setStepIndex((index) => Math.max(index - 1, 0));
  }

  async function runVerification() {
    setVerifying(true);
    setVerifyStep(0);
    for (let index = 0; index < PROCESS_STEPS.length; index += 1) {
      setVerifyStep(index);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    setVerifyStep(PROCESS_STEPS.length);
    setConfidence(92 + Math.floor(Math.random() * 6));
    setVerifying(false);
  }

  function complete() {
    const submission = submitNewApplication({
      name: form.name,
      dob: form.dob,
      phone: form.phone,
      email: form.email,
      address: form.address,
      occupation: form.occupation,
      accountType: selectedAccountType,
      expectedMonthlyIncome: Number(form.monthlyIncome) || 0,
      expectedMonthlyTransactions: Number(form.expectedMonthlyTransactions) || 0,
      purpose: form.primaryUsage,
      aiConfidence: confidence ?? 95,
    });
    setResult({ applicationId: submission.application.id, customerId: submission.customerId });
    goNext();
  }

  return (
    <div className="onb-page onb-wizard-page">
      <section className="onb-heading">
        <div>
          <p className="dashboard-eyebrow"><span className="status-pulse" />Nexus onboarding / simulated environment</p>
          <h1>Start New Application</h1>
          <p>A simulated customer acquisition journey — no real documents or government systems are involved.</p>
        </div>
        <Link href="/onboarding" className="outline-action"><ArrowLeft size={14} />Back to onboarding</Link>
      </section>

      <div className="onb-wizard-steps">
        {STEPS.map((label, index) => (
          <div className={`onb-wizard-step ${index < stepIndex ? 'done' : index === stepIndex ? 'active' : ''}`} key={label}>
            <span>{index < stepIndex ? <Check size={11} /> : index + 1}</span>
            {label}
          </div>
        ))}
      </div>

      <div className="dashboard-panel onb-wizard-panel">
        {stepIndex === 0 && (
          <div className="onb-wizard-welcome">
            <span className="onb-empty-icon"><UserCircle2 size={26} /></span>
            <h2>Welcome to Nexus Bank</h2>
            <p>This is a simulated onboarding journey for the SIH demo. We&apos;ll ask a few questions, recommend an account, and simulate AI-assisted document verification — no real Aadhaar, PAN or banking systems are contacted.</p>
            <button type="button" className="primary-action" onClick={goNext}>Get started<ArrowRight size={15} /></button>
          </div>
        )}

        {stepIndex === 1 && (
          <div className="onb-wizard-form">
            <h2>Personal details</h2>
            <div className="onb-field-grid">
              <label className="onb-field"><span>Full name</span><input value={form.name} onChange={(event) => set('name', event.target.value)} placeholder="e.g. Ananya Rao" /></label>
              <label className="onb-field"><span>Date of birth</span><input value={form.dob} onChange={(event) => set('dob', event.target.value)} placeholder="e.g. 14 May 1997" /></label>
              <label className="onb-field"><span>Phone</span><input value={form.phone} onChange={(event) => set('phone', event.target.value)} placeholder="+91 90000 00000" /></label>
              <label className="onb-field"><span>Email</span><input value={form.email} onChange={(event) => set('email', event.target.value)} placeholder="name@example.com" /></label>
              <label className="onb-field onb-field-wide"><span>Address</span><input value={form.address} onChange={(event) => set('address', event.target.value)} placeholder="Street, City, State" /></label>
              <label className="onb-field"><span>Occupation</span><input value={form.occupation} onChange={(event) => set('occupation', event.target.value)} placeholder="e.g. Software Engineer" /></label>
            </div>
            <div className="onb-wizard-actions">
              <button type="button" className="outline-action" onClick={goBack}><ArrowLeft size={14} />Back</button>
              <button type="button" className="primary-action" onClick={goNext} disabled={!personalValid}>Continue<ArrowRight size={15} /></button>
            </div>
          </div>
        )}

        {stepIndex === 2 && (
          <div className="onb-wizard-form">
            <h2>Account selection</h2>
            <div className="onb-field-grid">
              <label className="onb-field"><span>Monthly income (₹)</span><input value={form.monthlyIncome} onChange={(event) => set('monthlyIncome', event.target.value.replace(/\D/g, ''))} placeholder="e.g. 65000" /></label>
              <label className="onb-field"><span>Expected monthly transactions</span><input value={form.expectedMonthlyTransactions} onChange={(event) => set('expectedMonthlyTransactions', event.target.value.replace(/\D/g, ''))} placeholder="e.g. 40" /></label>
              <label className="onb-field"><span>Primary usage</span>
                <select value={form.primaryUsage} onChange={(event) => set('primaryUsage', event.target.value)}>
                  <option>Digital payments</option>
                  <option>Salary credit</option>
                  <option>Savings</option>
                  <option>Business transactions</option>
                </select>
              </label>
            </div>

            <div className="next-action-panel onb-recommendation">
              <p><Sparkles size={13} />AI recommendation</p>
              <h2>{recommendation.recommended}</h2>
              <div className="confidence"><span>Confidence</span><strong>{recommendation.confidence}%</strong></div>
              <strong className="onb-why-label">Why?</strong>
              <ul className="onb-why-list">{recommendation.reasons.map((reason) => <li key={reason}><Check size={11} />{reason}</li>)}</ul>
              {recommendation.alternatives.length > 0 && (
                <p className="onb-alternatives">Alternatives: {recommendation.alternatives.join(', ')}</p>
              )}
              <small>AI recommendation only — not an eligibility or approval decision.</small>
            </div>

            <label className="onb-field">
              <span>Selected account type</span>
              <select value={selectedAccountType} onChange={(event) => set('accountType', event.target.value)}>
                <option value={recommendation.recommended}>{recommendation.recommended} (recommended)</option>
                {recommendation.alternatives.map((type) => <option value={type} key={type}>{type}</option>)}
              </select>
            </label>

            <div className="onb-wizard-actions">
              <button type="button" className="outline-action" onClick={goBack}><ArrowLeft size={14} />Back</button>
              <button type="button" className="primary-action" onClick={goNext}>Continue<ArrowRight size={15} /></button>
            </div>
          </div>
        )}

        {stepIndex === 3 && (
          <div className="onb-wizard-form">
            <h2>Upload documents</h2>
            <p className="onb-wizard-hint">Simulated uploads only — no files are sent anywhere.</p>
            <div className="doc-grid">
              {DOC_TYPES.map((type) => (
                <div className="doc-card onb-upload-card" key={type}>
                  <div className="doc-card-header">
                    <span className="doc-card-icon"><FileCheck2 size={15} /></span>
                    <div><strong>{type}</strong><small>{uploaded[type] ?? 'Not uploaded'}</small></div>
                    <span className={`doc-status ${uploaded[type] ? 'verified' : 'pending'}`}>{uploaded[type] ? 'Uploaded' : 'Pending'}</span>
                  </div>
                  <label className="onb-upload-button">
                    {uploaded[type] ? 'Replace file' : 'Choose file'}
                    <input type="file" onChange={(event) => setUploaded((current) => ({ ...current, [type]: event.target.files?.[0]?.name ?? `${type.toLowerCase()}-scan.jpg` }))} />
                  </label>
                </div>
              ))}
            </div>
            <div className="onb-wizard-actions">
              <button type="button" className="outline-action" onClick={goBack}><ArrowLeft size={14} />Back</button>
              <button type="button" className="primary-action" onClick={goNext} disabled={!allUploaded}>Continue<ArrowRight size={15} /></button>
            </div>
          </div>
        )}

        {stepIndex === 4 && (
          <div className="onb-wizard-form">
            <h2>AI verification</h2>
            <p className="onb-wizard-hint">Nexus AI agents will review the simulated documents.</p>
            {verifyStep === -1 ? (
              <button type="button" className="primary-action" onClick={() => void runVerification()}><Sparkles size={15} />Run AI Verification</button>
            ) : (
              <div className="ai-processing onb-process-steps">
                {PROCESS_STEPS.map((step, index) => {
                  const state = index < verifyStep || verifyStep >= PROCESS_STEPS.length ? 'done' : index === verifyStep ? 'active' : 'pending';
                  return (
                    <div className={`ai-processing-step ${state}`} key={step.label}>
                      <span className="ai-processing-icon">{state === 'done' ? <Check size={11} /> : state === 'active' ? <Loader2 size={11} className="ai-spin" /> : null}</span>
                      <span><strong className="onb-step-agent">{step.agent}</strong> — {step.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
            {confidence !== null && (
              <div className="workflow-decision onb-result onb-result-good">
                <div>
                  <span>AI Verification Complete</span>
                  <strong><Check size={15} />Documents verified</strong>
                  <p>Next action: Continue to review</p>
                </div>
                <b>{confidence}%<small>confidence</small></b>
              </div>
            )}
            <div className="onb-wizard-actions">
              <button type="button" className="outline-action" onClick={goBack} disabled={verifying}><ArrowLeft size={14} />Back</button>
              <button type="button" className="primary-action" onClick={goNext} disabled={verifying || confidence === null}>Continue to review<ArrowRight size={15} /></button>
            </div>
          </div>
        )}

        {stepIndex === 5 && (
          <div className="onb-wizard-form">
            <h2>Review your application</h2>
            <div className="finance-metrics">
              <div className="metric-item"><span>Name</span><strong>{form.name}</strong></div>
              <div className="metric-item"><span>Date of birth</span><strong>{form.dob}</strong></div>
              <div className="metric-item"><span>Phone</span><strong>{form.phone}</strong></div>
              <div className="metric-item"><span>Email</span><strong>{form.email}</strong></div>
              <div className="metric-item"><span>Address</span><strong>{form.address}</strong></div>
              <div className="metric-item"><span>Occupation</span><strong>{form.occupation}</strong></div>
              <div className="metric-item"><span>Account type</span><strong>{selectedAccountType}</strong></div>
              <div className="metric-item"><span>AI verification confidence</span><strong>{confidence ?? 95}%</strong></div>
            </div>
            <div className="onb-wizard-actions">
              <button type="button" className="outline-action" onClick={goBack}><ArrowLeft size={14} />Back</button>
              <button type="button" className="primary-action" onClick={complete}>Confirm & Create Application<ArrowRight size={15} /></button>
            </div>
          </div>
        )}

        {stepIndex === 6 && result && (
          <div className="onb-wizard-welcome">
            <span className="onb-empty-icon onb-complete-icon"><Check size={26} /></span>
            <h2>Application complete</h2>
            <p>{form.name.split(' ')[0]}&apos;s account has been created in the sandbox and now appears in Customers, Customer 360 and the AI Assistant.</p>
            <div className="onb-wizard-actions onb-complete-actions">
              <Link href={`/customers/${result.customerId}`} className="primary-action"><Sparkles size={15} />View in Customer 360<ChevronRight size={13} /></Link>
              <Link href={`/onboarding/${result.applicationId}`} className="outline-action">View application</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
