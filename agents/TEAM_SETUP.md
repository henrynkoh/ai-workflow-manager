# Team of Agents — Setup Guide

## Architecture

```
User / Human Lead
       │
       ▼
  Orchestrator Agent          ← breaks down goals, assigns tasks
  (Claude Code / Cursor)
       │
  ┌────┼────────────┐
  ▼    ▼            ▼
Backend  Frontend   QA Agent
Agent    Agent      (reviews all)
```

---

## Step 1 — Deploy the Shared Server

Deploy ai-workflow-manager to Vercel so all agents share one URL:

```bash
cd /Users/henryoh/Documents/ai-workflow-manager
npx vercel --prod
```

Copy the URL — e.g. `https://ai-workflow-manager-abc.vercel.app`
Update BASE_URL in each agents/*.md file.

---

## Step 2 — Set Up Each Agent's CLAUDE.md

Each Claude Code / Cursor instance reads its own CLAUDE.md.
Copy the right agent file to each developer's / agent's working directory:

```bash
# For the backend developer's machine:
cp agents/backend-agent.md ~/projects/my-app/CLAUDE.md

# For the frontend developer's machine:
cp agents/frontend-agent.md ~/projects/my-app/CLAUDE.md

# For the QA reviewer's machine:
cp agents/qa-agent.md ~/projects/my-app/CLAUDE.md

# For the lead / coordinator:
cp agents/orchestrator.md ~/projects/my-app/CLAUDE.md
```

---

## Step 3 — Shared Memory Protocol

All agents READ and WRITE to the same memory endpoints.

**Read shared state (all agents do this before starting):**
```bash
curl https://your-url.vercel.app/api/memory
```

**Write your progress (all agents do this after finishing):**
```bash
curl -X POST https://your-url.vercel.app/api/memory \
  -H "Content-Type: application/json" \
  -d '{
    "file": "notes",
    "content": "[backend-agent] Completed: JWT login endpoint at /api/auth/login. Returns { token, user }."
  }'
```

---

## Step 4 — Task Flow (How Agents Coordinate)

```
1. Human gives goal to Orchestrator
   "Build a user authentication system"

2. Orchestrator breaks it down:
   → backend: "Create POST /api/auth/login with JWT"
   → database: "Create users table with Prisma migration"
   → frontend: "Create LoginForm component calling /api/auth/login"
   → qa: "Review auth implementation for security"

3. Backend + Database agents work in parallel
   → Both read /api/memory to avoid conflicts
   → Both write progress to /api/memory when done

4. Frontend agent starts AFTER backend confirms endpoint shape
   → Reads /api/memory to get API contract
   → Builds UI to match

5. QA agent reviews everything
   → Reads /api/memory for context
   → Posts APPROVED or NEEDS_CHANGES

6. Orchestrator summarizes to human
```

---

## Step 5 — What Each Agent Says to Start

### Orchestrator (human gives this goal):
```
I need to build: [high-level feature]

Read the shared memory first:
GET https://your-url.vercel.app/api/memory

Then break this into tasks for: backend, frontend, database, qa.
Write the task assignments to tasks/todo.md.
Wait for my approval before assigning anything.
```

### Backend Agent (orchestrator gives this task):
```
[Agent: backend]
Task: Build POST /api/auth/login endpoint with JWT

Context server: https://your-url.vercel.app
1. Fetch manuals: POST /api/context with this task
2. Read memory: GET /api/memory
3. Implement the endpoint
4. Write result to memory when done
5. Do NOT touch frontend files
```

### Frontend Agent (orchestrator gives this task):
```
[Agent: frontend]
Task: Build LoginForm component

Context server: https://your-url.vercel.app
1. Read memory to get backend API contract first
2. Fetch manuals: POST /api/context
3. Build the component
4. Do NOT touch API routes or database files
```

### QA Agent (orchestrator gives this task):
```
[Agent: qa]
Task: Review the authentication implementation

Context server: https://your-url.vercel.app
1. Read memory to understand what was built
2. Review all MODIFIED_FILES from backend + frontend agents
3. Run full quality gate checklist
4. Post verdict to memory
```

---

## Anti-Collision Rules

| Rule | Why |
|------|-----|
| Backend agent: only touches `app/api/`, `lib/`, `prisma/` | No UI conflicts |
| Frontend agent: only touches `components/`, `app/page.tsx`, `app/**/page.tsx` | No backend conflicts |
| QA agent: read-only, never edits files | Safe reviewer |
| All agents: always read /api/memory before starting | Know what's done |
| All agents: always write to /api/memory when done | Share progress |
| One task at a time per agent | No race conditions |

---

## Quick Reference

```bash
# Check what all agents have done
curl https://your-url.vercel.app/api/memory | jq '.data.notes'

# See which manuals would be injected for a task
curl -X POST https://your-url.vercel.app/api/context \
  -H "Content-Type: application/json" \
  -d '{"task": "add login endpoint", "filePaths": []}'

# Send a task as a specific agent
curl -X POST https://your-url.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"task": "...", "agent_id": "backend", "filePaths": ["app/api/auth/route.ts"]}'
```
