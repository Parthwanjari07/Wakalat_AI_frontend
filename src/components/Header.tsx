'use client';

import { Menu, User, Sun, Moon, Scale } from 'lucide-react';
import { useSidebarStore } from '../store/sidebarStore';
import { useAuthModalStore } from '../store/authModalStore';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const Header = () => {
  const { toggle } = useSidebarStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isChatPage = pathname?.startsWith('/chat/');

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 h-16 transition-colors duration-300"
      style={{
        background: isChatPage
          ? 'color-mix(in srgb, var(--bg-primary) 85%, transparent)'
          : 'var(--bg-primary)',
        backdropFilter: isChatPage ? 'blur(12px) saturate(1.2)' : undefined,
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="px-5 sm:px-8 lg:px-10">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={toggle}
              className="p-2 rounded-lg transition-colors btn-ghost"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </button>
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)', color: '#0C0B09' }}>
                <Scale size={16} strokeWidth={2.5} />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  WAKALAT
                </span>
                <span className="text-xs font-medium tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
                  .AI
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-lg transition-colors btn-ghost"
              disabled={!mounted}
              aria-label="Toggle theme"
            >
              {mounted && (theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />)}
              {!mounted && <div className="w-[18px] h-[18px]" />}
            </button>
            <button
              onClick={() => useAuthModalStore.getState().open()}
              className="p-2.5 rounded-lg transition-colors btn-ghost"
              aria-label="Account"
            >
              <User size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
