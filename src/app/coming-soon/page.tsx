import Link from 'next/link';
import { Scale, ArrowLeft } from 'lucide-react';

export default function ComingSoonPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center mesh-bg">
      <div className="max-w-md animate-fade-up">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse-brass"
            style={{ background: 'var(--accent-subtle)', border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)' }}
          >
            <Scale size={28} style={{ color: 'var(--accent)' }} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
          Under Construction
        </h1>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--accent))' }} />
          <div className="brass-dot" />
          <div className="w-10 h-px" style={{ background: 'linear-gradient(90deg, var(--accent), transparent)' }} />
        </div>

        {/* Description */}
        <p className="text-base mb-8" style={{ color: 'var(--text-secondary)' }}>
          We are currently working on this feature and will have it ready for you shortly. Thank you for your patience.
        </p>

        {/* CTA */}
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2.5 rounded-xl px-6 py-3 text-sm font-semibold transition-all btn-brass"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>
    </main>
  );
}
