import Link from 'next/link';

const Footer = () => {
  const footerLinks = [
    "Plans", "Laws & Acts", "Latest Judgements", "Disclosure",
    "Privacy Policy", "Terms and Conditions", "Cookie Policy", "Refunds Policy"
  ];

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-10 transition-colors"
      style={{
        background: 'color-mix(in srgb, var(--bg-primary) 90%, transparent)',
        backdropFilter: 'blur(12px) saturate(1.2)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-center gap-x-1.5 sm:gap-x-3 flex-wrap">
          {footerLinks.map((link, i) => (
            <span key={link} className="flex items-center gap-1.5 sm:gap-3">
              <Link
                href="/coming-soon"
                className="text-[11px] sm:text-xs tracking-wide transition-colors whitespace-nowrap"
                style={{ color: 'var(--text-tertiary)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}
              >
                {link}
              </Link>
              {i < footerLinks.length - 1 && (
                <span className="brass-dot hidden sm:block" />
              )}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
