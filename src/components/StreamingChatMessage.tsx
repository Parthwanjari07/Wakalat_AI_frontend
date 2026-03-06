'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface StreamingChatMessageProps {
  content: string;
  onStreamComplete?: () => void;
}

const StreamingChatMessage = ({ content, onStreamComplete }: StreamingChatMessageProps) => {
  const [displayedContent, setDisplayedContent] = useState('');

  useEffect(() => {
    setDisplayedContent('');
    let index = 0;
    const words = content.split(' ');

    const intervalId = setInterval(() => {
      if (index < words.length) {
        setDisplayedContent((prev) => prev + (index > 0 ? ' ' : '') + words[index]);
        index++;
      } else {
        clearInterval(intervalId);
        if (onStreamComplete) {
          onStreamComplete();
        }
      }
    }, 50);

    return () => clearInterval(intervalId);
  }, [content, onStreamComplete]);

  return (
    <div className="prose prose-chamber max-w-none text-[15px] leading-relaxed" style={{ color: 'var(--text-primary)' }}>
      <ReactMarkdown>{displayedContent}</ReactMarkdown>
      <span
        className="inline-block w-0.5 h-4 ml-0.5 animate-pulse-brass rounded-full"
        style={{ background: 'var(--accent)' }}
      />
    </div>
  );
};

export default StreamingChatMessage;
