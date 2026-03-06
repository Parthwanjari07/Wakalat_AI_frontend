'use client';

import { useState } from 'react';
import { Mail, Lock, User as UserIcon, X, Scale } from 'lucide-react';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';

const InputField = ({ icon, type, placeholder }: { icon: React.ReactNode, type: string, placeholder: string }) => (
  <div className="relative flex items-center mb-3">
    <span className="absolute left-3.5" style={{ color: 'var(--text-tertiary)' }}>{icon}</span>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full pl-11 pr-4 py-3 rounded-xl text-sm input-chamber"
      required
    />
  </div>
);

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[420px] z-50 p-4">
        <div className="w-full animate-scale-in">
          {/* Close button */}
          <div className="flex justify-end mb-2">
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors btn-ghost"
            >
              <X size={20} />
            </button>
          </div>

          <div className="card-chamber overflow-hidden">
            {/* Modal Header */}
            <div className="px-7 py-8 text-center" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="flex justify-center mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--accent)', color: '#0C0B09' }}
                >
                  <Scale size={20} />
                </div>
              </div>
              <h1 className="font-serif text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Get smarter legal responses and access to all features.
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-7 space-y-5">
              {/* Social Login Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    toast.promise(
                      signIn('google', { callbackUrl: window.location.pathname }),
                      {
                        loading: 'Connecting to Google...',
                        success: 'Signed in successfully!',
                        error: 'Could not sign in with Google'
                      }
                    );
                  }}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-medium transition-colors"
                  style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>

                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-medium transition-colors"
                  style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.5 0h-9.5v9.5h9.5v-9.5z" />
                    <path d="M20 0h-9.5v9.5h9.5v-9.5z" />
                    <path d="M9.5 10.5h-9.5v9.5h9.5v-9.5z" />
                    <path d="M20 10.5h-9.5v9.5h9.5v-9.5z" />
                  </svg>
                  Continue with Microsoft
                </button>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full" style={{ height: '1px', background: 'var(--border)' }} />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 font-medium" style={{ background: 'var(--bg-elevated)', color: 'var(--text-tertiary)' }}>
                    OR
                  </span>
                </div>
              </div>

              {/* Email Form */}
              <form className="space-y-3">
                {isSignUp && (
                  <InputField icon={<UserIcon size={18} />} type="text" placeholder="Full Name" />
                )}
                <InputField icon={<Mail size={18} />} type="email" placeholder="Email address" />
                <InputField icon={<Lock size={18} />} type="password" placeholder="Password" />

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all btn-brass"
                >
                  Continue with email
                </button>
              </form>

              {/* Toggle */}
              <p className="text-center text-sm" style={{ color: 'var(--text-tertiary)' }}>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="font-medium transition-colors"
                  style={{ color: 'var(--accent)' }}
                  onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                  onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                >
                  {isSignUp ? 'Sign in' : 'Sign up'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
