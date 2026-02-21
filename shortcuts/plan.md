# /plan — Create Implementation Plan

Use this shortcut to get a structured implementation plan before writing code.

---

## Template

```
/plan [task description]

Before writing any code, create a detailed implementation plan for:
[TASK]

Include:
1. **Understanding** — What is the goal? What problem does this solve?
2. **Files affected** — Which files will be created or modified?
3. **Dependencies** — Any new packages or external services needed?
4. **Steps** — Numbered list of implementation steps (small, testable increments)
5. **Edge cases** — What could go wrong? How will errors be handled?
6. **Testing approach** — How will this be verified?

Output the plan BEFORE writing any code. Wait for approval.

After approval, follow the plan step by step, marking each step complete.
Update memory/task-checklist.md as steps are completed.
```

---

## When to Use
- Starting any non-trivial feature
- When the task touches multiple files
- When there are architectural decisions to make

## Notes
- Always plan before coding — prevents wasted effort
- Keep steps small and verifiable
- Update the checklist in memory as you go
