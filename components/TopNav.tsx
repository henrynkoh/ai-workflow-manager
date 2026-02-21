'use client';

import Link from 'next/link';

export function TopNav() {
  return (
    <nav
      className="relative z-50 h-14 flex items-center px-5 gap-6 border-b"
      style={{
        background: 'rgba(10,14,26,0.8)',
        backdropFilter: 'blur(24px)',
        borderColor: 'rgba(99,120,255,0.12)',
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 shrink-0 no-underline">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-base font-bold"
          style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }}
        >
          🤖
        </div>
        <span
          className="font-bold text-sm tracking-tight"
          style={{
            background: 'linear-gradient(135deg,#c4b5fd,#f9a8d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          AI Workflow Manager
        </span>
      </Link>

      <div className="w-px h-5 bg-white/10" />

      {/* Nav links */}
      {[
        { href: '/', label: 'Dashboard', emoji: '💬' },
        { href: '/manuals', label: 'Manuals', emoji: '📚' },
        { href: '/memory', label: 'Memory', emoji: '🧠' },
      ].map(({ href, label, emoji }) => (
        <Link
          key={href}
          href={href}
          className="nav-link flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
          style={{ color: 'rgba(148,163,196,1)' }}
        >
          <span>{emoji}</span> {label}
        </Link>
      ))}

      {/* Right side */}
      <div className="ml-auto flex items-center gap-3">
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{
            background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.25)',
            color: '#34d399',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live
        </div>
        <a
          href="https://github.com/henrynkoh/ai-workflow-manager"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
          style={{
            background: 'rgba(139,92,246,0.12)',
            border: '1px solid rgba(139,92,246,0.25)',
            color: '#c4b5fd',
          }}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          GitHub
        </a>
      </div>
    </nav>
  );
}
