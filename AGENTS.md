# Agent Team — Quick Start

## THE ONE PROMPT (copy this every time)

```
You are running a team of 4 agents. Read AGENTS.md first, then build what I ask.

My request: [DESCRIBE WHAT YOU WANT HERE]

Rules:
- Plan first, code second
- One agent at a time
- Mark each task done before moving on
- Commit when complete
```

---

## THE 4 AGENTS

| # | Agent | Does |
|---|-------|------|
| 1 | 🗂 Planner | Reads request → writes task list |
| 2 | ⚙️ Backend | Builds API, database, server logic |
| 3 | 🎨 Frontend | Builds UI, components, pages |
| 4 | ✅ Reviewer | Checks everything before done |

---

## HOW IT WORKS (3 steps)

```
Step 1 → You type what you want
Step 2 → Planner breaks it into tasks
Step 3 → Each agent does their part, one by one
```

That's it.

---

## AGENT RULES (Claude follows these automatically)

### 🗂 Planner
- First agent to run, always
- Writes all tasks to tasks/todo.md
- Does NOT write any code
- Stops and waits after plan is written

### ⚙️ Backend Agent
- Only touches: app/api/, lib/, prisma/
- Validates all input
- Handles all errors
- Never touches frontend files

### 🎨 Frontend Agent
- Only touches: components/, app/page.tsx
- Always adds loading + error states
- Matches what backend built
- Never touches API files

### ✅ Reviewer
- Last agent to run, always
- Checks: bugs, security, missing cases
- Posts verdict: APPROVED or NEEDS CHANGES

---

## EXAMPLE

**You type:**
```
You are running a team of 4 agents. Read AGENTS.md first, then build what I ask.

My request: Add a user login page with email and password

Rules:
- Plan first, code second
- One agent at a time
- Mark each task done before moving on
- Commit when complete
```

**What happens automatically:**
```
🗂 Planner    → writes tasks/todo.md with 6 tasks
⚙️ Backend    → builds POST /api/auth/login
🎨 Frontend   → builds LoginPage component
✅ Reviewer   → checks security, approves
             → git commit + push
```

---

## SHORTCUT PROMPTS

| What you want | What to type |
|--------------|--------------|
| Start fresh  | `/plan [your idea]` |
| Keep going   | `/continue` |
| Check work   | `/review` |
| Add a rule   | `/add-rule [rule]` |
