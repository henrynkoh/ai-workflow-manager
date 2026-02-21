# AI Workflow Manager — Step-by-Step Tutorial

This tutorial walks you through 5 real-world scenarios using the AI Workflow Manager.

---

## Prerequisites
- App running at `http://localhost:3000`
- `ANTHROPIC_API_KEY` set in `.env.local`

---

## Tutorial 1: Your First AI-Assisted Task

**Goal:** Ask Claude to create an API endpoint and see manuals auto-injected.

### Steps

**1. Open the dashboard**
Navigate to `http://localhost:3000`. You'll see three columns: shortcuts (left), chat (center), manuals (right).

**2. Type a task**
In the center chat box, type:
```
Add a GET /api/users endpoint that returns a paginated list of users
```

**3. Add a file path (optional)**
In the file paths field below, type:
```
app/api/users/route.ts
```

**4. Click Send**
Watch what happens in the right sidebar — **Backend Rules** and possibly **Database Rules** will turn green, showing they were injected into the prompt.

**5. Review the response**
The response will:
- Follow the `{ data, error }` response shape (from backend_rules.md)
- Include pagination (from database_rules.md)
- Include try/catch error handling
- End with `MODIFIED_FILES:` and `QUALITY_GATE_RESULTS:`

**What you learned:** The system matched keywords (`api`, `users`, `endpoint`, `paginated`) to manuals automatically — you didn't configure anything.

---

## Tutorial 2: Using the /plan Shortcut

**Goal:** Get a structured implementation plan before writing code.

### Steps

**1. Click `/plan` in the left sidebar**
The chat textarea is pre-filled with the plan template.

**2. Replace `[describe your task here]` with your actual task:**
```
/plan Build a user authentication system with email/password login and JWT tokens
```

**3. Add relevant file paths:**
```
app/api/auth/login/route.ts, app/api/auth/register/route.ts, lib/auth.ts
```

**4. Send**
Claude returns a structured plan with:
- Goal definition
- Files to create/modify
- Step-by-step implementation list
- Edge cases
- Testing approach

**5. Review and approve the plan**
Read through it. If something looks wrong, reply with corrections before any code is written.

**6. Send a follow-up:**
```
Looks good. Implement step 1 only.
```

**What you learned:** `/plan` creates a contract between you and Claude before any code is written — preventing wasted effort on the wrong implementation.

---

## Tutorial 3: Using Memory with /continue

**Goal:** Resume work after a break and have Claude pick up exactly where you left off.

### Steps

**1. First, update your task checklist**
Navigate to `/memory` (top nav). Click **Task Checklist**, then click **Edit**.

Add your current tasks:
```markdown
## In Progress
- [ ] Implement user registration endpoint
- [ ] Add email validation

## Completed
- [x] Project scaffolded
- [x] Database schema created
```

Click **Save changes**.

**2. Add a context note**
Switch to **Context Notes** tab, click **Edit**, and add:
```markdown
## [2026-02-21] Session notes

- Using Prisma with PostgreSQL
- JWT tokens: 1h access, 7d refresh
- Decided to use zod for validation
```

Save.

**3. Close the browser and reopen it**
Simulating a new session.

**4. Click `/continue` in the left sidebar**
The chat is pre-filled with the continue template.

**5. Send**
Claude reads your memory files and responds:
- "Resuming task: Implement user registration endpoint"
- States what was done previously (from notes)
- Proceeds with the next step

**What you learned:** Memory files give Claude persistent context that survives page refreshes, new sessions, and even reinstalls.

---

## Tutorial 4: The /review Quality Gate

**Goal:** Run a post-task review to catch issues Claude might have introduced.

### Steps

**1. Complete any implementation task first**
For example, send: `Create a password reset endpoint`

**2. After Claude responds, click `/review`**
The template is pre-filled.

**3. In the template, reference what was just built:**
```
/review

Review the password reset endpoint from the previous response.
Files: app/api/auth/reset/route.ts
```

**4. Send**
Claude reviews against all matched manuals and outputs:
```
REVIEW_RESULTS:
app/api/auth/reset/route.ts: Token not checked for expiry → Add expiry validation
app/api/auth/reset/route.ts: Missing rate limiting → Add rate limit middleware
OVERALL: NEEDS CHANGES
```

**5. Fix the issues**
Reply: `Fix the two issues found in the review`

**What you learned:** The review shortcut acts as a built-in code reviewer that knows your project's specific rules — not just generic best practices.

---

## Tutorial 5: Adding a Custom Rule with /add-rule

**Goal:** Add a project-specific rule that Claude will follow from now on.

**Scenario:** Your team has decided all API responses must include a `requestId` field for tracing.

### Steps

**1. Click `/add-rule` in the left sidebar**

**2. Fill in the template:**
```
/add-rule backend

Rule: Always include a `requestId` field in every API response for distributed tracing.

Good example:
return Response.json({
  data: result,
  error: null,
  requestId: crypto.randomUUID()
}, { status: 200 });

Bad example:
return Response.json({ data: result });

Rationale: requestId enables correlating logs across services and debugging production issues.
```

**3. Send**
Claude updates `manuals/backend_rules.md` with the new rule.

**4. Test the new rule**
Send a new backend task. Claude will now include `requestId` in every response example it generates.

**What you learned:** `/add-rule` lets you evolve your coding standards over time. The rule is written once and enforced automatically forever.

---

## Tutorial 6: CLI Context Injection

**Goal:** Use the standalone CLI tool to inject context without the UI.

### Steps

**1. Open your terminal in the project folder:**
```bash
cd /Users/henryoh/Documents/ai-workflow-manager
```

**2. Run the inject-context script:**
```bash
node scripts/inject-context.js "Add Prisma migration for users table" prisma/schema.prisma
```

**3. See the output:**
```
════════════════════════════════════════════════
MATCHED MANUALS: Database Rules, General Rules
════════════════════════════════════════════════

# Injected Manuals

## Database Rules
...full manual content...
```

**4. Pipe it into a file or another tool:**
```bash
node scripts/inject-context.js "Fix React form" src/components/Form.tsx > context.txt
```

**What you learned:** The context injection engine works independently of the web UI, making it useful for integrations, CI/CD pipelines, or other AI tools.

---

## Next Steps

- Read the full [Manual](./MANUAL.md) for detailed configuration options
- Check the [Quick Start Guide](./QUICKSTART.md) for a condensed setup reference
- Add your own manuals for project-specific rules
- Customize the quality gate criteria in `lib/claudeClient.ts`
