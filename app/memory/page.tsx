'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface MemoryFiles { plan: string; notes: string; checklist: string; }
type MemoryTab = 'plan' | 'notes' | 'checklist';

const TABS = [
  { key: 'plan' as MemoryTab,      label: 'Project Plan',   emoji: '📋', file: 'memory/project-plan.md',   color: '#3b82f6', gradient: 'linear-gradient(135deg,#3b82f6,#06b6d4)' },
  { key: 'notes' as MemoryTab,     label: 'Context Notes',  emoji: '📝', file: 'memory/context-notes.md',  color: '#8b5cf6', gradient: 'linear-gradient(135deg,#8b5cf6,#ec4899)' },
  { key: 'checklist' as MemoryTab, label: 'Task Checklist', emoji: '✅', file: 'memory/task-checklist.md', color: '#10b981', gradient: 'linear-gradient(135deg,#10b981,#34d399)' },
];

export default function MemoryPage() {
  const [memory, setMemory] = useState<MemoryFiles>({ plan: '', notes: '', checklist: '' });
  const [activeTab, setActiveTab] = useState<MemoryTab>('checklist');
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true); setError(null);
    try {
      const r = await fetch('/api/memory');
      const j = await r.json();
      if (j.error) throw new Error(j.error);
      setMemory(j.data);
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed'); }
    finally { setLoading(false); }
  }

  async function save() {
    setSaving(true);
    try {
      const r = await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: activeTab, content: editContent }),
      });
      const j = await r.json();
      if (j.error) throw new Error(j.error);
      setMemory(prev => ({ ...prev, [activeTab]: editContent }));
      setEditing(false);
    } catch (e) { alert(e instanceof Error ? e.message : 'Failed'); }
    finally { setSaving(false); }
  }

  const tab = TABS.find(t => t.key === activeTab)!;

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left sidebar */}
      <aside className="w-56 shrink-0 flex flex-col p-4"
        style={{ background: 'rgba(10,14,26,0.7)', borderRight: '1px solid rgba(99,120,255,0.1)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center gap-2 mb-5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
            style={{ background: 'linear-gradient(135deg,#10b981,#34d399)' }}>🧠</div>
          <span className="font-bold text-sm">Memory Files</span>
        </div>

        <div className="flex flex-col gap-2">
          {TABS.map(t => (
            <button key={t.key} onClick={() => { setActiveTab(t.key); setEditing(false); }}
              className="w-full text-left px-3 py-3 rounded-xl text-sm transition-all duration-200"
              style={{
                background: activeTab === t.key ? `linear-gradient(135deg,${t.color}15,${t.color}08)` : 'transparent',
                border: activeTab === t.key ? `1px solid ${t.color}35` : '1px solid transparent',
                color: activeTab === t.key ? t.color : 'rgba(148,163,196,0.7)',
                fontWeight: activeTab === t.key ? '600' : '400',
              }}>
              <div className="flex items-center gap-2">
                <span>{t.emoji}</span>
                <span>{t.label}</span>
              </div>
              <div className="text-xs mt-1 opacity-60 font-mono" style={{ fontSize: '10px' }}>{t.file}</div>
            </button>
          ))}
        </div>

        <div className="mt-auto pt-4">
          <div className="rounded-xl p-3 text-xs leading-relaxed"
            style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', color: 'rgba(148,163,196,0.7)' }}>
            💡 Memory files are loaded into every Claude request as persistent context.
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden" style={{ background: 'rgba(8,12,24,0.4)' }}>
        {/* Header bar */}
        <div className="flex items-center justify-between px-8 py-4 shrink-0"
          style={{ borderBottom: '1px solid rgba(99,120,255,0.1)', background: 'rgba(10,14,26,0.5)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: tab.gradient, boxShadow: `0 4px 16px ${tab.color}33` }}>
              {tab.emoji}
            </div>
            <div>
              <h2 className="font-bold" style={{ color: tab.color }}>{tab.label}</h2>
              <p className="text-xs font-mono opacity-50">{tab.file}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {editing ? (
              <>
                <button onClick={() => setEditing(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                  style={{ background: 'rgba(148,163,196,0.08)', color: 'rgba(148,163,196,0.7)', border: '1px solid rgba(99,120,255,0.1)' }}>
                  Cancel
                </button>
                <button onClick={save} disabled={saving}
                  className="px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                  style={{ background: tab.gradient, color: '#fff', boxShadow: `0 4px 16px ${tab.color}33` }}>
                  {saving && <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </>
            ) : (
              <>
                <button onClick={load}
                  className="px-3 py-2 rounded-xl text-sm font-medium transition-all"
                  style={{ background: 'rgba(148,163,196,0.06)', color: 'rgba(148,163,196,0.6)', border: '1px solid rgba(99,120,255,0.1)' }}>
                  ↻ Refresh
                </button>
                <button onClick={() => { setEditContent(memory[activeTab]); setEditing(true); }}
                  className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
                  style={{ background: `${tab.color}18`, color: tab.color, border: `1px solid ${tab.color}35` }}>
                  ✏️ Edit
                </button>
              </>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full gap-3">
              <div className="w-5 h-5 border-2 border-t-transparent animate-spin rounded-full"
                style={{ borderColor: `${tab.color}33`, borderTopColor: tab.color }} />
              <span className="text-sm" style={{ color: 'rgba(148,163,196,0.5)' }}>Loading…</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>{error}</div>
            </div>
          ) : editing ? (
            <textarea
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              className="w-full h-full px-8 py-6 text-sm focus:outline-none resize-none"
              style={{
                background: 'transparent',
                color: 'rgba(226,232,240,0.9)',
                fontFamily: 'var(--font-geist-mono), monospace',
                lineHeight: '1.7',
              }}
            />
          ) : (
            <div className="overflow-y-auto h-full px-8 py-6">
              {memory[activeTab] ? (
                <div className="prose prose-sm prose-invert max-w-3xl"
                  style={{ '--tw-prose-body': 'rgba(226,232,240,0.85)', '--tw-prose-headings': '#e2e8f0' } as React.CSSProperties}>
                  <ReactMarkdown>{memory[activeTab]}</ReactMarkdown>
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-sm" style={{ color: 'rgba(148,163,196,0.4)' }}>
                  This memory file is empty. Click Edit to add content.
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
