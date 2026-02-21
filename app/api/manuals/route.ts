import fs from 'fs/promises';
import path from 'path';

const MANUALS_DIR = path.join(process.cwd(), 'manuals');

interface ManualItem {
  name: string;
  file: string;
  keywords: string[];
}

async function parseManualsList(): Promise<ManualItem[]> {
  const tocPath = path.join(MANUALS_DIR, 'toc.md');
  const content = await fs.readFile(tocPath, 'utf-8');
  const items: ManualItem[] = [];

  for (const line of content.split('\n')) {
    const match = line.match(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/);
    if (!match) continue;
    const [, name, file, keywordsRaw] = match;
    if (name.toLowerCase().includes('manual') || name.toLowerCase().includes('---')) continue;
    const keywords = keywordsRaw.split(',').map(k => k.trim()).filter(Boolean);
    if (keywords.length === 0) continue;
    items.push({ name: name.trim(), file: file.trim(), keywords });
  }

  return items;
}

export async function GET() {
  try {
    const manuals = await parseManualsList();

    // Attach content for each manual
    const manualsWithContent = await Promise.all(
      manuals.map(async (m) => {
        try {
          const content = await fs.readFile(path.join(MANUALS_DIR, m.file), 'utf-8');
          return { ...m, content };
        } catch {
          return { ...m, content: '' };
        }
      })
    );

    return Response.json({ data: manualsWithContent, error: null });
  } catch (err) {
    console.error('[GET /api/manuals]', err);
    return Response.json(
      { data: null, error: 'Failed to load manuals' },
      { status: 500 }
    );
  }
}
