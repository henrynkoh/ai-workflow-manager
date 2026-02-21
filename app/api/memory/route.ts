import { NextRequest } from 'next/server';
import { loadMemory, saveMemoryFile } from '@/lib/memoryManager';

export async function GET() {
  try {
    const memory = await loadMemory();
    return Response.json({ data: memory, error: null });
  } catch (err) {
    console.error('[GET /api/memory]', err);
    return Response.json(
      { data: null, error: 'Failed to load memory files' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, content } = body as { name: 'plan' | 'notes' | 'checklist'; content: string };

    if (!name || !['plan', 'notes', 'checklist'].includes(name)) {
      return Response.json(
        { data: null, error: 'name must be one of: plan, notes, checklist' },
        { status: 400 }
      );
    }

    if (typeof content !== 'string') {
      return Response.json(
        { data: null, error: 'content must be a string' },
        { status: 400 }
      );
    }

    await saveMemoryFile(name, content);
    return Response.json({ data: { saved: true }, error: null });
  } catch (err) {
    console.error('[POST /api/memory]', err);
    return Response.json(
      { data: null, error: 'Failed to save memory file' },
      { status: 500 }
    );
  }
}
