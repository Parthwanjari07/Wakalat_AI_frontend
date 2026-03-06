'use client';

import { User, Scale } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  role: 'User' | 'Model';
  content: string;
}

const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isUser = role === 'User';

  return (
    <div
      className="w-full px-4 md:px-6 lg:px-8 py-5"
      style={{
        background: isUser ? 'transparent' : 'var(--bg-secondary)',
      }}
    >
      <div className="w-full max-w-4xl mx-auto flex items-start gap-4">
        {!isUser && (
          <div
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg"
            style={{ background: 'var(--accent-subtle)', border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)' }}
          >
            <Scale size={14} style={{ color: 'var(--accent)' }} />
          </div>
        )}

        <div className="flex-grow min-w-0">
          {!isUser && (
            <div className="mb-1.5 text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--accent)' }}>
              WAKALAT.AI
            </div>
          )}

          <div className="prose prose-chamber max-w-none text-[15px] leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            <ReactMarkdown>
              {content}
            </ReactMarkdown>
          </div>
        </div>

        {isUser && (
          <div
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}
          >
            <User size={14} style={{ color: 'var(--text-secondary)' }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
