'use client';

import { useEffect, useRef } from 'react';
import { ChatMessage as ChatMessageType } from '../../types/ai';
import { ChatMessage } from './ChatMessage';

export function ConversationHistory({ messages, onRetry }: { messages: ChatMessageType[]; onRetry: (prompt: string) => void }) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  return (
    <div className="ai-history">
      {messages.map((message) => <ChatMessage message={message} onRetry={onRetry} key={message.id} />)}
      <div ref={endRef} />
    </div>
  );
}
