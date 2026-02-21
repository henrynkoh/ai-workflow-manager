import { NextRequest } from 'next/server';
import { buildContextPrefix } from '@/lib/contextInjector';
import { loadMemory, buildMemorySection } from '@/lib/memoryManager';
import { sendToClaude, buildSystemPrompt } from '@/lib/claudeClient';

function extractModifiedFiles(response: string): string[] {
  const match = response.match(/MODIFIED_FILES:\n([\s\S]*?)(?:\n\n|$)/);
  if (!match) return [];
  return match[1]
    .split('\n')
    .map(line => line.replace(/^-\s*/, '').trim())
    .filter(Boolean);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { task, filePaths = [], agent_id = 'user' } = body as {
      task: string;
      filePaths?: string[];
      agent_id?: string;
    };

    if (!task || typeof task !== 'string') {
      return Response.json(
        { data: null, error: 'task is required and must be a string' },
        { status: 400 }
      );
    }

    // Build context: manuals + memory
    const [{ contextPrefix, matchedManuals }, memory] = await Promise.all([
      buildContextPrefix(task, filePaths),
      loadMemory(),
    ]);

    const memorySection = buildMemorySection(memory);
    const systemPrompt = buildSystemPrompt(contextPrefix, memorySection);

    // Call Claude (prepend agent identity to task for context)
    const agentTask = agent_id !== 'user' ? `[Agent: ${agent_id}]\n${task}` : task;
    const response = await sendToClaude(systemPrompt, agentTask);

    // Extract MODIFIED_FILES if present
    const modifiedFiles = extractModifiedFiles(response);

    return Response.json({
      data: {
        response,
        matchedManuals,
        modifiedFiles,
        agent_id,
      },
      error: null,
    });
  } catch (err) {
    console.error('[POST /api/chat]', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json(
      { data: null, error: `Chat request failed: ${message}` },
      { status: 500 }
    );
  }
}
