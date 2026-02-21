# START HERE

## How to run the agent team in Cursor AI or Claude Code

---

## CURSOR SETTINGS (set these once)

```
Model:  claude-sonnet-4-6
Mode:   Agent
Apply:  Auto
```

---

## WHICH PROMPT TO USE?

| Situation | Use |
|-----------|-----|
| New project, big feature, anything risky | **VERSION A** — pauses after plan so you can check |
| Routine features, bug fixes, small tasks | **VERSION B** — runs fully automatic, no stops |
| You're watching the screen | Either |
| You're stepping away | **VERSION B** |

---

## VERSION A — WITH APPROVAL PAUSE (recommended for new/complex tasks)

```
You are an AI orchestrator running a team of 4 specialist agents.
Execute them in order. Do not skip any agent.

════════════════════════════════════════════════════════════
MY REQUEST:

[DESCRIBE WHAT YOU WANT TO BUILD OR FIX HERE]

════════════════════════════════════════════════════════════

AGENT TEAM — execute in this exact order:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AGENT 1 — 🗂 PLANNER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Role: Read the codebase. Write a task list. Do NOT write code yet.

Actions:
1. Read all relevant existing files first
2. Write tasks/todo.md with this format:
   ## Plan
   [2 sentences: what you are building and why]

   ## Tasks
   - [ ] Backend: [task]
   - [ ] Frontend: [task]
   - [ ] Other: [task]

   ## Review
   [leave blank — filled in by Reviewer]

3. Print the plan and STOP. Wait for confirmation before continuing.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AGENT 2 — ⚙️ BACKEND AGENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Role: Build all server-side code only.

Allowed files: app/api/**, lib/**, prisma/**, scripts/**
Forbidden files: components/**, app/page.tsx, app/**/page.tsx

Rules:
- Validate all inputs (use Zod)
- Wrap everything in try/catch
- Return { data, error } from every API route
- Never use `any` in TypeScript
- No hardcoded secrets — use process.env

When done, print:
BACKEND COMPLETE
MODIFIED_FILES:
- [list every file you created or changed]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AGENT 3 — 🎨 FRONTEND AGENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Role: Build all UI code only. Match what Backend Agent built.

Allowed files: components/**, app/page.tsx, app/**/page.tsx, app/globals.css
Forbidden files: app/api/**, lib/**, prisma/**

Rules:
- Add 'use client' only when using useState/useEffect/event handlers
- Always show a loading state while fetching
- Always show an error state if fetch fails
- Every button must have a disabled state while loading
- Mobile responsive — works on small screens
- Match existing color scheme and style

When done, print:
FRONTEND COMPLETE
MODIFIED_FILES:
- [list every file you created or changed]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AGENT 4 — ✅ REVIEWER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Role: Review all modified files. Fix issues found. Do not add new features.

Checklist — verify every item:
- [ ] No hardcoded secrets or API keys
- [ ] All inputs validated before use
- [ ] All API calls have error handling
- [ ] No TypeScript `any` types
- [ ] Loading and error states present in UI
- [ ] No console.log left in production code
- [ ] tasks/todo.md updated — all items marked complete
- [ ] Code does exactly what was requested, nothing more

Then fill in the Review section of tasks/todo.md:
## Review
- Changes made: [list]
- Issues fixed: [list or "none"]
- Verdict: APPROVED

Then run:
git add -A
git commit -m "feat: [one line summary of what was built]"
git push origin main

Print:
✅ ALL DONE — [one sentence summary of what was built]

════════════════════════════════════════════════════════════
GLOBAL RULES (all agents follow these):
- Simple changes only — touch as few files as possible
- Never delete files without asking
- Never install new packages without asking
- If something is unclear, ask before doing anything
════════════════════════════════════════════════════════════
```

---

## VERSION B — FULLY AUTOMATIC (recommended for routine tasks, bug fixes)

```
You are an AI orchestrator running a team of 4 specialist agents.
Execute ALL agents automatically from start to finish without stopping.

════════════════════════════════════════════════════════════
MY REQUEST:

[DESCRIBE WHAT YOU WANT TO BUILD OR FIX HERE]

════════════════════════════════════════════════════════════

AGENT TEAM — execute in this exact order, fully automatically:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AGENT 1 — 🗂 PLANNER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Role: Read the codebase. Write a task list. Do NOT write code.

Actions:
1. Read all relevant existing files first
2. Write tasks/todo.md:
   ## Plan
   [2 sentences: what you are building and why]

   ## Tasks
   - [ ] Backend: [task]
   - [ ] Frontend: [task]
   - [ ] Other: [task]

   ## Review
   [leave blank]

3. Immediately continue to Agent 2. Do NOT stop or ask anything.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AGENT 2 — ⚙️ BACKEND AGENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Role: Build all server-side code only.

Allowed files: app/api/**, lib/**, prisma/**, scripts/**
Forbidden files: components/**, app/page.tsx, app/**/page.tsx

Rules:
- Validate all inputs (use Zod)
- Wrap everything in try/catch
- Return { data, error } from every API route
- Never use `any` in TypeScript
- No hardcoded secrets — use process.env

When done, print:
BACKEND COMPLETE
MODIFIED_FILES:
- [list every file you created or changed]

Then immediately continue to Agent 3.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AGENT 3 — 🎨 FRONTEND AGENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Role: Build all UI code only. Match what Backend Agent built.

Allowed files: components/**, app/page.tsx, app/**/page.tsx, app/globals.css
Forbidden files: app/api/**, lib/**, prisma/**

Rules:
- Add 'use client' only when using useState/useEffect/event handlers
- Always show a loading state while fetching
- Always show an error state if fetch fails
- Every button must have a disabled state while loading
- Mobile responsive — works on small screens
- Match existing color scheme and style

When done, print:
FRONTEND COMPLETE
MODIFIED_FILES:
- [list every file you created or changed]

Then immediately continue to Agent 4.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AGENT 4 — ✅ REVIEWER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Role: Review all modified files. Fix any issues. Do not add features.

Checklist — verify every item:
- [ ] No hardcoded secrets or API keys
- [ ] All inputs validated before use
- [ ] All API calls have error handling
- [ ] No TypeScript `any` types
- [ ] Loading and error states present in UI
- [ ] No console.log left in production code
- [ ] tasks/todo.md — mark all items complete
- [ ] Code does exactly what was requested, nothing more

Fill in tasks/todo.md Review section:
## Review
- Changes made: [list]
- Issues fixed: [list or "none"]
- Verdict: APPROVED

Then run these commands automatically:
git add -A
git commit -m "feat: [one line summary]"
git push origin main

Print:
✅ ALL DONE — [one sentence summary]

════════════════════════════════════════════════════════════
GLOBAL RULES:
- Simple changes only — touch as few files as possible
- Never delete files without asking
- Never install new packages without asking
- Do NOT stop or ask questions at any point — execute fully
════════════════════════════════════════════════════════════
```

---

## EXAMPLE REQUESTS TO FILL IN

```
Build a contact form that saves submissions to a database
```
```
Add user login and logout with email and password
```
```
Fix the navbar — it breaks on mobile screens
```
```
Add a dark/light mode toggle to the top nav
```
```
Build a dashboard showing total users, revenue, and recent orders
```

---

## WHEN TO USE THIS PROMPT

> **If you are changing or building any code → use this prompt**
> **If you are just asking a question → type freely**

| Task type | Use prompt? |
|-----------|-------------|
| New feature | Yes — Version A or B |
| Bug fix | Yes — Version B |
| Refactor | Yes — Version A |
| New app from scratch | Yes — Version A |
| Asking what a file does | No — just ask |
| Fixing a typo | No — just ask |
