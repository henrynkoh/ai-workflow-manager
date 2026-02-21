'use client';

import { useState, useEffect } from 'react';

interface MemoryFiles {
  plan: string;
  notes: string;
  checklist: string;
}

type MemoryTab = 'plan' | 'notes' | 'checklist';

const TABS: { key: MemoryTab; label: string; emoji: string; color: string }[] = [
  { key: 'plan', label: 'Plan', emoji: '📋', color: '#3b82f6' },
  { key: 'notes', label: 'Notes', emoji: '📝', color: '#8b5cf6' },
  { key: 'checklist', label: 'Tasks', emoji: '✅', color: '#10b981' },
];

export function MemoryPanel() {
  const [memory, setMemory] = useState<MemoryFiles>({ plan: '', notes: '', checklist: '' });
  const [activeTab, setActiveTab] = useState<MemoryTab>('checklist');
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadMemory(); }, []);

  async function loadMemory() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/memory');
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setMemory(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  async function saveEdit() {
    setSaving(true);
    try {
      const res = await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: activeTab, content: editContent }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setMemory(prev => ({ ...prev, [activeTab]: editContent }));
      setEditing(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  const activeColor = TABS.find(t => t.key === activeTab)?.color ?? '#8b5cf6';

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#10b981', animation: 'pulse-dot 2s infinite' }} />
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'rgba(148,163,196,0.7)' }}>
            Memory
          </span>
        </div>
        <button onClick={loadMemory}
          className="text-xs px-2 py-1 rounded-md transition-all duration-150 hover:text-white"
          style={{ color: 'rgba(148,163,196,0.5)', background: 'rgba(99,120,255,0.06)' }}>
          ↻ Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-3 p-1 rounded-xl" style={{ background: 'rgba(10,14,26,0.6)', border: '1px solid rgba(99,120,255,0.08)' }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setEditing(false); }}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
            style={activeTab === tab.key ? {
              background: `linear-gradient(135deg, ${tab.color}22, ${tab.color}11)`,
              color: tab.color,
              boxShadow: `0 0 12px ${tab.color}22`,
              border: `1px solid ${tab.color}33`,
            } : {
              color: 'rgba(148,163,196,0.5)',
            }}
          >
            <span>{tab.emoji}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="rounded-xl overflow-hidden" style={{
        background: 'rgba(10,14,26,0.5)',
        border: `1px solid ${activeColor}22`,
        boxShadow: `0 0 20px ${activeColor}08`,
      }}>
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-6">
            <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: `${activeColor}44`, borderTopColor: activeColor }} />
            <span className="text-xs" style={{ color: 'rgba(148,163,196,0.5)' }}>Loading...</span>
          </div>
        ) : error ? (
          <div className="py-4 px-3 text-xs text-center" style={{ color: '#f87171' }}>{error}</div>
        ) : editing ? (
          <div>
            <textarea
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              className="w-full h-44 p-3 text-xs resize-none focus:outline-none"
              style={{
                background: 'transparent',
                color: '#e2e8f0',
                fontFamily: 'var(--font-geist-mono), monospace',
                lineHeight: '1.6',
              }}
            />
            <div className="flex gap-2 p-2 pt-0">
              <button onClick={() => setEditing(false)}
                className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ background: 'rgba(148,163,196,0.08)', color: 'rgba(148,163,196,0.7)' }}>
                Cancel
              </button>
              <button onClick={saveEdit} disabled={saving}
                className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                style={{ background: `linear-gradient(135deg, ${activeColor}, ${activeColor}bb)`, color: '#fff' }}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <div className="relative group">
            <pre className="p-3 text-xs whitespace-pre-wrap leading-relaxed max-h-44 overflow-y-auto"
              style={{ color: 'rgba(226,232,240,0.8)', fontFamily: 'var(--font-geist-mono), monospace' }}>
              {memory[activeTab] || '_(empty)_'}
            </pre>
            <button
              onClick={() => { setEditContent(memory[activeTab]); setEditing(true); }}
              className="absolute top-2 right-2 px-2.5 py-1 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-all"
              style={{ background: `${activeColor}22`, color: activeColor, border: `1px solid ${activeColor}44` }}>
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
