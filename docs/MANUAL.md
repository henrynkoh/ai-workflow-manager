# AI Workflow Manager — Full Manual

## Table of Contents
1. [Overview](#overview)
2. [The 4-System Framework](#the-4-system-framework)
3. [Installation & Configuration](#installation--configuration)
4. [Dashboard Interface](#dashboard-interface)
5. [Manuals System](#manuals-system)
6. [Memory System](#memory-system)
7. [Shortcut Commands](#shortcut-commands)
8. [Quality Gates](#quality-gates)
9. [API Reference](#api-reference)
10. [CLI Tool](#cli-tool)
11. [Customization](#customization)
12. [Troubleshooting](#troubleshooting)

---

## Overview

AI Workflow Manager solves the #1 problem with AI coding assistants: **inconsistency**. Without external structure, LLMs:

- Forget your project conventions after every session
- Ignore security rules you told them last week
- Write backend code without error handling — again
- Never update task lists or log what they changed

This tool wraps Claude with four external systems that enforce consistency regardless of context window limits.

---

## The 4-System Framework

### System 1: Manuals
Rule files stored as markdown that define how code should be written in your project. The system automatically detects which manuals are relevant to each task by matching keywords, then injects them into the Claude system prompt.

**Example:** When you type `"Add user login endpoint"`, the system:
1. Scans `manuals/toc.md` for keyword matches
2. Finds `auth`, `api`, `endpoint` → matches Backend Rules + Security Rules
3. Prepends both manuals to Claude's system prompt
4. Claude now writes code following those exact rules

### System 2: Memory
Three persistent markdown files that Claude reads every session:
- **Project Plan** — what you're building and why
- **Context Notes** — decisions made, gotchas discovered
- **Task Checklist** — what's done, in progress, and next

### System 3: Quality Gates
A 7-point self-check mandatory at the end of every Claude response:
- Manual compliance
- Error handling
- Type safety
- Security
- Input validation
- Loading/error states
- MODIFIED_FILES logged

### System 4: Shortcuts
Pre-built prompt templates for common workflows triggered by one click.

---

## Installation & Configuration

### Requirements
- Node.js 18 or higher
- npm 9 or higher
- Anthropic API key (get at console.anthropic.com)

### Install Steps

```bash
git clone https://github.com/henrynkoh/ai-workflow-manager.git
cd ai-workflow-manager
npm install
cp .env.local.example .env.local  # then edit with your key
npm run dev
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key |

### Configuration Files

| File | Purpose |
|------|---------|
| `manuals/toc.md` | Maps manual files to trigger keywords |
| `memory/*.md` | Persistent project context |
| `quality-gates/reviewer-prompt.md` | Self-check criteria |

---

## Dashboard Interface

The dashboard (`/`) has three columns:

### Left Sidebar
- **Shortcut Buttons** — `/continue`, `/plan`, `/review`, `/add-rule`
- **Memory Panel** — tabbed view of all 3 memory files with inline editing

### Center — Chat Interface
- **Task input** — describe what you want to build
- **File paths** — optional comma-separated file paths to improve manual matching
- **Message history** — shows injected manuals badges and MODIFIED_FILES per response

### Right Sidebar — Manuals Browser
- Lists all 5 manuals
- Highlights matched manuals in green after each request
- Click any manual to read its full content

---

## Manuals System

### File Location
All manuals live in `manuals/`. The `toc.md` file maps each manual to its trigger keywords.

### toc.md Format
```markdown
| manual name | filename.md | keyword1, keyword2, keyword3 |
```

### Built-in Manuals

#### backend_rules.md
Triggered by: `api, route, server, express, node, endpoint, handler, middleware`

Rules cover:
- Consistent `{ data, error }` response shape
- Proper HTTP status codes
- Error handling with try/catch
- No internal error message leakage
- Rate limiting

#### frontend_rules.md
Triggered by: `react, component, tsx, jsx, ui, hook, state, props, render, page`

Rules cover:
- TypeScript typed props (no `any`)
- Functional components only
- Loading and error states required
- Component size limit (150 lines)
- Tailwind utility classes

#### security_rules.md
Triggered by: `auth, security, jwt, password, sql, injection, xss, token, session`

Rules cover:
- Password hashing (bcrypt min 12 rounds)
- JWT expiry and storage
- SQL injection prevention
- XSS prevention
- Input validation with schema libraries

#### database_rules.md
Triggered by: `prisma, sql, query, migration, schema, database, db, table`

Rules cover:
- Required id + timestamp fields
- Explicit column selection (no SELECT *)
- Pagination on all list queries
- No N+1 queries
- Atomic transactions

#### general_rules.md
Triggered by: `naming, comments, git, commit, style, refactor, convention`

Rules cover:
- Naming conventions (camelCase, PascalCase, SCREAMING_SNAKE_CASE)
- Comment style (why, not what)
- Conventional commit format
- Code style (2 spaces, 100 char limit)
- DRY principle

### Adding a Custom Manual

1. Create `manuals/my_rules.md`
2. Add to `manuals/toc.md`:
   ```
   | My Rules | my_rules.md | keyword1, keyword2, keyword3 |
   ```
3. Restart the dev server — new manual is live

---

## Memory System

### Files

| File | Key | Content |
|------|-----|---------|
| `memory/project-plan.md` | `plan` | Project goals, tech stack, decisions |
| `memory/context-notes.md` | `notes` | Running log of discoveries and notes |
| `memory/task-checklist.md` | `checklist` | In progress, completed, backlog tasks |

### How Memory Works
Every call to `/api/chat` loads all 3 files and appends them to the system prompt after the manuals. Claude sees the full project context on every request.

### Editing Memory
- **In the browser:** Click the memory panel tabs, hover the content, click Edit
- **Full-screen editor:** Navigate to `/memory`
- **Via API:** `POST /api/memory` with `{ name, content }`
- **Direct file edit:** Edit `memory/*.md` files directly; changes are picked up on next request

---

## Shortcut Commands

### /continue
Loads all memory files and resumes the next incomplete checklist item. Use after:
- Taking a break
- Starting a new session
- Switching tasks

### /plan
Generates a full implementation plan before writing any code. The plan includes:
- Goal definition
- Files to modify
- Numbered steps
- Edge cases
- Testing approach

### /review
Performs a post-task code review against all matched manual rules. Outputs PASS/FAIL for each check with specific line references.

### /add-rule
Adds a new rule to a specified manual with a Good/Bad code example and rationale.

---

## Quality Gates

### Mandatory Self-Check
Every Claude response ends with this quality gate (auto-appended to system prompt):

```
QUALITY_GATE_RESULTS:
- Manual compliance: PASS/FAIL
- Error handling: PASS/FAIL
- Type safety: PASS/FAIL
- Security: PASS/FAIL
- Validation: PASS/FAIL
- Loading/Error states: PASS/FAIL (or N/A)
- MODIFIED_FILES logged: PASS/FAIL
```

### MODIFIED_FILES Log
Claude is instructed to list every file changed at the end of its response. The UI parses this and displays it as a distinct section with monospace file paths.

---

## API Reference

All API routes return `{ data: T | null, error: string | null }`.

### POST /api/chat
```typescript
// Request
{ task: string; filePaths?: string[] }

// Response
{
  data: {
    response: string;
    matchedManuals: string[];
    modifiedFiles: string[];
  }
}
```

### POST /api/context
```typescript
// Request
{ task: string; filePaths?: string[] }

// Response
{
  data: {
    contextPrefix: string;
    matchedManuals: string[];
  }
}
```

### GET /api/memory
```typescript
// Response
{
  data: {
    plan: string;
    notes: string;
    checklist: string;
  }
}
```

### POST /api/memory
```typescript
// Request
{ name: 'plan' | 'notes' | 'checklist'; content: string }

// Response
{ data: { saved: true } }
```

### GET /api/manuals
```typescript
// Response
{
  data: Array<{
    name: string;
    file: string;
    keywords: string[];
    content: string;
  }>
}
```

---

## CLI Tool

```bash
# Basic usage
node scripts/inject-context.js "<task>" [file1] [file2]

# Examples
node scripts/inject-context.js "Add auth middleware" src/middleware.ts
node scripts/inject-context.js "Create users table migration" prisma/schema.prisma
node scripts/inject-context.js "Fix button component" src/components/Button.tsx

# Output: matched manuals + full context prefix printed to stdout
```

Useful for:
- Piping context into other tools
- CI/CD integrations
- Testing keyword matching without the UI

---

## Customization

### Change the Claude Model
Edit `lib/claudeClient.ts`:
```typescript
export async function sendToClaude(
  systemPrompt: string,
  userMessage: string,
  model = 'claude-opus-4-6'  // change here
)
```

### Change Max Manuals Injected
Edit `lib/contextInjector.ts`:
```typescript
.slice(0, 3)  // change 3 to your preferred max
```

### Add Quality Gate Criteria
Edit `lib/claudeClient.ts` — the `QUALITY_GATE` constant.

### Modify Memory File Names
Edit `lib/memoryManager.ts` — the `fileMap` object in `saveMemoryFile`.

---

## Troubleshooting

### "ANTHROPIC_API_KEY not set"
Add your key to `.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-...
```

### "Failed to load manuals"
Ensure `manuals/toc.md` exists and is formatted as a markdown table.

### No manuals matched
Check that your task keywords appear in `manuals/toc.md`. Try adding more keywords to the relevant rows.

### Memory files show empty
Check that `memory/` directory exists and files are readable. The app reads them at runtime, not build time.

### Build warnings about lockfiles
The warning about multiple `package-lock.json` files is harmless — it's a Next.js workspace detection quirk. Add to `next.config.ts` to silence:
```typescript
const nextConfig = {
  turbopack: { root: __dirname }
};
```
