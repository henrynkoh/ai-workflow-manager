'use client';

interface ShortcutBarProps {
  onShortcut: (template: string) => void;
}

const shortcuts = [
  {
    label: '/continue',
    emoji: '▶️',
    description: 'Resume last task with full memory context',
    gradient: 'linear-gradient(135deg,#8b5cf6,#6366f1)',
    glow: 'rgba(139,92,246,0.35)',
    template: `/continue\n\nLoad my current project context from memory files and resume the next uncompleted task.\n\nBefore starting:\n1. Confirm which task you're resuming\n2. State what was done previously\n3. State what you plan to do next\n\nThen proceed.`,
  },
  {
    label: '/plan',
    emoji: '🗺️',
    description: 'Get a structured plan before coding',
    gradient: 'linear-gradient(135deg,#3b82f6,#06b6d4)',
    glow: 'rgba(59,130,246,0.35)',
    template: `/plan [describe your task here]\n\nBefore writing any code, create a detailed implementation plan:\n1. Goal and problem being solved\n2. Files to create or modify\n3. Dependencies needed\n4. Numbered implementation steps\n5. Edge cases and error handling\n6. How to verify the result\n\nOutput the plan BEFORE writing any code.`,
  },
  {
    label: '/review',
    emoji: '🔍',
    description: 'Review last response against manual rules',
    gradient: 'linear-gradient(135deg,#10b981,#34d399)',
    glow: 'rgba(16,185,129,0.35)',
    template: `/review\n\nReview the code from the last task against all applicable manual rules.\n\nCheck for:\n1. Correctness\n2. Manual compliance\n3. Edge cases\n4. Security risks\n5. Performance\n\nOutput PASS/FAIL for each check with specific issues and fixes.`,
  },
  {
    label: '/add-rule',
    emoji: '✨',
    description: 'Add a new rule to a manual permanently',
    gradient: 'linear-gradient(135deg,#f97316,#fbbf24)',
    glow: 'rgba(249,115,22,0.35)',
    template: `/add-rule [manual: backend|frontend|security|database|general]\n\nRule to add: [describe the rule here]\n\nFormat:\n1. State the rule (imperative: "Always...", "Never...")\n2. Good example (// Good)\n3. Bad example (// Bad)\n4. Rationale in 1–2 sentences`,
  },
];

export function ShortcutBar({ onShortcut }: ShortcutBarProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#8b5cf6' }} />
        <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'rgba(148,163,196,0.7)' }}>
          Shortcuts
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {shortcuts.map((s) => (
          <button
            key={s.label}
            onClick={() => onShortcut(s.template)}
            className="w-full text-left rounded-xl p-3 transition-all duration-200 group relative overflow-hidden"
            style={{
              background: 'rgba(20,27,55,0.6)',
              border: '1px solid rgba(99,120,255,0.1)',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.border = `1px solid ${s.glow}`;
              el.style.background = 'rgba(25,33,70,0.8)';
              el.style.transform = 'translateX(3px)';
              el.style.boxShadow = `0 4px 20px ${s.glow}`;
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.border = '1px solid rgba(99,120,255,0.1)';
              el.style.background = 'rgba(20,27,55,0.6)';
              el.style.transform = 'translateX(0)';
              el.style.boxShadow = 'none';
            }}
          >
            {/* Gradient accent left bar */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl" style={{ background: s.gradient }} />

            <div className="flex items-center gap-2 mb-1 pl-2">
              <span className="text-sm">{s.emoji}</span>
              <span className="font-bold text-sm" style={{
                background: s.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {s.label}
              </span>
            </div>
            <p className="text-xs pl-2 leading-relaxed" style={{ color: 'rgba(148,163,196,0.75)' }}>
              {s.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
