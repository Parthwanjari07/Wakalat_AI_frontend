'use client';

import { useState } from 'react';
import { Wrench, CheckCircle2, XCircle, Loader2, ChevronDown, ChevronRight } from 'lucide-react';
import type { ToolCallLog } from '@/store/chatStore';

interface ToolCallLogsProps {
  toolCalls: ToolCallLog[];
}

const TOOL_LABELS: Record<string, string> = {
  search_precedents: 'Searching Precedents',
  find_case_laws: 'Finding Case Laws',
  legal_research: 'Legal Research',
  analyze_document: 'Analyzing Document',
  draft_legal_notice: 'Drafting Legal Notice',
  check_limitation: 'Checking Limitation Period',
};

function formatDuration(ms?: number) {
  if (!ms) return '';
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}

export default function ToolCallLogs({ toolCalls }: ToolCallLogsProps) {
  const [expanded, setExpanded] = useState(true);

  if (!toolCalls || toolCalls.length === 0) return null;

  const allDone = toolCalls.every((tc) => tc.status !== 'running');
  const hasErrors = toolCalls.some((tc) => tc.status === 'error');

  return (
    <div
      className="mb-4 rounded-xl overflow-hidden text-sm"
      style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors"
        style={{ color: 'var(--text-secondary)' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-hover)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <Wrench size={14} style={{ color: 'var(--accent)' }} />
        <span className="font-medium">
          {allDone
            ? `Used ${toolCalls.length} tool${toolCalls.length > 1 ? 's' : ''}${hasErrors ? ' (with errors)' : ''}`
            : `Calling tools...`}
        </span>
        {!allDone && <Loader2 size={14} className="animate-spin ml-auto" style={{ color: 'var(--accent)' }} />}
      </button>

      {expanded && (
        <div className="px-4 pb-3 space-y-1.5">
          {toolCalls.map((tc, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 pl-2.5 py-1.5 rounded-lg"
              style={{ color: 'var(--text-secondary)' }}
            >
              {tc.status === 'running' && (
                <Loader2 size={13} className="animate-spin mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
              )}
              {tc.status === 'success' && (
                <CheckCircle2 size={13} className="mt-0.5 flex-shrink-0" style={{ color: '#5C8A6E' }} />
              )}
              {tc.status === 'error' && (
                <XCircle size={13} className="mt-0.5 flex-shrink-0" style={{ color: '#C4534A' }} />
              )}
              <div className="min-w-0">
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {TOOL_LABELS[tc.tool] || tc.tool}
                </span>
                {tc.durationMs != null && (
                  <span className="ml-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {formatDuration(tc.durationMs)}
                  </span>
                )}
                {tc.args && Object.keys(tc.args).length > 0 && (
                  <div className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-tertiary)' }}>
                    {Object.entries(tc.args)
                      .map(([k, v]) => `${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`)
                      .join(', ')}
                  </div>
                )}
                {tc.error && (
                  <div className="text-xs mt-0.5" style={{ color: '#C4534A' }}>{tc.error}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
