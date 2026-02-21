'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface MemoryFiles {
  plan: string;
  notes: string;
  checklist: string;
}

type MemoryTab = 'plan' | 'notes' | 'checklist';

const TABS: { key: MemoryTab; label: string; file: string }[] = [
  { key: 'plan', label: 'Project Plan', file: 'memory/project-plan.md' },
  { key: 'notes', label: 'Context Notes', file: 'memory/context-notes.md' },
  { key: 'checklist', label: 'Task Checklist', file: 'memory/task-checklist.md' },
];

export default function MemoryPage() {
  const [memory, setMemory] = useState<MemoryFiles>({ plan: '', notes: '', checklist: '' });
  const [activeTab, setActiveTab] = useState<MemoryTab>('plan');
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
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

  function startEdit() {
    setEditContent(memory[activeTab]);
    setEditing(true);
  }

  async function save() {
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
      alert(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  const activeTabMeta = TABS.find(t => t.key === activeTab)!;

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 p-4 shrink-0">
        <h1 className="text-sm font-semibold text-gray-900 mb-4">Memory Files</h1>
        <div className="space-y-1">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setEditing(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                activeTab === tab.key
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 leading-relaxed">
            Memory files are loaded into every Claude session as persistent context.
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-gray-200 shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{activeTabMeta.label}</h2>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{activeTabMeta.file}</p>
          </div>
          <div className="flex gap-2">
            {editing ? (
              <>
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={saving}
                  className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={load}
                  className="px-3 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                >
                  Refresh
                </button>
                <button
                  onClick={startEdit}
                  className="px-4 py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-900 text-white transition-colors"
                >
                  Edit
                </button>
              </>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-400 animate-pulse text-sm">Loading...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-red-500 text-sm">{error}</div>
            </div>
          ) : editing ? (
            <textarea
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              className="w-full h-full px-8 py-6 text-sm font-mono resize-none focus:outline-none"
            />
          ) : (
            <div className="overflow-y-auto h-full px-8 py-6">
              {memory[activeTab] ? (
                <div className="prose prose-sm max-w-3xl">
                  <ReactMarkdown>{memory[activeTab]}</ReactMarkdown>
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                  This memory file is empty.
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
