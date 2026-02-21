# 🤖 AI Workflow Manager

> Turn your LLM from a forgetful junior dev into a reliable AI teammate — using external structure instead of hoping the model behaves.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)
![Claude](https://img.shields.io/badge/Claude-Sonnet_4.6-orange?logo=anthropic)
![License](https://img.shields.io/badge/license-MIT-green)

---

## What Is This?

AI Workflow Manager implements the **"4-System AI Taming" framework** — a battle-tested method for getting consistent, high-quality output from AI coding assistants by providing external structure:

| System | What It Does |
|--------|-------------|
| 📚 **Manuals** | Rule files auto-injected into every prompt based on task keywords |
| 🧠 **Memory** | Persistent markdown files Claude reads on every session |
| ✅ **Quality Gates** | Mandatory self-check appended to every Claude response |
| ⚡ **Shortcuts** | `/continue`, `/plan`, `/review`, `/add-rule` command templates |

---

## Screenshots

```
┌─────────────────────────────────────────────────────────────────┐
│  Shortcuts    │         Chat Interface          │   Manuals     │
│  ─────────    │  ─────────────────────────────  │  ──────────   │
│  /continue    │  🤖 AI Workflow Manager         │  ✓ Backend    │
│  /plan        │                                 │  ✓ Security   │
│  /review      │  Task: Add user login endpoint  │  □ Frontend   │
│  /add-rule    │  Files: src/api/auth.ts         │  □ Database   │
│               │  ───────────────────────────    │  □ General    │
│  ─────────    │  [Send]                         │               │
│  Memory       │                                 │               │
│  Plan │ Notes │                                 │               │
│  Tasks        │                                 │               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Features

- **Auto Context Injection** — type a task like `"Add user login endpoint"` and `backend_rules.md` + `security_rules.md` are automatically prepended to the Claude prompt
- **Persistent Memory** — project plan, context notes, and task checklist survive across sessions
- **Quality Gate** — Claude self-checks every response against 7 quality criteria before replying
- **Shortcut Bar** — one-click templates for common workflows (`/continue`, `/plan`, `/review`, `/add-rule`)
- **Manual Browser** — view all 5 rule manuals; matched ones are highlighted green
- **Memory Editor** — edit memory files directly in the browser
- **Standalone CLI** — `node scripts/inject-context.js` works without the UI
- **Full TypeScript** — end-to-end type safety
- **5 Built-in Manuals** — Backend, Frontend, Security, Database, General rules

---

## Quick Start

### Prerequisites
- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/henrynkoh/ai-workflow-manager.git
cd ai-workflow-manager

# 2. Install dependencies
npm install

# 3. Set your API key
echo "ANTHROPIC_API_KEY=your_key_here" > .env.local

# 4. Start the dev server
npm run dev
```

Open **http://localhost:3000** and start building.

---

## Project Structure

```
ai-workflow-manager/
├── app/
│   ├── page.tsx                   # Dashboard (chat + memory + manuals)
│   ├── layout.tsx                 # Navigation shell
│   ├── manuals/page.tsx           # Full manuals browser
│   ├── memory/page.tsx            # Memory file editor
│   └── api/
│       ├── chat/route.ts          # POST: context + memory → Claude
│       ├── memory/route.ts        # GET/POST: read/write memory files
│       ├── manuals/route.ts       # GET: list + read manuals
│       └── context/route.ts       # POST: keyword → manual matching
├── lib/
│   ├── contextInjector.ts         # Rule engine: task keywords → manuals
│   ├── memoryManager.ts           # Load/save memory markdown files
│   └── claudeClient.ts            # Claude API wrapper + quality gate
├── manuals/
│   ├── toc.md                     # Keyword→file mapping table
│   ├── backend_rules.md
│   ├── frontend_rules.md
│   ├── security_rules.md
│   ├── database_rules.md
│   └── general_rules.md
├── memory/
│   ├── project-plan.md
│   ├── context-notes.md
│   └── task-checklist.md
├── shortcuts/
│   ├── continue.md
│   ├── plan.md
│   ├── review.md
│   └── add-rule.md
├── quality-gates/
│   └── reviewer-prompt.md
├── scripts/
│   └── inject-context.js          # Standalone CLI tool
└── components/
    ├── ChatInterface.tsx
    ├── MemoryPanel.tsx
    ├── ManualsBrowser.tsx
    └── ShortcutBar.tsx
```

---

## API Reference

### `POST /api/chat`
Full pipeline: build context → load memory → call Claude → return response.

**Request:**
```json
{
  "task": "Add user login endpoint",
  "filePaths": ["src/api/auth.ts"]
}
```

**Response:**
```json
{
  "data": {
    "response": "...",
    "matchedManuals": ["Backend Rules", "Security Rules"],
    "modifiedFiles": ["src/api/auth.ts"]
  },
  "error": null
}
```

### `POST /api/context`
Returns matched manuals without calling Claude.

### `GET /api/memory`
Returns all 3 memory files as JSON.

### `POST /api/memory`
Updates a memory file. Body: `{ "name": "plan|notes|checklist", "content": "..." }`

### `GET /api/manuals`
Returns all manuals with name, file, keywords, and content.

---

## CLI Usage

```bash
# Inject context for a task (no server needed)
node scripts/inject-context.js "Add user login endpoint" src/api/auth.ts

# Output:
# MATCHED MANUALS: Backend Rules, Security Rules
# ════════════════════════════════════════════════
# # Injected Manuals
# ...
```

---

## Adding Your Own Rules

1. Add a new `.md` file to `manuals/`
2. Add a row to `manuals/toc.md` with keywords
3. Or use the `/add-rule` shortcut in the UI

---

## Tech Stack

| Package | Purpose |
|---------|---------|
| Next.js 16 | Full-stack React framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| @anthropic-ai/sdk | Claude API client |
| gray-matter | Markdown frontmatter parsing |
| react-markdown | Markdown rendering in UI |
| @tailwindcss/typography | Prose styles for rendered markdown |

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit: `git commit -m "feat: add my feature"`
4. Push: `git push origin feat/my-feature`
5. Open a Pull Request

---

## License

MIT © [Henry Koh](https://github.com/henrynkoh)

---

## Acknowledgments

Inspired by the "4-System AI Taming" framework for building reliable AI-assisted development workflows.
