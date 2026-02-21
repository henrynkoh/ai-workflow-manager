# Agent Team — Reference

## CURSOR SETTINGS (set these once, never change)

```
Model:  claude-sonnet-4-6
Mode:   Agent
Apply:  Auto
```

---

## THE 4 AGENTS

| # | Agent | Does | Touches |
|---|-------|------|---------|
| 1 | 🗂 Planner | Reads codebase, writes task list | tasks/todo.md only |
| 2 | ⚙️ Backend | Builds API, database, server logic | app/api/**, lib/**, prisma/** |
| 3 | 🎨 Frontend | Builds UI, components, pages | components/**, app/page.tsx |
| 4 | ✅ Reviewer | Checks everything, commits to GitHub | Read-only + git |

---

## TWO VERSIONS — pick one per session

### VERSION A — With approval pause
Use for: new projects, big features, anything risky
- Agent 1 writes the plan, then **STOPS**
- You review the plan, type "continue" or "looks good"
- Agents 2, 3, 4 run after your approval

### VERSION B — Fully automatic
Use for: bug fixes, small features, routine tasks
- All 4 agents run **start to finish** without stopping
- Cursor Agent + Auto mode handles everything
- You come back to a finished, committed result

---

## HOW IT WORKS

```
You paste prompt → Agent 1 plans → Agent 2 builds backend
→ Agent 3 builds frontend → Agent 4 reviews + commits
```

---

## AGENT RULES (enforced automatically by the prompt)

### 🗂 Planner
- Reads existing files before writing anything
- Writes tasks/todo.md — never writes code
- Version A: stops after plan. Version B: continues immediately.

### ⚙️ Backend
- ONLY touches: app/api/**, lib/**, prisma/**, scripts/**
- NEVER touches: components/, page.tsx files
- Validates all input with Zod
- Every route returns `{ data, error }`
- Every route has try/catch

### 🎨 Frontend
- ONLY touches: components/**, app/page.tsx, app/globals.css
- NEVER touches: app/api/, lib/, prisma/
- Always adds loading state
- Always adds error state
- Always mobile responsive

### ✅ Reviewer
- Checks all modified files against quality checklist
- Fixes any issues found
- Marks all tasks complete in tasks/todo.md
- Runs git add -A → commit → push

---

## WHEN TO USE THE PROMPT

| You want to... | Use prompt? | Version |
|----------------|-------------|---------|
| Build a new feature | Yes | A |
| Fix a bug | Yes | B |
| Build a new app | Yes | A |
| Refactor code | Yes | A |
| Ask what a file does | No | — |
| Fix a typo | No | — |

**Rule: if you are changing code → use the prompt**

---

## FULL PROMPTS

See `START_HERE.md` for the complete copy-pastable prompts for both versions.
