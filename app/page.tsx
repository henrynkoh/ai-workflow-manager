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
    <div className="flex h-full">
      {/* Left sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col overflow-y-auto p-4 gap-6 shrink-0">
        <ShortcutBar onShortcut={setShortcutTask} />
        <div className="border-t border-gray-100 pt-4">
          <MemoryPanel />
        </div>
      </aside>

      {/* Center: Chat */}
      <main className="flex-1 flex flex-col p-6 min-w-0">
        <ChatInterface
          onMatchedManualsChange={setMatchedManuals}
          initialTask={shortcutTask}
        />
      </main>

      {/* Right sidebar: Manuals browser */}
      <aside className="w-72 bg-white border-l border-gray-200 flex flex-col overflow-y-auto p-4 shrink-0">
        <ManualsBrowser matchedManuals={matchedManuals} />
      </aside>
    </div>
  );
}
