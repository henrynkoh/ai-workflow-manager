'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface Manual { name: string; file: string; keywords: string[]; content: string; }

const MANUAL_META: Record<string, { emoji: string; color: string; gradient: string }> = {
  'Backend Rules':  { emoji: '⚙️', color: '#a78bfa', gradient: 'linear-gradient(135deg,#8b5cf6,#6366f1)' },
  'Frontend Rules': { emoji: '🎨', color: '#60a5fa', gradient: 'linear-gradient(135deg,#3b82f6,#06b6d4)' },
  'Security Rules': { emoji: '🔒', color: '#f87171', gradient: 'linear-gradient(135deg,#ef4444,#f97316)' },
  'Database Rules': { emoji: '🗄️', color: '#34d399', gradient: 'linear-gradient(135deg,#10b981,#34d399)' },
  'General Rules':  { emoji: '📐', color: '#fbbf24', gradient: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
};

function getMeta(name: string) {
  return MANUAL_META[name] ?? { emoji: '📄', color: '#c4b5fd', gradient: 'linear-gradient(135deg,#8b5cf6,#ec4899)' };
}

export default function ManualsPage() {
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [selected, setSelected] = useState<Manual | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/manuals')
      .then(r => r.json())
      .then(j => { if (j.error) throw new Error(j.error); setManuals(j.data); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const selectedMeta = selected ? getMeta(selected.name) : null;

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 flex flex-col overflow-y-auto p-4"
        style={{ background: 'rgba(10,14,26,0.7)', borderRight: '1px solid rgba(99,120,255,0.1)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center gap-2 mb-5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
            style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }}>📚</div>
          <span className="font-bold text-sm">Manuals</span>
        </div>

        {loading ? (
          <div className="text-xs text-center py-8" style={{ color: 'rgba(148,163,196,0.5)' }}>Loading…</div>
        ) : (
          <div className="flex flex-col gap-2">
            {manuals.map(m => {
              const meta = getMeta(m.name);
              const active = selected?.file === m.file;
              return (
                <button key={m.file} onClick={() => setSelected(m)}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200 flex items-center gap-2.5"
                  style={{
                    background: active ? `linear-gradient(135deg,${meta.color}18,${meta.color}0a)` : 'rgba(20,27,55,0.5)',
                    border: active ? `1px solid ${meta.color}44` : '1px solid rgba(99,120,255,0.08)',
                    color: active ? meta.color : 'rgba(148,163,196,0.8)',
                    fontWeight: active ? '600' : '400',
                  }}>
                  <span>{meta.emoji}</span>
                  {m.name}
                </button>
              );
            })}
          </div>
        )}
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-8" style={{ background: 'rgba(8,12,24,0.4)' }}>
        {error ? (
          <div className="text-center py-16 text-sm" style={{ color: '#f87171' }}>{error}</div>
        ) : !selected ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-5xl mb-4 float">📚</div>
            <h2 className="text-xl font-bold mb-2">Select a manual</h2>
            <p className="text-sm" style={{ color: 'rgba(148,163,196,0.6)' }}>
              Manuals are auto-injected into Claude based on task keywords
            </p>
            <div className="grid grid-cols-5 gap-3 mt-8">
              {manuals.map(m => {
                const meta = getMeta(m.name);
                return (
                  <button key={m.file} onClick={() => setSelected(m)}
                    className="px-4 py-3 rounded-xl text-sm transition-all duration-200 flex flex-col items-center gap-2"
                    style={{ background: 'rgba(20,27,55,0.6)', border: `1px solid rgba(99,120,255,0.1)` }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = `1px solid ${meta.color}44`; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = '1px solid rgba(99,120,255,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
                    <span className="text-2xl">{meta.emoji}</span>
                    <span className="text-xs font-medium text-center leading-tight" style={{ color: meta.color }}>{m.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: selectedMeta!.gradient, boxShadow: `0 8px 24px ${selectedMeta!.color}33` }}>
                {selectedMeta!.emoji}
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: selectedMeta!.color }}>{selected.name}</h1>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selected.keywords.map(kw => (
                    <span key={kw} className="text-xs px-2 py-0.5 rounded font-mono"
                      style={{ background: `${selectedMeta!.color}12`, color: selectedMeta!.color, border: `1px solid ${selectedMeta!.color}25` }}>
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="rounded-2xl p-8"
              style={{ background: 'rgba(15,20,40,0.7)', border: `1px solid ${selectedMeta!.color}18`, backdropFilter: 'blur(20px)' }}>
              <div className="prose prose-sm prose-invert max-w-none"
                style={{ '--tw-prose-body': 'rgba(226,232,240,0.85)', '--tw-prose-headings': '#e2e8f0', '--tw-prose-code': '#c4b5fd', '--tw-prose-pre-bg': 'rgba(10,14,26,0.8)' } as React.CSSProperties}>
                <ReactMarkdown>{selected.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
