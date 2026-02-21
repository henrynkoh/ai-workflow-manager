# Email Templates — AI Workflow Manager

---

## Email 1: Cold Outreach to Developers

**Subject:** Quick question about your AI coding setup

**Body:**

Hi [Name],

I noticed you [work at / write about / tweet about] AI-assisted development and thought you might find this useful.

I just open-sourced a tool that solves a specific pain point I kept running into: AI coding assistants that forget your project's rules the moment you start a new session.

**AI Workflow Manager** implements a 4-system framework that keeps Claude consistent across every session:
- Auto-injects the right rule manuals per task (backend, security, frontend, etc.)
- Loads persistent project memory on every request
- Enforces a 7-point quality gate on every response
- Ships with `/continue`, `/plan`, `/review`, `/add-rule` shortcuts

It's built on Next.js 14 + TypeScript, runs locally, and is completely free.

GitHub: https://github.com/henrynkoh/ai-workflow-manager

Would be happy to hear your thoughts or what problems you're facing with AI consistency. Any feedback is welcome.

Best,
Henry Koh

---

## Email 2: Developer Community Announcement

**Subject:** [Open Source] AI Workflow Manager — 4 systems for consistent AI coding

**Body:**

Hi [Community/List Name],

I wanted to share an open-source project I've been working on that I think this community will find useful.

**AI Workflow Manager** (https://github.com/henrynkoh/ai-workflow-manager)

A Next.js 14 app that implements the "4-System AI Taming" framework for getting consistent, high-quality output from AI coding assistants (specifically Claude).

**The problem it solves:**
LLMs forget your project conventions at the end of every session. Security rules, naming conventions, error handling patterns — gone on day one of the next session.

**How it works:**

1. **Manuals** — 5 markdown rule files (backend, frontend, security, database, general) auto-injected into prompts via keyword matching. Type "Add user login endpoint" → backend_rules.md + security_rules.md auto-attached.

2. **Memory** — 3 persistent files (project plan, context notes, checklist) loaded on every request. `/continue` resumes from the last incomplete task.

3. **Quality Gates** — Mandatory 7-point self-check on every Claude response (error handling, type safety, security, etc.)

4. **Shortcuts** — `/continue`, `/plan`, `/review`, `/add-rule` one-click templates.

**Tech:** Next.js 14, TypeScript, Tailwind, @anthropic-ai/sdk
**License:** MIT
**Setup:** 5 minutes

```bash
git clone https://github.com/henrynkoh/ai-workflow-manager.git
npm install && npm run dev
```

Happy to answer questions or take suggestions for improvement.

Henry

---

## Email 3: Follow-Up / Nurture Email

**Subject:** How to add your own rules to AI Workflow Manager

**Body:**

Hi [Name],

Thanks for checking out AI Workflow Manager last week.

I wanted to share a quick tip that makes the tool much more powerful: **adding your own custom manuals**.

The 5 built-in manuals (backend, frontend, security, database, general) are useful defaults. But the real value comes from writing rules specific to your project:

**Example custom manuals you could add:**

*For a SaaS product:*
```markdown
# Billing Rules
- Always check subscription status before allowing premium actions
- Never expose price IDs to the frontend
- Log all billing events with user ID and timestamp
```

*For a team with specific patterns:*
```markdown
# API Versioning Rules
- Always prefix routes with /api/v1/
- Deprecate old versions with X-Deprecated header
- Never break backwards compatibility in minor versions
```

**How to add them:**

Option A — Use `/add-rule` in the UI:
```
/add-rule backend

Always check subscription status before allowing premium actions.
Good example: [code]
Bad example: [code]
```

Option B — Add directly:
1. Create `manuals/billing_rules.md`
2. Add to `manuals/toc.md`:
   ```
   | Billing Rules | billing_rules.md | billing, subscription, price, payment, stripe |
   ```

That's it. Live immediately.

The more specific your rules, the better Claude follows them. General rules like "write clean code" are less effective than specific rules like "every API response must include a requestId field."

Any questions? Just reply to this email.

Henry

GitHub: https://github.com/henrynkoh/ai-workflow-manager

---

## Email 4: Re-engagement Email

**Subject:** Still struggling with AI consistency? Here's what changed

**Body:**

Hi [Name],

A few weeks ago you downloaded / starred / checked out AI Workflow Manager.

I wanted to share a few updates and remind you it's still running strong:

**What's new:**
- `/manuals` page for full-screen manual browser
- `/memory` page with full-screen editor
- Improved keyword matching in contextInjector
- Better MODIFIED_FILES parsing in the UI

**Most popular use case from users:**
The `/plan` shortcut before any non-trivial task. Getting a structured plan (files → steps → edge cases) before writing code has been the biggest workflow improvement people report.

**Quick reminder — setup in 5 minutes:**
```bash
git clone https://github.com/henrynkoh/ai-workflow-manager.git
npm install
echo "ANTHROPIC_API_KEY=your-key" > .env.local
npm run dev
```

If you ran into any issues getting it set up, I'm happy to help. Just reply.

Henry

GitHub: https://github.com/henrynkoh/ai-workflow-manager

---

## Email 5: Newsletter Welcome Email

**Subject:** Welcome — here's how to get the most out of AI Workflow Manager

**Body:**

Hi [Name],

Thanks for subscribing!

You'll get updates on AI Workflow Manager and practical tips for AI-assisted development.

**To get started right now:**

1. **Clone and run** (5 min):
   ```bash
   git clone https://github.com/henrynkoh/ai-workflow-manager.git
   npm install
   echo "ANTHROPIC_API_KEY=your-key" > .env.local
   npm run dev
   ```

2. **First task to try:**
   Type `Add user login endpoint` in the chat → watch Backend Rules + Security Rules auto-inject in the right sidebar.

3. **Set up your memory** (2 min):
   Go to `/memory` → Edit **Project Plan** → describe what you're building.
   Now Claude always knows your project context.

4. **Use `/plan` before any non-trivial task** — it's the highest-leverage shortcut.

5. **Read the docs:**
   - [Quick Start Guide](docs/QUICKSTART.md)
   - [Full Manual](docs/MANUAL.md)
   - [Tutorial Walkthroughs](docs/TUTORIAL.md)

**Questions?** Reply to this email — I read every response.

Henry

GitHub: https://github.com/henrynkoh/ai-workflow-manager
