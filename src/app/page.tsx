'use client';

import InputArea from '../components/InputArea';
import { Scale, Search, FileText, Gavel, BookOpen } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-1 flex-col items-center pt-16 px-4 overflow-y-auto mesh-bg">
        {/* Hero Section */}
        <div className="w-full max-w-3xl mx-auto pt-12 sm:pt-20 pb-4 text-center">
          {/* Decorative Scale Icon */}
          <div className="flex justify-center mb-6 opacity-0 animate-fade-up" style={{ animationDelay: '0s', animationFillMode: 'forwards' }}>
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'var(--accent-subtle)', border: '1px solid var(--accent)', borderColor: 'color-mix(in srgb, var(--accent) 20%, transparent)' }}
            >
              <Scale size={24} style={{ color: 'var(--accent)' }} />
            </div>
          </div>

          {/* Main Heading */}
          <h1
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight mb-4 opacity-0 animate-fade-up"
            style={{ color: 'var(--text-primary)', animationDelay: '0.1s', animationFillMode: 'forwards' }}
          >
            Your AI-Powered
            <br />
            <span style={{ color: 'var(--accent)' }}>Legal Counsel</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-base sm:text-lg max-w-xl mx-auto mb-8 opacity-0 animate-fade-up"
            style={{ color: 'var(--text-secondary)', animationDelay: '0.2s', animationFillMode: 'forwards' }}
          >
            Research precedents, analyze cases, and draft legal documents
            with the precision of Indian law at your fingertips.
          </p>

          {/* Brass Divider */}
          <div className="flex items-center justify-center gap-3 mb-8 opacity-0 animate-fade-up" style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}>
            <div className="w-12 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--accent))' }} />
            <div className="brass-dot" />
            <div className="w-12 h-px" style={{ background: 'linear-gradient(90deg, var(--accent), transparent)' }} />
          </div>

          {/* Capability Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10 opacity-0 animate-fade-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            {[
              { icon: Search, label: 'Precedent Search' },
              { icon: Gavel, label: 'Case Analysis' },
              { icon: FileText, label: 'Document Drafting' },
              { icon: BookOpen, label: 'Legal Research' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                }}
              >
                <Icon size={13} style={{ color: 'var(--accent)' }} />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="opacity-0 animate-fade-up w-full" style={{ animationDelay: '0.35s', animationFillMode: 'forwards' }}>
          <InputArea />
        </div>
      </main>
    </div>
  );
}
