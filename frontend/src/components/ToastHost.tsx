'use client';

import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { dismissToast, useToasts } from '../state/toastStore';

const ICONS = { success: CheckCircle2, error: AlertTriangle, info: Info };

export function ToastHost() {
  const toasts = useToasts();
  if (!toasts.length) return null;

  return (
    <div className="toast-host" role="status" aria-live="polite">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.tone];
        return (
          <div className={`toast toast-${toast.tone}`} key={toast.id}>
            <Icon size={16} />
            <div className="toast-body">
              <strong>{toast.message}</strong>
              {toast.description && <span>{toast.description}</span>}
            </div>
            <button type="button" aria-label="Dismiss notification" onClick={() => dismissToast(toast.id)}><X size={13} /></button>
          </div>
        );
      })}
    </div>
  );
}
