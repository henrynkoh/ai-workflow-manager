'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface Manual {
  name: string;
  file: string;
  keywords: string[];
  content: string;
}

interface ManualsBrowserProps {
  matchedManuals?: string[];
}

const MANUAL_STYLES: Record<string, { emoji: string; gradient: string; glow: string; color: string }> = {
  'Backend Rules':  { emoji: '⚙️', gradient: 'linear-gradient(135deg,#8b5cf6,#6366f1)', glow: 'rgba(139,92,246,0.3)',  color: '#a78bfa' },
  'Frontend Rules': { emoji: '🎨', gradient: 'linear-gradient(135deg,#3b82f6,#06b6d4)', glow: 'rgba(59,130,246,0.3)',   color: '#60a5fa' },
  'Security Rules': { emoji: '🔒', gradient: 'linear-gradient(135deg,#ef4444,#f97316)', glow: 'rgba(239,68,68,0.3)',    color: '#f87171' },
  'Database Rules': { emoji: '🗄️', gradient: 'linear-gradient(135deg,#10b981,#34d399)', glow: 'rgba(16,185,129,0.3)',  color: '#34d399' },
  'General Rules':  { emoji: '📐', gradient: 'linear-gradient(135deg,#f59e0b,#fbbf24)', glow: 'rgba(245,158,11,0.3)',  color: '#fbbf24' },
};

function getStyle(name: string) {
  return MANUAL_STYLES[name] ?? { emoji: '📄', gradient: 'linear-gradient(135deg,#8b5cf6,#ec4899)', glow: 'rgba(139,92,246,0.3)', color: '#c4b5fd' };
}

export function ManualsBrowser({ matchedManuals = [] }: ManualsBrowserProps) {
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [selected, setSelected] = useState<Manual | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/manuals');
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        setManuals(json.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const sectionHeader = (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#f59e0b' }} />
        <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'rgba(148,163,196,0.7)' }}>
          Manuals
        </span>
      </div>
      {matchedManuals.length > 0 && (
        <span className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)' }}>
          {matchedManuals.length} active
        </span>
      )}
    </div>
  );

  if (loading) {
    return (
      <div>
        {sectionHeader}
        <div className="flex items-center justify-center py-8 gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'rgba(245,158,11,0.3)', borderTopColor: '#f59e0b' }} />
          <span className="text-xs" style={{ color: 'rgba(148,163,196,0.5)' }}>Loading manuals...</span>
        </div>
      </div>
    );
  }

  if (selected) {
    const s = getStyle(selected.name);
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-3">
          <button onClick={() => setSelected(null)}
            className="text-xs px-2.5 py-1 rounded-lg font-medium transition-all hover:text-white"
            style={{ color: s.color, background: `${s.glow.replace('0.3)', '0.1)')}`, border: `1px solid ${s.glow.replace('0.3)', '0.2)')}` }}>
            ← Back
          </button>
          <div className="flex items-center gap-1.5 min-w-0">
            <span>{s.emoji}</span>
            <span className="text-sm font-bold truncate" style={{ color: s.color }}>{selected.name}</span>
          </div>
          {matchedManuals.includes(selected.name) && (
            <span className="ml-auto shrink-0 text-xs px-2 py-0.5 rounded-full font-bold"
              style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }}>
              ✓ Used
            </span>
          )}
        </div>
        <div className="flex-1 overflow-y-auto rounded-xl p-4"
          style={{ background: 'rgba(10,14,26,0.5)', border: `1px solid ${s.glow.replace('0.3)', '0.15)')}` }}>
          <div className="prose prose-sm prose-invert max-w-none"
            style={{ '--tw-prose-body': 'rgba(226,232,240,0.85)', '--tw-prose-headings': '#e2e8f0' } as React.CSSProperties}>
            <ReactMarkdown>{selected.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {sectionHeader}
      <div className="flex flex-col gap-2">
        {error ? (
          <div className="text-xs text-center py-4" style={{ color: '#f87171' }}>{error}</div>
        ) : (
          manuals.map(manual => {
            const s = getStyle(manual.name);
            const isMatched = matchedManuals.includes(manual.name);
            return (
              <button
                key={manual.file}
                onClick={() => setSelected(manual)}
                className="w-full text-left rounded-xl p-3 transition-all duration-200 group relative overflow-hidden"
                style={{
                  background: isMatched ? `linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.04))` : 'rgba(20,27,55,0.5)',
                  border: isMatched ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(99,120,255,0.1)',
                  boxShadow: isMatched ? '0 0 12px rgba(16,185,129,0.1)' : 'none',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.border = `1px solid ${s.glow.replace('0.3)', '0.4)')}`;
                  el.style.transform = 'translateX(2px)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.border = isMatched ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(99,120,255,0.1)';
                  el.style.transform = 'translateX(0)';
                }}
              >
                {/* Gradient top border */}
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: s.gradient, opacity: isMatched ? 1 : 0.4 }} />

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0"
                      style={{ background: `linear-gradient(135deg, ${s.glow.replace('0.3)', '0.2)')}, ${s.glow.replace('0.3)', '0.1)')})` }}>
                      {s.emoji}
                    </div>
                    <span className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>{manual.name}</span>
                  </div>
                  {isMatched ? (
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                      style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399' }}>
                      ✓ active
                    </span>
                  ) : (
                    <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: s.color }}>
                      →
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1">
                  {manual.keywords.slice(0, 4).map(kw => (
                    <span key={kw} className="text-xs px-1.5 py-0.5 rounded"
                      style={{ background: `${s.glow.replace('0.3)', '0.08)')}`, color: s.color, border: `1px solid ${s.glow.replace('0.3)', '0.15)')}` }}>
                      {kw}
                    </span>
                  ))}
                  {manual.keywords.length > 4 && (
                    <span className="text-xs px-1.5 py-0.5 rounded"
                      style={{ color: 'rgba(148,163,196,0.4)' }}>
                      +{manual.keywords.length - 4}
                    </span>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
