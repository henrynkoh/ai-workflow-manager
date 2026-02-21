# Quick Start Guide — AI Workflow Manager

Get up and running in under 5 minutes.

---

## Step 1 — Clone & Install

```bash
git clone https://github.com/henrynkoh/ai-workflow-manager.git
cd ai-workflow-manager
npm install
```

## Step 2 — Add Your API Key

```bash
echo "ANTHROPIC_API_KEY=sk-ant-your-key-here" > .env.local
```

Get your key at: **https://console.anthropic.com**

## Step 3 — Start the App

```bash
npm run dev
```

Open **http://localhost:3000**

---

## Your First 5 Actions

| # | Action | How |
|---|--------|-----|
| 1 | **Send a task** | Type in chat → Click Send (or ⌘+Enter) |
| 2 | **See auto-injected manuals** | Watch right sidebar turn green |
| 3 | **Use /continue** | Click button → Load memory context |
| 4 | **Edit memory** | Memory panel → hover → Edit |
| 5 | **Browse manuals** | Click any manual in right sidebar |

---

## Keyboard Shortcut

| Shortcut | Action |
|----------|--------|
| `⌘ + Enter` | Submit task |

---

## 4 Shortcut Commands

```
/continue   → Resume last task with full memory context
/plan       → Get implementation plan before coding
/review     → Review last response against manual rules
/add-rule   → Add a new rule to a manual
```

---

## 5 Built-in Manuals + Auto-Trigger Keywords

```
Backend Rules    → api, route, server, endpoint, middleware
Frontend Rules   → react, component, tsx, hook, ui, tailwind
Security Rules   → auth, jwt, password, sql, injection, token
Database Rules   → prisma, sql, query, migration, schema, db
General Rules    → naming, git, commit, style, refactor, lint
```

---

## CLI Tool (No UI Required)

```bash
node scripts/inject-context.js "your task" path/to/file.ts
```

---

## Pages

| URL | What's There |
|-----|-------------|
| `/` | Dashboard: chat + memory + manuals |
| `/manuals` | Full manual browser |
| `/memory` | Memory file editor |

---

## Folder Structure (Key Files)

```
manuals/          ← Edit rules here
memory/           ← Edit project context here
shortcuts/        ← Edit shortcut templates here
lib/              ← Core logic (contextInjector, memoryManager, claudeClient)
scripts/          ← CLI tools
```

---

## Common Issues

| Problem | Fix |
|---------|-----|
| Blank response | Check `ANTHROPIC_API_KEY` in `.env.local` |
| No manuals matched | Add keywords to `manuals/toc.md` |
| Memory not loading | Check `memory/` directory exists |
| Build error | Run `npm install` again |

---

## Add a Custom Manual in 2 Steps

**1.** Create `manuals/my_rules.md` with your rules

**2.** Add to `manuals/toc.md`:
```
| My Rules | my_rules.md | keyword1, keyword2, keyword3 |
```

Done — it's live on next request.

---

For the full manual: [MANUAL.md](./MANUAL.md)
For walkthroughs: [TUTORIAL.md](./TUTORIAL.md)
