import { AlertTriangle, Bot, RotateCcw, User } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../../types/ai';
import { AIProcessingState } from './AIProcessingState';
import { InsightCard } from './InsightCard';
import { AIActionCard } from './AIActionCard';

export function ChatMessage({ message, onRetry }: { message: ChatMessageType; onRetry?: (prompt: string) => void }) {
  const isUser = message.role === 'user';

  return (
    <div className={`ai-msg ${isUser ? 'ai-msg-user' : 'ai-msg-assistant'}`}>
      <span className="ai-msg-avatar">{isUser ? <User size={13} /> : <Bot size={13} />}</span>
      <div className="ai-msg-body">
        {message.status === 'loading' && message.processingSteps && <AIProcessingState steps={message.processingSteps} />}

        {message.status === 'error' && (
          <div className="ai-msg-error">
            <AlertTriangle size={14} />
            <div>
              <p>AI service is temporarily unavailable.</p>
              {message.failedPrompt && onRetry && (
                <button type="button" onClick={() => onRetry(message.failedPrompt!)}><RotateCcw size={12} />Retry</button>
              )}
            </div>
          </div>
        )}

        {message.status === 'complete' && (
          <>
            {message.content && <p className="ai-msg-text">{message.content}</p>}
            {message.structured && <InsightCard structured={message.structured} />}
            {message.actions && <AIActionCard actions={message.actions} />}
          </>
        )}

        <time className="ai-msg-time">{message.timestamp}</time>
      </div>
    </div>
  );
}
