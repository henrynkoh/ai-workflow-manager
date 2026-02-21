# AI Workflow Manager — Implementation Checklist

## Plan Summary
Build a Next.js 14 (App Router, TypeScript, Tailwind) app implementing the "4-system AI taming" framework:
manuals (context injection), memory files, quality gates, and shortcut commands.

## Todo Items

- [x] Scaffold Next.js 14 project with TypeScript + Tailwind
- [x] Install @anthropic-ai/sdk, gray-matter, react-markdown
- [x] Write manuals/toc.md and all 5 manual files
- [x] Write memory/ starter templates
- [x] Write shortcuts/ templates
- [x] Write quality-gates/reviewer-prompt.md
- [x] Implement lib/contextInjector.ts
- [x] Implement lib/memoryManager.ts
- [x] Implement lib/claudeClient.ts
- [x] Create app/api/context/route.ts
- [x] Create app/api/memory/route.ts
- [x] Create app/api/manuals/route.ts
- [x] Create app/api/chat/route.ts
- [x] Build components/ChatInterface.tsx
- [x] Build components/ShortcutBar.tsx
- [x] Build components/MemoryPanel.tsx
- [x] Build components/ManualsBrowser.tsx
- [x] Update app/layout.tsx
- [x] Build app/page.tsx (dashboard)
- [x] Build app/manuals/page.tsx
- [x] Build app/memory/page.tsx
- [x] Create scripts/inject-context.js
- [x] Add .env.local template
- [x] Verify build passes (npm run build ✓)

## Review

### Summary of Changes
Full Next.js 14 (App Router, TypeScript, Tailwind) project implemented at `/Users/henryoh/Documents/ai-workflow-manager`.

**Lib layer:**
- `lib/contextInjector.ts` — parses `manuals/toc.md`, scores manuals by keyword match against task + file paths, returns top-3 manual contents as prompt prefix
- `lib/memoryManager.ts` — reads/writes `memory/*.md` files; exports `loadMemory`, `saveChecklist`, `appendToNotes`, `saveMemoryFile`, `buildMemorySection`
- `lib/claudeClient.ts` — wraps `@anthropic-ai/sdk`; appends mandatory quality gate self-check to every system prompt

**API routes (all return `{ data, error }` shape):**
- `POST /api/context` — keyword → manuals matching
- `GET/POST /api/memory` — load/save memory files
- `GET /api/manuals` — list + content of all manuals
- `POST /api/chat` — full pipeline (context → memory → Claude → response)

**UI components:**
- `ChatInterface.tsx` — task input, file paths, message history with injected manuals badges + MODIFIED_FILES log
- `ShortcutBar.tsx` — `/continue`, `/plan`, `/review`, `/add-rule` buttons that pre-fill chat
- `MemoryPanel.tsx` — tabbed view of 3 memory files with inline editing
- `ManualsBrowser.tsx` — lists all manuals, highlights matched ones, shows content on click

**Verified:**
- `npm run build` — clean build, no TypeScript errors, 10 routes generated
- `node scripts/inject-context.js "Add user login endpoint" src/api/auth.ts` → matches Backend Rules + Security Rules ✓
- `node scripts/inject-context.js "fix react button" src/components/Button.tsx` → matches Frontend Rules ✓
