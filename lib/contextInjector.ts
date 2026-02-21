import fs from 'fs/promises';
import path from 'path';

interface ManualEntry {
  name: string;
  file: string;
  keywords: string[];
}

interface ContextResult {
  contextPrefix: string;
  matchedManuals: string[];
}

const MANUALS_DIR = path.join(process.cwd(), 'manuals');
const TOC_FILE = path.join(MANUALS_DIR, 'toc.md');

async function parseToc(): Promise<ManualEntry[]> {
  const content = await fs.readFile(TOC_FILE, 'utf-8');
  const entries: ManualEntry[] = [];

  for (const line of content.split('\n')) {
    // Match table rows: | Name | file.md | keyword1, keyword2 |
    const match = line.match(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/);
    if (!match) continue;
    const [, name, file, keywordsRaw] = match;
    if (name.toLowerCase().includes('manual') || name.toLowerCase().includes('---')) continue;
    const keywords = keywordsRaw.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
    if (keywords.length === 0) continue;
    entries.push({ name: name.trim(), file: file.trim(), keywords });
  }

  return entries;
}

function scoreManual(entry: ManualEntry, taskLower: string, filePathsLower: string[]): number {
  let score = 0;
  for (const kw of entry.keywords) {
    if (taskLower.includes(kw)) score += 2;
    for (const fp of filePathsLower) {
      if (fp.includes(kw)) score += 1;
    }
  }
  return score;
}

export async function buildContextPrefix(
  task: string,
  filePaths: string[] = []
): Promise<ContextResult> {
  const entries = await parseToc();
  const taskLower = task.toLowerCase();
  const filePathsLower = filePaths.map(fp => fp.toLowerCase());

  // Score each manual
  const scored = entries
    .map(entry => ({ entry, score: scoreManual(entry, taskLower, filePathsLower) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3); // max 3 manuals

  if (scored.length === 0) {
    // Fallback: include general rules
    const generalEntry = entries.find(e => e.file === 'general_rules.md');
    if (generalEntry) {
      scored.push({ entry: generalEntry, score: 1 });
    }
  }

  const matchedManuals: string[] = [];
  const sections: string[] = [];

  for (const { entry } of scored) {
    const filePath = path.join(MANUALS_DIR, entry.file);
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      sections.push(`## ${entry.name}\n\n${content}`);
      matchedManuals.push(entry.name);
    } catch {
      // Skip missing manual files
    }
  }

  const contextPrefix = sections.length > 0
    ? `# Injected Manuals\n\nThe following project manuals are relevant to this task:\n\n${sections.join('\n\n---\n\n')}`
    : '';

  return { contextPrefix, matchedManuals };
}
