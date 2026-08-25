import { Sparkles } from 'lucide-react';
import { SUGGESTED_PROMPTS } from '../../data/aiResponses';

export function SuggestedPrompts({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <div className="ai-suggested">
      <p><Sparkles size={13} />Try asking</p>
      <div className="ai-suggested-grid">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button type="button" key={prompt.id} onClick={() => onSelect(prompt.label)}>{prompt.label}</button>
        ))}
      </div>
    </div>
  );
}
