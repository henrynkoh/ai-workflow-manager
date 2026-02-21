# START HERE

## 3 steps to run the agent team

---

### STEP 1 — Open Claude Code or Cursor in your project folder

```bash
cd /your/project
claude   # or open Cursor
```

---

### STEP 2 — Copy and paste this prompt

```
You are running a team of 4 agents. Read AGENTS.md first, then build what I ask.

My request: ___________________________________

Rules:
- Plan first, code second
- One agent at a time
- Mark each task done before moving on
- Commit when complete
```

Fill in the blank. That's it.

---

### STEP 3 — Watch it run

The AI will automatically:

```
1. 🗂  Plan    → writes the task list
2. ⚙️  Build   → backend first
3. 🎨  Design  → frontend second
4. ✅  Review  → checks everything
5. 📦  Commit  → pushes to GitHub
```

---

## REAL EXAMPLES — Just copy and fill in

### "I want a new feature"
```
You are running a team of 4 agents. Read AGENTS.md first, then build what I ask.

My request: Add a contact form that sends email notifications

Rules:
- Plan first, code second
- One agent at a time
- Mark each task done before moving on
- Commit when complete
```

### "I want to fix a bug"
```
You are running a team of 4 agents. Read AGENTS.md first, then build what I ask.

My request: Fix the login button — it doesn't work on mobile

Rules:
- Plan first, code second
- One agent at a time
- Mark each task done before moving on
- Commit when complete
```

### "I want a whole new app"
```
You are running a team of 4 agents. Read AGENTS.md first, then build what I ask.

My request: Build a todo app with user accounts, task categories, and due dates

Rules:
- Plan first, code second
- One agent at a time
- Mark each task done before moving on
- Commit when complete
```

---

## THAT'S ALL YOU NEED TO KNOW

- **One prompt** → agents do the rest
- **AGENTS.md** → tells agents their roles
- **tasks/todo.md** → tracks progress automatically
- **GitHub** → auto-committed when done
