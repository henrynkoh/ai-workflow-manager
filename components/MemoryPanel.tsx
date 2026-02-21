'use client';

import { useState, useEffect } from 'react';

interface MemoryFiles {
  plan: string;
  notes: string;
  checklist: string;
}

type MemoryTab = 'plan' | 'notes' | 'checklist';

const TAB_LABELS: Record<MemoryTab, string> = {
  plan: 'Project Plan',
  notes: 'Context Notes',
  checklist: 'Checklist',
};

export function MemoryPanel() {
  const [memory, setMemory] = useState<MemoryFiles>({ plan: '', notes: '', checklist: '' });
  const [activeTab, setActiveTab] = useState<MemoryTab>('checklist');
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMemory();
  }, []);

  async function loadMemory() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/memory');
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setMemory(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load memory');
    } finally {
      setLoading(false);
    }
  }

  function startEdit() {
    setEditContent(memory[activeTab]);
    setEditing(true);
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

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Memory</h3>
        <button
          onClick={loadMemory}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          title="Refresh memory files"
        >
          ↻
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1">
        {(Object.keys(TAB_LABELS) as MemoryTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setEditing(false); }}
            className={`flex-1 text-xs py-1 px-2 rounded transition-colors ${
              activeTab === tab
                ? 'bg-blue-100 text-blue-700 font-semibold'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab === 'plan' ? 'Plan' : tab === 'notes' ? 'Notes' : 'Tasks'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="rounded-lg border border-gray-200 bg-white">
        {loading ? (
          <div className="p-3 text-xs text-gray-400 animate-pulse">Loading memory files...</div>
        ) : error ? (
          <div className="p-3 text-xs text-red-500">{error}</div>
        ) : editing ? (
          <div className="flex flex-col gap-2 p-2">
            <textarea
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              className="w-full h-48 text-xs font-mono p-2 border border-gray-200 rounded resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setEditing(false)}
                className="text-xs px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={saving}
                className="text-xs px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <div className="relative group">
            <pre className="p-3 text-xs font-mono text-gray-700 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
              {memory[activeTab] || `_${TAB_LABELS[activeTab]} is empty_`}
            </pre>
            <button
              onClick={startEdit}
              className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
