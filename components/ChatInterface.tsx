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

const EXAMPLE_PROMPTS = [
  { text: 'Add user login endpoint', tags: ['backend', 'security'] },
  { text: 'Fix React button component', tags: ['frontend'] },
  { text: 'Create Prisma users migration', tags: ['database'] },
  { text: 'Add JWT auth middleware', tags: ['security', 'backend'] },
];

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  backend:  { bg: 'rgba(139,92,246,0.15)',  text: '#a78bfa' },
  frontend: { bg: 'rgba(59,130,246,0.15)',  text: '#60a5fa' },
  security: { bg: 'rgba(239,68,68,0.15)',   text: '#f87171' },
  database: { bg: 'rgba(16,185,129,0.15)',  text: '#34d399' },
};

export function ChatInterface({ onMatchedManualsChange, initialTask = '' }: ChatInterfaceProps) {
  const [task, setTask] = useState(initialTask);
  const [filePaths, setFilePaths] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { if (initialTask) setTask(initialTask); }, [initialTask]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!task.trim() || loading) return;

    const userMessage = task.trim();
    const paths = filePaths.split(',').map(p => p.trim()).filter(Boolean);

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
      setMessages(prev => [...prev, { role: 'assistant', content: response, matchedManuals, modifiedFiles }]);
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
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5 min-h-0">
        {messages.length === 0 ? (
          /* Empty state hero */
          <div className="flex flex-col items-center justify-center h-full text-center pb-8">
            <div className="float mb-5">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-2xl"
                style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', boxShadow: '0 0 40px rgba(139,92,246,0.4)' }}>
                🤖
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ background: 'linear-gradient(135deg,#c4b5fd,#f9a8d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AI Workflow Manager
            </h2>
            <p className="text-sm mb-8 max-w-sm" style={{ color: 'rgba(148,163,196,0.7)' }}>
              Describe your task and the right coding manuals will be automatically injected into the prompt.
            </p>

            {/* Example prompts */}
            <div className="grid grid-cols-2 gap-2 w-full max-w-lg">
              {EXAMPLE_PROMPTS.map((p) => (
                <button key={p.text} onClick={() => setTask(p.text)}
                  className="text-left p-3 rounded-xl transition-all duration-200 group"
                  style={{
                    background: 'rgba(20,27,55,0.6)',
                    border: '1px solid rgba(99,120,255,0.12)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.border = '1px solid rgba(139,92,246,0.35)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(25,33,70,0.8)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.border = '1px solid rgba(99,120,255,0.12)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(20,27,55,0.6)';
                  }}
                >
                  <p className="text-xs font-medium mb-2" style={{ color: 'rgba(226,232,240,0.9)' }}>{p.text}</p>
                  <div className="flex gap-1 flex-wrap">
                    {p.tags.map(tag => (
                      <span key={tag} className="text-xs px-1.5 py-0.5 rounded font-medium"
                        style={{
                          background: (TAG_COLORS[tag] ?? { bg: 'rgba(99,120,255,0.1)', text: '#94a3c4' }).bg,
                          color: (TAG_COLORS[tag] ?? { bg: 'rgba(99,120,255,0.1)', text: '#94a3c4' }).text,
                        }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i}
              className={`flex gap-3 animate-in ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              style={{ animationDelay: `${i * 0.05}s` }}>
              {/* Avatar */}
              <div className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold"
                style={msg.role === 'user'
                  ? { background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', boxShadow: '0 0 12px rgba(139,92,246,0.3)' }
                  : { background: 'linear-gradient(135deg,#1e3a5f,#1e2d4f)', border: '1px solid rgba(59,130,246,0.3)' }
                }>
                {msg.role === 'user' ? '👤' : '🤖'}
              </div>

              {/* Bubble */}
              <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
                {msg.role === 'assistant' && msg.matchedManuals && msg.matchedManuals.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 px-3 py-2 rounded-xl"
                    style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                    <span className="text-xs" style={{ color: 'rgba(148,163,196,0.6)' }}>Injected:</span>
                    {msg.matchedManuals.map(m => (
                      <span key={m} className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)' }}>
                        ✓ {m}
                      </span>
                    ))}
                  </div>
                )}

                <div className="rounded-2xl px-4 py-3"
                  style={msg.role === 'user' ? {
                    background: 'linear-gradient(135deg,rgba(139,92,246,0.25),rgba(236,72,153,0.15))',
                    border: '1px solid rgba(139,92,246,0.3)',
                    color: '#f0f4ff',
                    boxShadow: '0 4px 20px rgba(139,92,246,0.15)',
                  } : {
                    background: 'rgba(15,22,45,0.8)',
                    border: '1px solid rgba(99,120,255,0.15)',
                    color: 'rgba(226,232,240,0.9)',
                  }}>
                  {msg.role === 'user' ? (
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div className="prose prose-sm prose-invert max-w-none text-sm"
                      style={{ '--tw-prose-body': 'rgba(226,232,240,0.85)' } as React.CSSProperties}>
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                </div>

                {msg.role === 'assistant' && msg.modifiedFiles && msg.modifiedFiles.length > 0 && (
                  <div className="px-3 py-2 rounded-xl w-full"
                    style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
                    <p className="text-xs font-bold mb-1.5" style={{ color: 'rgba(148,163,196,0.7)' }}>MODIFIED_FILES</p>
                    <div className="flex flex-col gap-1">
                      {msg.modifiedFiles.map(f => (
                        <span key={f} className="text-xs px-2 py-1 rounded-lg"
                          style={{ background: 'rgba(139,92,246,0.1)', color: '#c4b5fd', fontFamily: 'var(--font-geist-mono), monospace', border: '1px solid rgba(139,92,246,0.2)' }}>
                          📄 {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* Loading */}
        {loading && (
          <div className="flex gap-3 animate-in">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg,#1e3a5f,#1e2d4f)', border: '1px solid rgba(59,130,246,0.3)' }}>
              🤖
            </div>
            <div className="px-4 py-3 rounded-2xl flex items-center gap-3"
              style={{ background: 'rgba(15,22,45,0.8)', border: '1px solid rgba(99,120,255,0.15)' }}>
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg,#8b5cf6,#ec4899)',
                      animation: `bounce-dot 1.2s ${i * 0.2}s ease-in-out infinite`,
                    }} />
                ))}
              </div>
              <span className="text-xs" style={{ color: 'rgba(148,163,196,0.6)' }}>
                Building context + calling Claude…
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="px-4 py-3 rounded-xl text-sm"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
            ⚠️ {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="px-4 pb-4 pt-2 shrink-0">
        <form onSubmit={handleSubmit}>
          <div className="rounded-2xl overflow-hidden transition-all duration-200"
            style={{
              background: 'rgba(15,20,40,0.8)',
              border: focused ? '1px solid rgba(139,92,246,0.5)' : '1px solid rgba(99,120,255,0.15)',
              boxShadow: focused ? '0 0 0 3px rgba(139,92,246,0.1), 0 8px 32px rgba(0,0,0,0.3)' : '0 4px 16px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(20px)',
            }}>
            <textarea
              ref={textareaRef}
              value={task}
              onChange={e => setTask(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Describe your task… (⌘+Enter to send)"
              rows={3}
              className="w-full px-4 pt-4 pb-2 text-sm resize-none focus:outline-none"
              style={{
                background: 'transparent',
                color: '#f0f4ff',
              }}
            />
            <div className="flex items-center gap-2 px-3 pb-3">
              <input
                type="text"
                value={filePaths}
                onChange={e => setFilePaths(e.target.value)}
                placeholder="📁 File paths (optional): src/api/auth.ts, components/Form.tsx"
                className="flex-1 px-3 py-1.5 rounded-lg text-xs focus:outline-none transition-all"
                style={{
                  background: 'rgba(10,14,26,0.6)',
                  border: '1px solid rgba(99,120,255,0.1)',
                  color: 'rgba(148,163,196,0.8)',
                  fontFamily: 'var(--font-geist-mono), monospace',
                }}
              />
              <button
                type="submit"
                disabled={!task.trim() || loading}
                className="px-4 py-1.5 rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
                style={{
                  background: task.trim() && !loading ? 'linear-gradient(135deg,#8b5cf6,#ec4899)' : 'rgba(139,92,246,0.2)',
                  color: '#fff',
                  boxShadow: task.trim() && !loading ? '0 4px 16px rgba(139,92,246,0.4)' : 'none',
                }}>
                {loading ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Send <span className="opacity-70 text-xs">⌘↵</span></>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
