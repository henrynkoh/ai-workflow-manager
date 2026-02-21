# Blogger Post — AI Workflow Manager

**Title:** I Built a Tool That Makes AI Coding Assistants Actually Follow Your Rules

**Labels:** AI Tools, Developer Tools, Open Source, Next.js, Claude AI, Productivity

---

I've been using AI coding assistants for over a year, and the frustration is always the same: inconsistency.

You spend time telling your AI the rules. "Add error handling to every async function." "Follow our security guidelines." "Always log which files you modified." And for a few messages, it's great. Then — poof. New session. It's like talking to someone with short-term memory loss.

So I built **AI Workflow Manager** — a Next.js application that wraps Claude with four external systems that enforce consistency regardless of context window limits.

## The Core Insight

The problem isn't the AI. Claude, GPT-4, and others are genuinely capable. The problem is we keep trying to store project-specific rules *inside* the AI's context, which disappears the moment the session ends.

The solution: store everything *outside* the AI, and inject it automatically.

## The 4-System Framework

### System 1: Manuals
I created 5 rule files covering the most common code categories:
- **Backend Rules** — API design, error handling, status codes
- **Frontend Rules** — React, TypeScript, Tailwind conventions
- **Security Rules** — JWT, password hashing, SQL injection prevention
- **Database Rules** — Prisma, query patterns, migrations
- **General Rules** — naming, git commits, code style

The magic: a `toc.md` file maps each manual to trigger keywords. When you type "Add user login endpoint," the system detects `api`, `login`, `endpoint`, and `auth` — and automatically prepends Backend Rules + Security Rules to the Claude system prompt. You never have to think about which rules apply.

### System 2: Memory
Three markdown files that Claude reads on every single request:
- `project-plan.md` — what you're building and key decisions
- `context-notes.md` — a running log of discoveries and gotchas
- `task-checklist.md` — what's done, in progress, and next

Start a new session? Click `/continue` and Claude reads all three files, identifies the next uncompleted task, and picks up exactly where you left off.

### System 3: Quality Gates
I append a mandatory 7-point self-check to every system prompt:
1. Manual compliance — did Claude follow the matched rules?
2. Error handling — every async wrapped in try/catch?
3. Type safety — no untyped `any`?
4. Security — no injection risks?
5. Validation — inputs validated at boundaries?
6. Loading/error states — UI states handled?
7. MODIFIED_FILES logged — every changed file listed?

Claude must check all seven before finalizing its response. If a gate fails, it fixes the issue first.

### System 4: Shortcuts
Four pre-built prompt templates:
- `/continue` — resume with full memory loaded
- `/plan` — structured implementation plan before any code
- `/review` — post-task review against your rule manuals
- `/add-rule` — add new rules that stick forever

## Tech Stack

Built with:
- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** for the UI
- **@anthropic-ai/sdk** for the Claude API
- **gray-matter** for parsing markdown frontmatter
- **react-markdown** for rendering rule content in the browser

The architecture is deliberately simple: rule files are plain markdown on disk, memory files are plain markdown on disk, and the context injector is a keyword-matching function — no vector databases, no embeddings, no complex infra.

## The Dashboard

The main dashboard has three columns:
- **Left:** Shortcut buttons + memory panel (tabbed, editable inline)
- **Center:** Chat interface (shows injected manual badges and MODIFIED_FILES per response)
- **Right:** Manuals browser (matched ones highlighted green)

There's also a standalone CLI tool:
```bash
node scripts/inject-context.js "fix react button" src/components/Button.tsx
# MATCHED MANUALS: Frontend Rules
```

## Results

Since using this framework, my AI-assisted sessions are dramatically more consistent. The biggest wins:
- Security rules are never skipped — the system makes it impossible
- I no longer re-explain the same conventions in every session
- MODIFIED_FILES tracking means I always know what changed
- The /plan shortcut prevents wasted coding on misunderstood requirements

## Get It

AI Workflow Manager is **free and open source** under the MIT license.

🔗 **GitHub:** https://github.com/henrynkoh/ai-workflow-manager

Clone it, set your API key, run `npm run dev`, and you're up in 5 minutes.

If you try it, let me know what custom manuals you add. I'm especially curious what rules people are adding for their specific frameworks and team conventions.
