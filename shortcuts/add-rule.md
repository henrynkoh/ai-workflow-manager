# /add-rule — Add a New Manual Rule

Use this shortcut to add a new rule to the appropriate manual.

---

## Template

```
/add-rule [manual name] [rule description]

Add the following rule to the [MANUAL] manual:

Rule: [RULE DESCRIPTION]

Format the rule following the existing manual conventions:
1. State the rule clearly (imperative: "Always...", "Never...", "Use...")
2. Provide a GOOD example (code block with comment "// Good")
3. Provide a BAD example (code block with comment "// Bad")
4. Explain the rationale in 1–2 sentences

Then update manuals/[filename].md with the new rule in the appropriate section.
Also update manuals/toc.md if new keywords should trigger this manual.

MODIFIED_FILES:
- manuals/[filename].md
- manuals/toc.md (if keywords updated)
```

---

## Available Manuals
- `backend` → backend_rules.md
- `frontend` → frontend_rules.md
- `security` → security_rules.md
- `database` → database_rules.md
- `general` → general_rules.md

## When to Use
- When you discover a recurring mistake that should become a rule
- When the team agrees on a new convention
- When a security issue reveals a missing guard

## Notes
- Rules should be specific and actionable, not vague
- Always include a concrete code example
- New rules take effect immediately for the next task
