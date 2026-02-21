# Newsletter — AI Workflow Manager

**Subject Line Options:**
1. The one tool that makes AI coding assistants actually consistent
2. Why your AI keeps forgetting your rules (and the fix)
3. I open-sourced my AI workflow system — here's how it works
4. 4 systems that turn Claude into a reliable senior engineer

---

## Newsletter Issue

**Subject:** Why your AI coding assistant keeps making the same mistakes (and my open-source fix)

---

Hey [First Name],

Quick question: how many times have you told your AI assistant to "always add error handling"?

If your answer is "more than once," you've hit the context window problem — and you're not alone.

Here's what's actually happening: every time you start a new session with Claude, ChatGPT, or any other AI assistant, it has zero memory of your previous conversations. Your project conventions, your security requirements, your naming standards — gone. Day one. Every time.

The AI isn't being lazy. It's working exactly as designed. The problem is we keep trying to store project rules *inside* the AI's context — and that context disappears.

**The solution: store rules outside the AI and inject them automatically.**

---

### I Built a Tool for This

Over the past few weeks I've been building **AI Workflow Manager** — a Next.js application that implements what I call the "4-System AI Taming" framework.

Here's what each system does:

**📚 Manuals** — Five rule files (backend, frontend, security, database, general) that get automatically prepended to Claude's system prompt based on keyword detection. Type "Add user login endpoint" and the system detects `api`, `login`, `auth` → injects Backend Rules + Security Rules. Automatically. Every time.

**🧠 Memory** — Three persistent markdown files (project plan, context notes, task checklist) that Claude reads on every single request. Restart your browser, start a new session, doesn't matter — your full project context is always loaded.

**✅ Quality Gates** — A 7-point self-check (error handling, type safety, security, validation, etc.) that's mandatory at the end of every response. Claude checks its own work before replying. Failed check = fix first, then respond.

**⚡ Shortcuts** — Four pre-built workflows: `/continue` (resume with context), `/plan` (structured plan before coding), `/review` (code review against your rules), `/add-rule` (add new rules permanently).

---

### Real Example

Here's what happens when I type "Add user registration endpoint":

1. System detects: `api`, `user`, `registration`, `endpoint`
2. Injects: `backend_rules.md` + `security_rules.md`
3. Loads memory files (project plan + checklist)
4. Appends 7-point quality gate
5. Claude writes code that:
   - Returns `{ data, error }` response shape ✓
   - Hashes password with bcrypt ✓
   - Validates inputs with zod ✓
   - Wraps in try/catch ✓
   - Lists MODIFIED_FILES at the end ✓

Compare that to what you get without the system: inconsistent, often insecure, no error handling, no log of what changed.

---

### Try It

AI Workflow Manager is **free and open source** (MIT license).

**→ GitHub: https://github.com/henrynkoh/ai-workflow-manager**

Setup takes about 5 minutes:
```bash
git clone https://github.com/henrynkoh/ai-workflow-manager.git
cd ai-workflow-manager
npm install
echo "ANTHROPIC_API_KEY=your-key" > .env.local
npm run dev
```

You'll need a Claude API key from console.anthropic.com — the free tier works for testing.

---

### What I Learned Building This

The biggest insight: **the value isn't in the AI, it's in the structure you build around it.**

The 5 built-in manuals I ship are decent defaults. But the real power comes from writing your own — your team's specific API conventions, your security requirements for your particular use case, your database patterns. The system is the scaffold; you bring the rules.

The `/add-rule` shortcut makes this easy: describe the rule in plain English, Claude writes it in the correct format, and it's applied to every future request.

---

### One More Thing

The standalone CLI tool:
```bash
node scripts/inject-context.js "fix react button" src/components/Button.tsx
# MATCHED MANUALS: Frontend Rules
```

No UI needed. Useful for integrating into other tools or CI/CD pipelines.

---

If you give it a try, reply to this email and let me know what custom manuals you end up writing. That's the most interesting part to me — how different teams codify their specific standards.

Until next week,
Henry

---

*GitHub: https://github.com/henrynkoh/ai-workflow-manager*
*Unsubscribe | Manage Preferences*
