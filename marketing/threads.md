# Threads Posts — AI Workflow Manager

---

## Thread 1: The Core Problem (Viral Hook)

**Post 1:**
Your AI coding assistant has a dirty secret.

It doesn't actually remember your rules.

Every session is day one for it. 🧵

**Post 2:**
You've told Claude:
- "Always add error handling"
- "Follow our naming conventions"
- "Don't skip security checks"

Tomorrow? It'll write code without all three. Again.

**Post 3:**
The problem isn't the AI.

The problem is you're relying on the AI to remember external structure that should live outside the AI.

**Post 4:**
I built AI Workflow Manager to solve this.

4 systems that make your AI consistent whether it's session 1 or session 100:

**Post 5:**
System 1: Manuals 📚
Rule files that auto-inject into every prompt.

Type "Add user login endpoint" →
Backend Rules + Security Rules auto-attached.

No config needed. Keyword matching.

**Post 6:**
System 2: Memory 🧠
3 markdown files Claude reads on every request:
- Project Plan
- Context Notes
- Task Checklist

Your AI always knows what you're building and what's next.

**Post 7:**
System 3: Quality Gate ✅
7-point self-check appended to every response:
- Manual compliance
- Error handling
- Type safety
- Security
- Validation
- Loading/error states
- MODIFIED_FILES logged

Fails a check? Claude fixes it before responding.

**Post 8:**
System 4: Shortcuts ⚡
/continue → resume with full memory
/plan → structured plan before coding
/review → post-task review against your rules
/add-rule → evolve your standards over time

**Post 9:**
Tech: Next.js 14 + TypeScript + Tailwind + Claude API
Open source: github.com/henrynkoh/ai-workflow-manager

Running locally in 5 minutes.

**Post 10:**
If you're an AI-assisted developer, this is the missing layer between "AI that sometimes follows rules" and "AI that always does."

---

## Thread 2: Quick Demo Thread

**Post 1:**
Watch what happens when I type "Add user login endpoint" into AI Workflow Manager 👇

**Post 2:**
Step 1: I type the task.
Step 2: The system scans manuals/toc.md.
Step 3: Detects: api, login, endpoint, auth.
Step 4: Matches: Backend Rules + Security Rules.

All automatic.

**Post 3:**
Claude now sees:
[system prompt]
- Your role: senior engineer
- Backend Rules (full content)
- Security Rules (full content)
- Project Plan
- Context Notes
- Task Checklist
- 7-point quality gate

Before it writes a single line.

**Post 4:**
The response:
✓ { data, error } response shape (backend rule)
✓ bcrypt password hashing (security rule)
✓ JWT with 1h expiry (security rule)
✓ try/catch on every async operation
✓ MODIFIED_FILES logged
✓ QUALITY_GATE_RESULTS at the bottom

**Post 5:**
Free. Open source. MIT.
github.com/henrynkoh/ai-workflow-manager

---

## Single Post (Engagement)

You don't have a bad AI.
You have an AI without external structure.

Manuals. Memory. Quality gates. Shortcuts.

That's the 4-system framework I built into AI Workflow Manager.

Open source: github.com/henrynkoh/ai-workflow-manager

What rule do you wish your AI followed every time? 👇
