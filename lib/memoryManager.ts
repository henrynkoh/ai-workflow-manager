import fs from 'fs/promises';
import path from 'path';

const MEMORY_DIR = path.join(process.cwd(), 'memory');

export interface MemoryFiles {
  plan: string;
  notes: string;
  checklist: string;
}

async function readFile(filename: string): Promise<string> {
  try {
    return await fs.readFile(path.join(MEMORY_DIR, filename), 'utf-8');
  } catch {
    return '';
  }
}

async function writeFile(filename: string, content: string): Promise<void> {
  await fs.writeFile(path.join(MEMORY_DIR, filename), content, 'utf-8');
}

export async function loadMemory(): Promise<MemoryFiles> {
  const [plan, notes, checklist] = await Promise.all([
    readFile('project-plan.md'),
    readFile('context-notes.md'),
    readFile('task-checklist.md'),
  ]);
  return { plan, notes, checklist };
}

export async function saveChecklist(content: string): Promise<void> {
  await writeFile('task-checklist.md', content);
}

export async function appendToNotes(entry: string): Promise<void> {
  const existing = await readFile('context-notes.md');
  const timestamp = new Date().toISOString().split('T')[0];
  const newEntry = `\n\n## [${timestamp}] Update\n\n${entry}`;
  await writeFile('context-notes.md', existing + newEntry);
}

export async function saveMemoryFile(
  name: 'plan' | 'notes' | 'checklist',
  content: string
): Promise<void> {
  const fileMap: Record<string, string> = {
    plan: 'project-plan.md',
    notes: 'context-notes.md',
    checklist: 'task-checklist.md',
  };
  await writeFile(fileMap[name], content);
}

export function buildMemorySection(memory: MemoryFiles): string {
  return `# Project Memory

## Project Plan
${memory.plan || '_No project plan found._'}

---

## Context Notes
${memory.notes || '_No context notes found._'}

---

## Task Checklist
${memory.checklist || '_No checklist found._'}`;
}
