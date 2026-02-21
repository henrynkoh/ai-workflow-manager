# Context Notes

Running log of decisions, discoveries, and important context for this project.

---

## [2026-02-21] Project initialized

- Scaffolded with `create-next-app@latest` (TypeScript, Tailwind, App Router)
- Dependencies: @anthropic-ai/sdk, gray-matter, react-markdown
- Folder structure created: manuals/, memory/, shortcuts/, quality-gates/, scripts/, components/

## Architecture Notes

### Context Injection Flow
1. User submits task + optional file paths
2. `contextInjector.ts` parses `manuals/toc.md` for keyword→file mappings
3. Keywords in task text + file extensions matched against TOC
4. Matched manuals (1–3 max) concatenated into system prompt prefix
5. Memory files appended after manuals
6. Quality gate checklist appended at end

### Memory File Strategy
- Files are small markdown documents (~1–3 KB each)
- Read on every request (fast enough for dev; add caching for prod)
- Write operations are atomic (write temp → rename)

### Shortcut System
- Shortcuts are markdown templates stored in `shortcuts/`
- UI prefills chat textarea with template when shortcut button clicked
- User can edit before submitting

---

_Add new notes below as the project evolves._
