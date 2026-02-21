import { NextRequest } from 'next/server';
import { buildContextPrefix } from '@/lib/contextInjector';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { task, filePaths = [] } = body as { task: string; filePaths?: string[] };

    if (!task || typeof task !== 'string') {
      return Response.json(
        { data: null, error: 'task is required and must be a string' },
        { status: 400 }
      );
    }

    const { contextPrefix, matchedManuals } = await buildContextPrefix(task, filePaths);

    return Response.json({
      data: { contextPrefix, matchedManuals },
      error: null,
    });
  } catch (err) {
    console.error('[POST /api/context]', err);
    return Response.json(
      { data: null, error: 'Failed to build context' },
      { status: 500 }
    );
  }
}
