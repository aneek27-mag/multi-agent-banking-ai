'use client';

import { useState } from 'react';
import { AlertTriangle, Check, FileText, MessageSquareText, Sparkles, X } from 'lucide-react';
import { OnboardingDocument } from '../../types/onboarding';

const STATUS_CLASS: Record<string, string> = {
  Verified: 'verified',
  Processing: 'processing',
  'Requires Review': 'requires-review',
  Failed: 'failed',
  Pending: 'pending',
};

export function DocumentCard({ doc }: { doc: OnboardingDocument }) {
  const [resolution, setResolution] = useState<string | null>(null);

  function handle(action: 'Approve' | 'Request Correction' | 'Escalate') {
    setResolution(action === 'Approve' ? 'Approved' : action === 'Request Correction' ? 'Correction requested' : 'Escalated');
  }

  return (
    <div className="doc-card">
      <div className="doc-card-header">
        <span className="doc-card-icon"><FileText size={15} /></span>
        <div>
          <strong>{doc.type}</strong>
          <small>{doc.fileLabel}</small>
        </div>
        <span className={`doc-status ${STATUS_CLASS[doc.status]}`}>{doc.status}</span>
      </div>

      {doc.extraction && (
        <div className="doc-extraction">
          <p className="doc-extraction-label"><Sparkles size={11} />AI extraction</p>
          <div className="doc-extraction-grid">
            {Object.entries(doc.extraction).map(([label, value]) => (
              <div key={label}><span>{label}</span><strong>{value}</strong></div>
            ))}
          </div>
          <div className="doc-quality-row">
            {doc.documentQuality !== undefined && <span>Document quality <strong>{doc.documentQuality}%</strong></span>}
            {doc.ocrConfidence !== undefined && <span>OCR confidence <strong>{doc.ocrConfidence}%</strong></span>}
          </div>
        </div>
      )}

      {!doc.extraction && doc.status === 'Pending' && <p className="doc-pending-note">Not yet uploaded by the applicant.</p>}

      {doc.flag && (
        <div className="doc-mismatch">
          <div className="doc-mismatch-heading"><AlertTriangle size={14} />AI detected: {doc.flag.issue}</div>
          <p>{doc.flag.detail}</p>
          <div className="doc-mismatch-meta">
            <span>Confidence <strong>{doc.flag.confidence}%</strong></span>
            <span>Risk <strong>{doc.flag.risk}</strong></span>
          </div>
          <p className="doc-mismatch-recommendation">{doc.flag.recommendation}</p>
          {!resolution ? (
            <div className="doc-actions">
              <button className="doc-action-approve" onClick={() => handle('Approve')}><Check size={12} />Approve</button>
              <button onClick={() => handle('Request Correction')}><MessageSquareText size={12} />Request Correction</button>
              <button onClick={() => handle('Escalate')}><X size={12} />Escalate</button>
            </div>
          ) : (
            <span className="reviewed-state"><Check size={13} />{resolution}</span>
          )}
        </div>
      )}
    </div>
  );
}
