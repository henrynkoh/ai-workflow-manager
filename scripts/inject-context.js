#!/usr/bin/env node
/**
 * inject-context.js — Standalone context injection script
 *
 * Usage:
 *   node scripts/inject-context.js "Add user login endpoint" src/api/auth.ts
 *   node scripts/inject-context.js "Fix react button" src/components/Button.tsx
 *
 * Output: Full prompt prefix with matched manuals printed to stdout
 */

const fs = require('fs');
const path = require('path');

const MANUALS_DIR = path.join(__dirname, '..', 'manuals');
const TOC_FILE = path.join(MANUALS_DIR, 'toc.md');

function parseToc() {
  const content = fs.readFileSync(TOC_FILE, 'utf-8');
  const entries = [];

  for (const line of content.split('\n')) {
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

function scoreManual(entry, taskLower, filePathsLower) {
  let score = 0;
  for (const kw of entry.keywords) {
    if (taskLower.includes(kw)) score += 2;
    for (const fp of filePathsLower) {
      if (fp.includes(kw)) score += 1;
    }
  }
  return score;
}

function buildContextPrefix(task, filePaths = []) {
  const entries = parseToc();
  const taskLower = task.toLowerCase();
  const filePathsLower = filePaths.map(fp => fp.toLowerCase());

  const scored = entries
    .map(entry => ({ entry, score: scoreManual(entry, taskLower, filePathsLower) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (scored.length === 0) {
    const generalEntry = entries.find(e => e.file === 'general_rules.md');
    if (generalEntry) {
      scored.push({ entry: generalEntry, score: 1 });
    }
  }

  const matchedManuals = [];
  const sections = [];

  for (const { entry } of scored) {
    const filePath = path.join(MANUALS_DIR, entry.file);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      sections.push(`## ${entry.name}\n\n${content}`);
      matchedManuals.push(entry.name);
    } catch {
      // Skip missing files
    }
  }

  const contextPrefix = sections.length > 0
    ? `# Injected Manuals\n\nThe following project manuals are relevant to this task:\n\n${sections.join('\n\n---\n\n')}`
    : '# No manuals matched for this task.';

  return { contextPrefix, matchedManuals };
}

// ─── Main ────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: node scripts/inject-context.js "task description" [file1.ts] [file2.tsx]');
  console.error('');
  console.error('Examples:');
  console.error('  node scripts/inject-context.js "Add user login endpoint" src/api/auth.ts');
  console.error('  node scripts/inject-context.js "Fix react button" src/components/Button.tsx');
  process.exit(1);
}

const task = args[0];
const filePaths = args.slice(1);

try {
  const { contextPrefix, matchedManuals } = buildContextPrefix(task, filePaths);

  console.log('═'.repeat(60));
  console.log('MATCHED MANUALS:', matchedManuals.join(', ') || 'none');
  console.log('═'.repeat(60));
  console.log('');
  console.log(contextPrefix);
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
