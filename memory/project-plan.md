# Project Plan

## Project Name
AI Workflow Manager

## Goal
Build a Next.js 14 application that implements the "4-system AI taming" framework:
1. **Manuals** — context-injected rules auto-selected by task keywords
2. **Memory** — persistent markdown files tracking plan, notes, and checklist
3. **Quality Gates** — post-task reviewer prompts enforcing standards
4. **Shortcuts** — `/continue`, `/plan`, `/review`, `/add-rule` command templates

## Tech Stack
- Next.js 14 (App Router, TypeScript, Tailwind CSS)
- @anthropic-ai/sdk (Claude API)
- gray-matter (markdown frontmatter parsing)
- react-markdown (markdown rendering)
- fs/promises (memory file I/O)

## Current Status
[ ] Project setup
[ ] Markdown content created
[ ] Lib layer implemented
[ ] API routes built
[ ] UI components built
[ ] E2E verified

## Key Decisions
- Memory files are plain markdown stored on disk (simple, no DB needed)
- Context injection uses keyword matching against TOC — no embeddings needed for MVP
- Quality gate is appended to every system prompt (mandatory self-check)

## Next Steps
1. Complete UI components
2. Wire up API routes
3. Test with real Claude API key
4. Document in README
