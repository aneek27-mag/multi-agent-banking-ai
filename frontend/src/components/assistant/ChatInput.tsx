'use client';

import { FormEvent } from 'react';
import { Send } from 'lucide-react';

export function ChatInput({ value, onChange, onSubmit, disabled }: { value: string; onChange: (value: string) => void; onSubmit: () => void; disabled: boolean }) {
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!value.trim() || disabled) return;
    onSubmit();
  }

  return (
    <form className="ai-input-bar" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="ai-chat-input">Ask the AI banking assistant</label>
      <input
        id="ai-chat-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Ask about a customer, risk, or today's activity..."
        disabled={disabled}
      />
      <button type="submit" disabled={disabled || !value.trim()} aria-label="Send message"><Send size={15} /></button>
    </form>
  );
}
