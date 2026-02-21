'use client';

import { useState } from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { ShortcutBar } from '@/components/ShortcutBar';
import { MemoryPanel } from '@/components/MemoryPanel';
import { ManualsBrowser } from '@/components/ManualsBrowser';

export default function HomePage() {
  const [matchedManuals, setMatchedManuals] = useState<string[]>([]);
  const [shortcutTask, setShortcutTask] = useState('');

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left sidebar */}
      <aside
        className="w-72 shrink-0 flex flex-col overflow-y-auto overflow-x-hidden p-4 gap-5"
        style={{
          background: 'rgba(10,14,26,0.6)',
          borderRight: '1px solid rgba(99,120,255,0.1)',
          backdropFilter: 'blur(24px)',
        }}
      >
        <ShortcutBar onShortcut={setShortcutTask} />
        <div className="h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(139,92,246,0.25),transparent)' }} />
        <MemoryPanel />
      </aside>

      {/* Center: Chat */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden"
        style={{ background: 'rgba(8,12,24,0.5)' }}>
        <ChatInterface
          onMatchedManualsChange={setMatchedManuals}
          initialTask={shortcutTask}
        />
      </main>

      {/* Right sidebar: Manuals */}
      <aside
        className="w-72 shrink-0 flex flex-col overflow-y-auto overflow-x-hidden p-4"
        style={{
          background: 'rgba(10,14,26,0.6)',
          borderLeft: '1px solid rgba(99,120,255,0.1)',
          backdropFilter: 'blur(24px)',
        }}
      >
        <ManualsBrowser matchedManuals={matchedManuals} />
      </aside>
    </div>
  );
}
