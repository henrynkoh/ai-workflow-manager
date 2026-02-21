# /continue — Resume Previous Task

Use this shortcut to resume work on the last task with full context loaded from memory.

---

## Template

```
/continue

Load my current project context:
- Project Plan: [loaded from memory/project-plan.md]
- Context Notes: [loaded from memory/context-notes.md]
- Task Checklist: [loaded from memory/task-checklist.md]

Based on the checklist, identify the next incomplete task and continue working on it.

Before starting:
1. Confirm which task you're resuming
2. State what was done previously (from context notes)
3. State what you plan to do next

Then proceed with the implementation.
```

---

## When to Use
- After a session break (Claude lost context)
- When switching between tasks
- When you want Claude to re-orient to the current state

## Notes
- Memory files are automatically loaded when this shortcut is used
- Claude will read the checklist and pick up the next unchecked item
