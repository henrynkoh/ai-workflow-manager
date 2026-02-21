'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface Manual {
  name: string;
  file: string;
  keywords: string[];
  content: string;
}

export default function ManualsPage() {
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [selected, setSelected] = useState<Manual | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400 animate-pulse text-sm">Loading manuals...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Sidebar: manual list */}
      <aside className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto shrink-0">
        <h1 className="text-sm font-semibold text-gray-900 mb-4">Manuals</h1>
        <div className="space-y-2">
          {manuals.map(m => (
            <button
              key={m.file}
              onClick={() => setSelected(m)}
              className={`w-full text-left px-3 py-2.5 rounded-lg border transition-colors text-sm ${
                selected?.file === m.file
                  ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-8 bg-white">
        {selected ? (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{selected.name}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                {selected.keywords.map(kw => (
                  <span key={kw} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
            <div className="prose prose-sm max-w-3xl">
              <ReactMarkdown>{selected.content}</ReactMarkdown>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
            <div className="text-5xl mb-4">📚</div>
            <p className="text-sm">Select a manual to view its contents</p>
            <p className="text-xs mt-1">Manuals are auto-injected into Claude based on task keywords</p>
          </div>
        )}
      </main>
    </div>
  );
}
