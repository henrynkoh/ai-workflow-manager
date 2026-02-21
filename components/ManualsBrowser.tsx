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
        setError(err instanceof Error ? err.message : 'Failed to load manuals');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Manuals</h3>
        <div className="text-xs text-gray-400 animate-pulse">Loading manuals...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Manuals</h3>
        <div className="text-xs text-red-500">{error}</div>
      </div>
    );
  }

  if (selected) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => setSelected(null)}
            className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back
          </button>
          <h3 className="text-sm font-semibold text-gray-800 truncate">{selected.name}</h3>
          {matchedManuals.includes(selected.name) && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              Injected
            </span>
          )}
        </div>
        <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-white">
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{selected.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Manuals</h3>
        {matchedManuals.length > 0 && (
          <span className="text-xs text-green-600 font-medium">
            {matchedManuals.length} injected
          </span>
        )}
      </div>
      <div className="space-y-2">
        {manuals.map(manual => {
          const isMatched = matchedManuals.includes(manual.name);
          return (
            <button
              key={manual.file}
              onClick={() => setSelected(manual)}
              className={`w-full text-left px-3 py-2.5 rounded-lg border transition-colors ${
                isMatched
                  ? 'bg-green-50 border-green-300 hover:bg-green-100'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-800">{manual.name}</span>
                {isMatched && (
                  <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded font-medium">
                    ✓ used
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {manual.keywords.slice(0, 5).map(kw => (
                  <span
                    key={kw}
                    className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded"
                  >
                    {kw}
                  </span>
                ))}
                {manual.keywords.length > 5 && (
                  <span className="text-xs text-gray-400">+{manual.keywords.length - 5} more</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
