# WordPress Blog Post — AI Workflow Manager

**Title:** How I Fixed My AI Coding Assistant's Consistency Problem (Open Source Tool)

**Category:** Developer Tools, AI, Open Source
**Tags:** AI tools, Next.js, Claude, open source, developer productivity, TypeScript

---

Every developer using AI coding assistants hits the same wall eventually.

You spend twenty minutes explaining your project's conventions. The AI gets it. It writes clean, consistent code that follows your security rules, your naming standards, your error handling patterns. You're thrilled.

Then you close the browser.

Next session? It's like the conversation never happened.

This is the context window problem, and it's not a bug — it's how these systems work. The AI isn't remembering your rules; it's working from what's in the current conversation. End the conversation, lose the rules.

I got tired of this cycle and built something to fix it.

---

## Introducing AI Workflow Manager

[GitHub Repository](https://github.com/henrynkoh/ai-workflow-manager)

AI Workflow Manager is a Next.js 14 web application that wraps Claude with four external systems designed to enforce consistency across every single session, indefinitely.

The core philosophy: **don't rely on the AI to remember — store everything outside the AI and inject it automatically.**

---

## The Four Systems

### 1. The Manuals System

I created five rule files as plain markdown:

- **backend_rules.md** — API structure, error handling, HTTP status codes
- **frontend_rules.md** — React patterns, TypeScript requirements, Tailwind conventions
- **security_rules.md** — JWT implementation, password hashing, injection prevention
- **database_rules.md** — Query patterns, pagination, Prisma conventions
- **general_rules.md** — Naming, git commits, code style

The clever part is the `toc.md` file that maps each manual to trigger keywords:

```
| Backend Rules  | backend_rules.md  | api, route, server, endpoint, handler |
| Security Rules | security_rules.md | auth, jwt, password, sql, injection   |
```

When you type a task, the system scans for matching keywords and automatically prepends the relevant manuals to Claude's system prompt. Type "Add user registration endpoint" and both Backend Rules and Security Rules are injected — without you doing anything.

### 2. The Memory System

Three markdown files that Claude reads on every single request:

**project-plan.md** contains your project overview, tech stack choices, and major architectural decisions. Claude always knows what you're building.

**context-notes.md** is a running log. Every session, you (or Claude) add notes about what was discovered, what decisions were made, what gotchas were found. This becomes institutional knowledge that accumulates over time.

**task-checklist.md** tracks work status: completed, in-progress, and backlog items. Click `/continue` and Claude reads the checklist, finds the next incomplete item, and continues.

All three files are editable directly in the browser — either inline in the sidebar panel or full-screen at `/memory`.

### 3. Quality Gates

This is my favorite system. I append this to every Claude system prompt:

```
SELF-CHECK (mandatory before responding):
- [ ] Did I follow the matched manual rules?
- [ ] Error handling added to every async operation?
- [ ] No any types used without justification?
- [ ] Security best practices followed?
- [ ] All inputs validated?
- [ ] Loading/error states handled?
- [ ] MODIFIED_FILES logged?
```

Claude must check all seven criteria before finalizing its response. If it detects a failure, it fixes the issue first. Every response ends with `QUALITY_GATE_RESULTS:` showing PASS/FAIL for each item.

This effectively turns the AI into a self-reviewing engineer rather than just a code generator.

### 4. Shortcuts

Four pre-built workflow templates accessible from the left sidebar:

- **`/continue`** — Loads memory and resumes the next task
- **`/plan`** — Generates a structured implementation plan before any code is written
- **`/review`** — Performs a thorough post-task review against all matched manual rules
- **`/add-rule`** — Adds a new rule to the appropriate manual permanently

The `/plan` shortcut in particular has changed how I work. Getting a structured plan (files to modify, implementation steps, edge cases) before writing a single line of code prevents so much wasted effort.

---

## The Dashboard

The main page has a three-column layout:

**Left sidebar:** Shortcut buttons + memory panel (tabbed: Plan, Notes, Tasks — each editable inline)

**Center:** Chat interface with task input and optional file paths field. After each response, you can see which manuals were injected (shown as green badges) and which files were modified.

**Right sidebar:** Manuals browser showing all five manuals. After a request, matched manuals are highlighted in green. Click any manual to read its full content.

There are also dedicated pages:
- `/manuals` — full manual browser with sidebar navigation
- `/memory` — full-screen memory file editor

---

## Running It Locally

```bash
git clone https://github.com/henrynkoh/ai-workflow-manager.git
cd ai-workflow-manager
npm install
echo "ANTHROPIC_API_KEY=your-key" > .env.local
npm run dev
```

Open `http://localhost:3000`. Done.

You'll need an Anthropic API key from [console.anthropic.com](https://console.anthropic.com).

---

## The CLI Tool

For developers who prefer the terminal or want to integrate context injection into other workflows:

```bash
node scripts/inject-context.js "Add Prisma migration" prisma/schema.prisma
# ════════════════════════════════════════════════
# MATCHED MANUALS: Database Rules, General Rules
# ════════════════════════════════════════════════
# [full manual content printed to stdout]
```

This works without the web server — pure Node.js.

---

## Adding Your Own Rules

The system is designed to be extended:

1. Create `manuals/your_rules.md` with your team's specific conventions
2. Add a row to `manuals/toc.md` with trigger keywords
3. The new manual is live on the next request — no restart needed

Or use the `/add-rule` shortcut from the UI to have Claude write and insert the rule for you.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 14 (App Router) | Full-stack framework |
| TypeScript | Type safety throughout |
| Tailwind CSS | Utility-first styling |
| @anthropic-ai/sdk | Claude API integration |
| gray-matter | Markdown frontmatter parsing |
| react-markdown | Render manual content in UI |
| @tailwindcss/typography | Prose typography styles |

The stack is intentionally minimal. No database, no Redis, no vector search — just markdown files and a REST API. This makes it easy to deploy, fork, and modify.

---

## Why Open Source?

I wanted this to be a starting point, not a finished product. The most valuable part of this system is probably the manuals you'll write for your own project — your team's specific rules, your security requirements, your architectural decisions. Those aren't something I can ship for you.

What I can ship is the infrastructure: the context injection engine, the memory system, the quality gate, and the shortcut framework. You bring the rules.

---

## Get Started

⭐ **GitHub:** [https://github.com/henrynkoh/ai-workflow-manager](https://github.com/henrynkoh/ai-workflow-manager)

Issues, PRs, and feedback welcome. If you add an interesting custom manual, I'd love to see it.

---

*Filed under: Developer Tools, AI, Open Source, Next.js, Productivity*
