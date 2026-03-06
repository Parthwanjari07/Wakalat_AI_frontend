'use client';

import { USER_PROFILE } from '@/lib/user-data';
import { User, Mail, Shield, KeyRound, LogOut, Trash2, Scale } from 'lucide-react';

const ProfileInfoRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-center gap-4 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
    <div style={{ color: 'var(--text-tertiary)' }}>{icon}</div>
    <div className="flex-grow">
      <p className="text-xs font-medium uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-tertiary)' }}>{label}</p>
      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{value}</p>
    </div>
  </div>
);

export default function ProfilePage() {
  return (
    <main className="flex-1 overflow-y-auto pt-16 pb-20 mesh-bg">
      <div className="max-w-3xl mx-auto py-10 px-4">
        {/* Profile Header */}
        <div className="flex items-center gap-5 mb-10">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center font-serif font-bold text-2xl"
            style={{ background: 'var(--accent)', color: '#0C0B09' }}
          >
            {USER_PROFILE.initial}
          </div>
          <div>
            <h1 className="font-serif text-3xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {USER_PROFILE.name}
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Manage your account settings and preferences.
            </p>
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, var(--accent), transparent)' }} />
          <Scale size={14} style={{ color: 'var(--accent)', opacity: 0.5 }} />
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--accent))' }} />
        </div>

        {/* Account Information */}
        <section className="card-chamber p-6 mb-6">
          <h2 className="font-serif text-xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            Account Information
          </h2>
          <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>Your personal details and plan</p>
          <ProfileInfoRow icon={<User size={18} />} label="Full Name" value={USER_PROFILE.name} />
          <ProfileInfoRow icon={<Mail size={18} />} label="Email Address" value={USER_PROFILE.email} />
          <ProfileInfoRow icon={<Shield size={18} />} label="Current Plan" value={USER_PROFILE.plan} />
        </section>

        {/* Security */}
        <section className="card-chamber p-6 mb-6">
          <h2 className="font-serif text-xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            Security
          </h2>
          <p className="text-xs mb-5" style={{ color: 'var(--text-tertiary)' }}>Manage your account security</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              className="flex items-center justify-center gap-2.5 flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            >
              <KeyRound size={15} /> Change Password
            </button>
            <button className="flex items-center justify-center gap-2.5 flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all btn-brass">
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section
          className="rounded-xl p-6"
          style={{ border: '1px dashed #C4534A50' }}
        >
          <h2 className="font-serif text-xl font-semibold mb-1" style={{ color: '#C4534A' }}>
            Danger Zone
          </h2>
          <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
            These actions are permanent and cannot be undone.
          </p>
          <button
            className="flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
            style={{ background: '#C4534A' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#A3433B')}
            onMouseLeave={e => (e.currentTarget.style.background = '#C4534A')}
          >
            <Trash2 size={15} /> Delete Account
          </button>
        </section>
      </div>
    </main>
  );
}
