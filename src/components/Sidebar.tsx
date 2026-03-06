'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSidebarStore } from '../store/sidebarStore';
import { useChatStore } from '@/store/chatStore';
import { Plus, PanelLeftClose, MoreHorizontal, Scale, MessageSquare } from 'lucide-react';

const sidebarVariants = {
  open: { x: 0, transition: { type: "spring" as const, stiffness: 300, damping: 40 } },
  closed: { x: '-100%', transition: { type: "spring" as const, stiffness: 300, damping: 40 } },
};

const Sidebar = () => {
  const { close } = useSidebarStore();
  const { chats, activeChatId } = useChatStore();

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="closed"
      animate="open"
      exit="closed"
      className="fixed top-0 left-0 h-full w-72 z-50 flex flex-col"
      style={{
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
      }}
    >
      <div className="p-4 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <Link href="/" className="flex items-center gap-2.5" onClick={close}>
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center"
              style={{ background: 'var(--accent)', color: '#0C0B09' }}
            >
              <Scale size={14} strokeWidth={2.5} />
            </div>
            <span className="font-serif text-lg font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              WAKALAT
            </span>
            <span className="text-[10px] font-medium tracking-widest" style={{ color: 'var(--accent)' }}>.AI</span>
          </Link>
          <button
            onClick={close}
            className="p-1.5 rounded-lg transition-colors btn-ghost"
          >
            <PanelLeftClose size={18} />
          </button>
        </div>

        {/* New Chat Button */}
        <Link
          href="/"
          onClick={close}
          className="flex items-center gap-2.5 w-full justify-center mb-5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all btn-brass"
        >
          <Plus size={16} />
          New Chat
        </Link>

        {/* Divider */}
        <div className="brass-line mb-4" />

        {/* Chat History */}
        <nav className="flex-grow overflow-y-auto -mr-2 pr-2 space-y-0.5">
          {chats.length > 0 && (
            <div>
              <h3
                className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Recent Conversations
              </h3>
              {chats.map((chat) => {
                const isActive = activeChatId === chat.id;
                return (
                  <Link
                    href={`/chat/${chat.id}`}
                    key={chat.id}
                    onClick={close}
                    className="flex items-center gap-2.5 p-2.5 text-sm rounded-lg truncate transition-all"
                    style={{
                      background: isActive ? 'var(--accent-subtle)' : 'transparent',
                      color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                      borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'var(--surface-hover)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }
                    }}
                  >
                    <MessageSquare size={14} className="flex-shrink-0" style={{ opacity: 0.5 }} />
                    <span className="truncate">{chat.title}</span>
                  </Link>
                );
              })}
            </div>
          )}
          {chats.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare size={24} className="mx-auto mb-2" style={{ color: 'var(--text-tertiary)', opacity: 0.4 }} />
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>No conversations yet</p>
            </div>
          )}
        </nav>

        {/* User Profile */}
        <div className="mt-auto pt-4" style={{ borderTop: '1px solid var(--border)' }}>
          <Link
            href="/profile"
            onClick={close}
            className="flex items-center gap-3 w-full p-2.5 rounded-lg transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--surface-hover)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-serif font-bold text-sm"
              style={{ background: 'var(--accent)', color: '#0C0B09' }}
            >
              S
            </div>
            <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Sufiyan Sayyed</span>
            <MoreHorizontal size={16} className="ml-auto" style={{ color: 'var(--text-tertiary)' }} />
          </Link>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
