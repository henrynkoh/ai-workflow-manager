'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  matchedManuals?: string[];
  modifiedFiles?: string[];
}

interface ChatInterfaceProps {
  onMatchedManualsChange: (manuals: string[]) => void;
  initialTask?: string;
}

export function ChatInterface({ onMatchedManualsChange, initialTask = '' }: ChatInterfaceProps) {
  const [task, setTask] = useState(initialTask);
  const [filePaths, setFilePaths] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialTask) setTask(initialTask);
  }, [initialTask]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!task.trim() || loading) return;

    const userMessage = task.trim();
    const paths = filePaths
      .split(',')
      .map(p => p.trim())
      .filter(Boolean);

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setTask('');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: userMessage, filePaths: paths }),
      });

      const json = await res.json();
      if (json.error) throw new Error(json.error);

      const { response, matchedManuals, modifiedFiles } = json.data;

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: response, matchedManuals, modifiedFiles },
      ]);

      onMatchedManualsChange(matchedManuals ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-0">
        {messages.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">🤖</div>
            <p className="text-sm font-medium text-gray-500">AI Workflow Manager</p>
            <p className="text-xs mt-1">Type a task and relevant manuals will be auto-injected</p>
            <div className="mt-4 text-xs text-gray-400 space-y-1">
              <p>Try: <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">Add user login endpoint</span></p>
              <p>Try: <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">Fix React button component</span></p>
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <>
                    {/* Injected manuals badge */}
                    {msg.matchedManuals && msg.matchedManuals.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3 pb-3 border-b border-gray-100">
                        <span className="text-xs text-gray-400">Injected:</span>
                        {msg.matchedManuals.map(m => (
                          <span key={m} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                            {m}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Response content */}
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>

                    {/* Modified files */}
                    {msg.modifiedFiles && msg.modifiedFiles.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 mb-1">MODIFIED_FILES:</p>
                        <ul className="space-y-0.5">
                          {msg.modifiedFiles.map(f => (
                            <li key={f} className="text-xs font-mono text-gray-600 bg-gray-50 px-2 py-0.5 rounded">
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
                Building context + calling Claude...
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="space-y-2 shrink-0">
        <div className="relative">
          <textarea
            value={task}
            onChange={e => setTask(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your task... (⌘+Enter to submit)"
            rows={3}
            className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <button
            type="submit"
            disabled={!task.trim() || loading}
            className="absolute bottom-3 right-3 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
        <input
          type="text"
          value={filePaths}
          onChange={e => setFilePaths(e.target.value)}
          placeholder="File paths (optional, comma-separated): src/api/users.ts, components/Form.tsx"
          className="w-full px-4 py-2 border border-gray-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-600 placeholder-gray-400"
        />
      </form>
    </div>
  );
}
