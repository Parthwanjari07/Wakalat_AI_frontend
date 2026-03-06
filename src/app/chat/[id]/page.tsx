'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, notFound } from 'next/navigation';
import { useChatStore } from '@/store/chatStore';
import ChatMessage from '@/components/ChatMessage';
import StreamingChatMessage from '@/components/StreamingChatMessage';
import ToolCallLogs from '@/components/ToolCallLogs';
import { ArrowUp, Scale, LoaderCircle } from 'lucide-react';

export default function ChatPage() {
  const params = useParams();
  const id = params.id as string;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { chats, sendMessageWithGemini, setActiveChatId, markMessageAsStreamed } = useChatStore();
  const chat = chats.find(c => c.id === id);

  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    setActiveChatId(id);
    return () => setActiveChatId(null);
  }, [id, setActiveChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      await sendMessageWithGemini(id, newMessage.trim(), true);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (!chat) {
    return notFound();
  }

  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--bg-primary)' }}>
      <main className="flex-1 overflow-y-auto pt-20 pb-32">
        <div className="max-w-4xl mx-auto py-6 px-4">
          {/* Chat Title */}
          <div className="text-center mb-10 pt-2">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-8 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--accent))' }} />
              <Scale size={16} style={{ color: 'var(--accent)' }} />
              <div className="w-8 h-px" style={{ background: 'linear-gradient(90deg, var(--accent), transparent)' }} />
            </div>
            <h1 className="font-serif text-2xl font-semibold tracking-tight" style={{ color: 'var(--text-secondary)' }}>
              {chat.title}
            </h1>
          </div>

          {/* Messages */}
          <div className="space-y-0 rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            {chat.messages.map((message, index) => {
              const isLastMessage = index === chat.messages.length - 1;
              const isModel = message.role === 'Model';

              if (isModel && isLastMessage && !message.isStreamed) {
                return (
                  <div key={index} className="w-full px-4 md:px-6 lg:px-8 py-5" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="w-full max-w-4xl mx-auto flex items-start gap-4">
                      <div
                        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg"
                        style={{ background: 'var(--accent-subtle)', border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)' }}
                      >
                        <Scale size={14} style={{ color: 'var(--accent)' }} />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="mb-1.5 text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--accent)' }}>
                          WAKALAT.AI
                        </div>
                        {message.toolCalls && message.toolCalls.length > 0 && (
                          <ToolCallLogs toolCalls={message.toolCalls} />
                        )}
                        <StreamingChatMessage
                          content={message.content}
                          onStreamComplete={() => markMessageAsStreamed(id, index)}
                        />
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={index}>
                  {isModel && message.toolCalls && message.toolCalls.length > 0 && (
                    <div className="w-full px-4 md:px-6 lg:px-8" style={{ background: 'var(--bg-secondary)' }}>
                      <div className="w-full max-w-4xl mx-auto pl-12">
                        <ToolCallLogs toolCalls={message.toolCalls} />
                      </div>
                    </div>
                  )}
                  <ChatMessage role={message.role} content={message.content} />
                </div>
              );
            })}
          </div>
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Footer */}
      <footer
        className="fixed bottom-0 left-0 right-0 z-20"
        style={{
          background: 'color-mix(in srgb, var(--bg-primary) 92%, transparent)',
          backdropFilter: 'blur(12px) saturate(1.2)',
        }}
      >
        <div className="max-w-4xl mx-auto p-4">
          <form onSubmit={handleSendMessage} className="relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask a follow-up question..."
              className="w-full rounded-xl text-[15px] p-4 pr-14 input-chamber"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed btn-brass"
              disabled={!newMessage.trim() || isSending}
            >
              {isSending ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <ArrowUp size={16} />
              )}
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}
