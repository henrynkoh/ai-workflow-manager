# Full-Stack Web/App Development Skill Reference

> Complete execution guide for any web or app development request.
> Covers: planning → scaffolding → backend → frontend → deployment → marketing.

---

## TABLE OF CONTENTS

1. [8-Step Workflow (Always Follow)](#1-8-step-workflow)
2. [Project Scaffolding](#2-project-scaffolding)
3. [Folder Structure Conventions](#3-folder-structure-conventions)
4. [TypeScript Patterns](#4-typescript-patterns)
5. [Next.js App Router Patterns](#5-nextjs-app-router-patterns)
6. [API Route Patterns](#6-api-route-patterns)
7. [Component Architecture](#7-component-architecture)
8. [Tailwind CSS & Styling](#8-tailwind-css--styling)
9. [State Management & Hooks](#9-state-management--hooks)
10. [File-Based Storage Pattern](#10-file-based-storage-pattern)
11. [Claude / AI API Integration](#11-claude--ai-api-integration)
12. [Environment & Config](#12-environment--config)
13. [Error Handling Rules](#13-error-handling-rules)
14. [Security Rules](#14-security-rules)
15. [Database Patterns (Prisma)](#15-database-patterns-prisma)
16. [Git & GitHub Workflow](#16-git--github-workflow)
17. [GitHub Pages Setup](#17-github-pages-setup)
18. [HTML Landing Page Template](#18-html-landing-page-template)
19. [Testing Approach](#19-testing-approach)
20. [Performance Checklist](#20-performance-checklist)
21. [Deployment (Vercel)](#21-deployment-vercel)
22. [Marketing Content Templates](#22-marketing-content-templates)
23. [Common Bugs & Fixes](#23-common-bugs--fixes)
24. [Quick Reference Commands](#24-quick-reference-commands)

---

## 1. 8-Step Workflow

**Always follow this order for every task:**

```
Step 1 → Think through the problem, read existing code, write plan to tasks/todo.md
Step 2 → Create a checklist of todo items in tasks/todo.md
Step 3 → Check in for plan verification before starting
Step 4 → Work on todo items, marking complete as you go
Step 5 → Give high-level explanation of changes at each step
Step 6 → Keep tasks simple — avoid massive/complex changes
Step 7 → Add review section to tasks/todo.md with summary
Step 8 → Commit and push to GitHub
```

### tasks/todo.md Template

```markdown
# [Project Name] — Task Checklist

## Plan Summary
[2–3 sentences describing what you're building and why]

## Todo Items
- [ ] Item 1
- [ ] Item 2
- [ ] Item 3

## Review
_Will be filled in after completion._
```

---

## 2. Project Scaffolding

### Next.js 14 (App Router, TypeScript, Tailwind)

```bash
# Scaffold
npx create-next-app@latest my-app \
  --typescript --tailwind --app --no-src-dir --no-eslint --yes

cd my-app

# Core deps
npm install @anthropic-ai/sdk gray-matter react-markdown

# UI deps
npm install @tailwindcss/typography

# DB deps (if needed)
npm install prisma @prisma/client
npx prisma init

# Auth deps (if needed)
npm install next-auth bcryptjs
npm install -D @types/bcryptjs

# Validation
npm install zod

# Date handling
npm install date-fns
```

### Create Directory Structure

```bash
mkdir -p app/api/{chat,memory,manuals,context}
mkdir -p app/{manuals,memory,dashboard}
mkdir -p components lib/{db,auth,utils}
mkdir -p manuals memory shortcuts quality-gates scripts tasks docs marketing
```

---

## 3. Folder Structure Conventions

```
my-app/
├── app/
│   ├── layout.tsx              # Root layout (Server Component)
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles
│   ├── [feature]/
│   │   └── page.tsx            # Feature page
│   └── api/
│       └── [resource]/
│           └── route.ts        # API endpoint
├── components/
│   ├── TopNav.tsx              # 'use client' nav
│   ├── [Feature]Card.tsx       # Feature components
│   └── ui/                    # Shared UI primitives
├── lib/
│   ├── db.ts                   # Database client
│   ├── auth.ts                 # Auth utilities
│   ├── utils.ts                # Shared helpers
│   └── [domain].ts             # Domain-specific logic
├── prisma/
│   └── schema.prisma           # DB schema
├── public/                     # Static assets
├── tasks/
│   └── todo.md                 # Task checklist
├── docs/
│   ├── MANUAL.md
│   ├── TUTORIAL.md
│   └── QUICKSTART.md
├── marketing/
│   ├── facebook.md
│   ├── instagram.md
│   └── ...
├── .env.local                  # Secrets (gitignored)
└── skill.md                    # This file
```

---

## 4. TypeScript Patterns

### Interface-First Design

```typescript
// Always define interfaces before components/functions
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

// API response wrapper — use this everywhere
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// Page/component props
interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
}
```

### Naming Conventions

```typescript
// Variables & functions: camelCase
const isLoading = true;
async function fetchUserById(id: string): Promise<User> { ... }

// Types, interfaces, classes, components: PascalCase
interface UserProfile { ... }
type ButtonVariant = 'primary' | 'secondary';
function UserCard({ user }: { user: User }) { ... }

// Constants: SCREAMING_SNAKE_CASE
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Files: kebab-case for utils, PascalCase for components
// lib/context-injector.ts  → utilities
// components/UserCard.tsx  → React components
```

### No-`any` Rule

```typescript
// ❌ Never
function process(data: any) { ... }

// ✅ Always type properly
function process(data: UserPayload): ProcessedUser { ... }

// If truly unknown, use unknown + type guard
function handle(value: unknown) {
  if (typeof value === 'string') { ... }
}
```

---

## 5. Next.js App Router Patterns

### Server vs Client Components

```typescript
// Server Component (default) — no 'use client'
// ✅ Use for: data fetching, layouts, pages that don't need interactivity
export default async function UserPage({ params }: PageProps) {
  const user = await getUser(params.id);  // Direct async/await
  return <UserCard user={user} />;
}

// Client Component — add 'use client' at top
// ✅ Use for: useState, useEffect, event handlers, browser APIs
'use client';
export function UserCard({ user }: { user: User }) {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(true)}>{user.name}</button>;
}
```

### Layout Pattern

```typescript
// app/layout.tsx — Server Component, exports metadata
import type { Metadata } from 'next';
import { ClientNav } from '@/components/ClientNav'; // separate client component for nav

export const metadata: Metadata = {
  title: 'App Name',
  description: 'Description',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientNav />           {/* Client component for interactive nav */}
        <main>{children}</main>
      </body>
    </html>
  );
}
```

### Key Rule: Event Handlers in Layout

```typescript
// ❌ WRONG — layout.tsx is Server Component, can't have event handlers
export default function Layout({ children }) {
  return (
    <nav>
      <a onMouseEnter={() => ...}>Link</a>  {/* ERROR */}
    </nav>
  );
}

// ✅ CORRECT — extract to separate 'use client' component
// components/Nav.tsx
'use client';
export function Nav() {
  return <nav><a onMouseEnter={() => ...}>Link</a></nav>;
}

// app/layout.tsx
import { Nav } from '@/components/Nav';
export default function Layout({ children }) {
  return <html><body><Nav />{children}</body></html>;
}
```

### Route Files

```
app/api/users/route.ts          → /api/users (GET, POST)
app/api/users/[id]/route.ts     → /api/users/:id (GET, PUT, DELETE)
app/users/page.tsx              → /users
app/users/[id]/page.tsx         → /users/:id
app/users/loading.tsx           → Loading UI for /users
app/users/error.tsx             → Error UI for /users
```

---

## 6. API Route Patterns

### Standard Route Template

```typescript
// app/api/[resource]/route.ts
import { NextRequest } from 'next/server';

// Always return { data, error } shape
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') ?? '1');

    const items = await getItems({ page });
    return Response.json({ data: items, error: null });
  } catch (err) {
    console.error('[GET /api/resource]', err);
    return Response.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || typeof body.name !== 'string') {
      return Response.json(
        { data: null, error: 'name is required' },
        { status: 400 }
      );
    }

    const result = await createItem(body);
    return Response.json({ data: result, error: null }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/resource]', err);
    return Response.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Dynamic Route

```typescript
// app/api/users/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserById(params.id);
    if (!user) {
      return Response.json({ data: null, error: 'User not found' }, { status: 404 });
    }
    return Response.json({ data: user, error: null });
  } catch (err) {
    console.error('[GET /api/users/:id]', err);
    return Response.json({ data: null, error: 'Internal server error' }, { status: 500 });
  }
}
```

### HTTP Status Code Rules

```
200 OK           → Successful GET, PUT, PATCH
201 Created      → Successful POST (new resource created)
204 No Content   → Successful DELETE
400 Bad Request  → Invalid input, missing required fields
401 Unauthorized → Not authenticated
403 Forbidden    → Authenticated but not authorized
404 Not Found    → Resource doesn't exist
409 Conflict     → Duplicate resource (e.g. email already exists)
422 Unprocessable → Validation failed
500 Server Error → Unexpected server failure
```

---

## 7. Component Architecture

### Component Template

```typescript
'use client';

import { useState } from 'react';

// 1. Define props interface
interface CardProps {
  title: string;
  description?: string;
  onAction: (id: string) => void;
  variant?: 'default' | 'highlighted';
}

// 2. Component function with typed props
export function Card({ title, description, onAction, variant = 'default' }: CardProps) {
  // 3. State declarations
  const [isExpanded, setIsExpanded] = useState(false);

  // 4. Derived values
  const isHighlighted = variant === 'highlighted';

  // 5. Event handlers
  function handleClick() {
    setIsExpanded(prev => !prev);
    onAction(title);
  }

  // 6. Loading/error states (if async)
  // ...

  // 7. Render
  return (
    <div
      className={`rounded-xl p-4 transition-all ${isHighlighted ? 'border-purple-500' : 'border-gray-200'}`}
      onClick={handleClick}
    >
      <h3 className="font-semibold">{title}</h3>
      {isExpanded && description && (
        <p className="text-sm text-gray-500 mt-2">{description}</p>
      )}
    </div>
  );
}
```

### Data-Fetching Component Pattern

```typescript
'use client';

import { useState, useEffect } from 'react';

interface Item { id: string; name: string; }

export function ItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/items');
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        setItems(json.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Always handle all 3 states
  if (loading) return <LoadingSkeleton />;
  if (error)   return <ErrorMessage message={error} />;
  if (items.length === 0) return <EmptyState />;

  return (
    <ul>
      {items.map(item => <li key={item.id}>{item.name}</li>)}
    </ul>
  );
}
```

### Size Rule

```
Component > 150 lines → split into smaller components
Repeated logic (3+x) → extract to custom hook or utility
Shared UI primitive  → put in components/ui/
```

---

## 8. Tailwind CSS & Styling

### Modern Dark UI System (Copy-Paste)

```css
/* globals.css */
:root {
  --bg-base:    #0a0e1a;
  --bg-panel:   rgba(15,20,40,0.85);
  --bg-card:    rgba(20,27,55,0.7);
  --border:     rgba(99,120,255,0.12);
  --text:       #f0f4ff;
  --text-muted: #94a3c4;
  --purple:     #8b5cf6;
  --pink:       #ec4899;
  --blue:       #3b82f6;
  --cyan:       #06b6d4;
  --green:      #10b981;
  --orange:     #f97316;
  --yellow:     #f59e0b;
  --grad-main:  linear-gradient(135deg, #8b5cf6, #ec4899);
  --grad-blue:  linear-gradient(135deg, #3b82f6, #06b6d4);
  --grad-green: linear-gradient(135deg, #10b981, #34d399);
}

body {
  background: var(--bg-base);
  color: var(--text);
}

/* Animated background glows */
body::before {
  content: '';
  position: fixed; inset: 0;
  background:
    radial-gradient(ellipse 80% 50% at 20% -10%, rgba(139,92,246,0.12) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 80% 110%, rgba(59,130,246,0.10) 0%, transparent 60%);
  pointer-events: none; z-index: 0;
}

/* Custom scrollbar */
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 10px; }
```

### Glassmorphism Panel

```tsx
<div style={{
  background: 'rgba(15,20,40,0.8)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(99,120,255,0.12)',
  borderRadius: '16px',
}}>
```

### Gradient Button

```tsx
<button style={{
  background: 'linear-gradient(135deg,#8b5cf6,#ec4899)',
  color: '#fff',
  boxShadow: '0 4px 20px rgba(139,92,246,0.4)',
  borderRadius: '12px',
  padding: '10px 20px',
  fontWeight: '600',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s',
}}>
  Click Me
</button>
```

### Gradient Text

```tsx
<span style={{
  background: 'linear-gradient(135deg,#c4b5fd,#f9a8d4)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}}>
  Gradient Title
</span>
```

### Useful Animations (globals.css)

```css
@keyframes fadeInUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
@keyframes float      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
@keyframes pulse-dot  { 0%,100%{opacity:1} 50%{opacity:0.4} }
@keyframes bounce-dot { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
@keyframes shimmer    { 0%{background-position:-200% center} 100%{background-position:200% center} }

.animate-in { animation: fadeInUp 0.35s ease both; }
.float      { animation: float 3s ease-in-out infinite; }
```

### Color-Coding System (by category)

```
Backend  → purple  #8b5cf6 / rgba(139,92,246,0.x)
Frontend → blue    #3b82f6 / rgba(59,130,246,0.x)
Security → red     #ef4444 / rgba(239,68,68,0.x)
Database → green   #10b981 / rgba(16,185,129,0.x)
General  → yellow  #f59e0b / rgba(245,158,11,0.x)
Success  → emerald #34d399
Error    → red     #f87171
Warning  → orange  #fb923c
```

---

## 9. State Management & Hooks

### Custom Hook Template

```typescript
// lib/hooks/useItems.ts
import { useState, useEffect, useCallback } from 'react';

interface Item { id: string; name: string; }

export function useItems() {
  const [items, setItems]   = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch('/api/items');
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setItems(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function create(name: string) {
    const res  = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const json = await res.json();
    if (json.error) throw new Error(json.error);
    setItems(prev => [...prev, json.data]);
    return json.data;
  }

  async function remove(id: string) {
    await fetch(`/api/items/${id}`, { method: 'DELETE' });
    setItems(prev => prev.filter(i => i.id !== id));
  }

  return { items, loading, error, refresh: load, create, remove };
}
```

### useState Patterns

```typescript
// Object state
const [form, setForm] = useState({ name: '', email: '', role: 'user' });
function updateField(field: string, value: string) {
  setForm(prev => ({ ...prev, [field]: value }));
}

// Array state
const [tags, setTags] = useState<string[]>([]);
const addTag    = (tag: string) => setTags(prev => [...prev, tag]);
const removeTag = (tag: string) => setTags(prev => prev.filter(t => t !== tag));

// Toggle
const [isOpen, setIsOpen] = useState(false);
const toggle = () => setIsOpen(prev => !prev);
```

---

## 10. File-Based Storage Pattern

```typescript
// lib/fileStorage.ts
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

export async function readFile(filename: string): Promise<string> {
  try {
    return await fs.readFile(path.join(DATA_DIR, filename), 'utf-8');
  } catch {
    return '';
  }
}

export async function writeFile(filename: string, content: string): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(path.join(DATA_DIR, filename), content, 'utf-8');
}

export async function appendToFile(filename: string, content: string): Promise<void> {
  const existing = await readFile(filename);
  await writeFile(filename, existing + '\n\n' + content);
}

export async function listFiles(dir: string): Promise<string[]> {
  try {
    const files = await fs.readdir(path.join(DATA_DIR, dir));
    return files.filter(f => f.endsWith('.md') || f.endsWith('.json'));
  } catch {
    return [];
  }
}
```

---

## 11. Claude / AI API Integration

### Client Wrapper

```typescript
// lib/claudeClient.ts
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const QUALITY_GATE = `
---
SELF-CHECK (mandatory before responding):
- [ ] Followed all project rules?
- [ ] Error handling added?
- [ ] No security vulnerabilities?
- [ ] Typed correctly (no any)?
- [ ] MODIFIED_FILES logged at end?
`;

export async function sendToClaude(
  systemPrompt: string,
  userMessage: string,
  model = 'claude-sonnet-4-6'
): Promise<string> {
  const message = await client.messages.create({
    model,
    max_tokens: 4096,
    system: systemPrompt + QUALITY_GATE,
    messages: [{ role: 'user', content: userMessage }],
  });

  const block = message.content.find(b => b.type === 'text');
  return block ? block.text : '';
}
```

### Context Injection Pattern

```typescript
// lib/contextInjector.ts
import fs from 'fs/promises';
import path from 'path';

interface ContextResult {
  contextPrefix: string;
  matchedManuals: string[];
}

export async function buildContextPrefix(
  task: string,
  filePaths: string[] = []
): Promise<ContextResult> {
  const toc = await fs.readFile(path.join(process.cwd(), 'manuals/toc.md'), 'utf-8');
  const entries = parseToc(toc);
  const taskLower = task.toLowerCase();
  const pathsLower = filePaths.map(p => p.toLowerCase());

  const scored = entries
    .map(e => ({ e, score: scoreEntry(e, taskLower, pathsLower) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const matchedManuals: string[] = [];
  const sections: string[] = [];

  for (const { e } of scored) {
    try {
      const content = await fs.readFile(path.join(process.cwd(), 'manuals', e.file), 'utf-8');
      sections.push(`## ${e.name}\n\n${content}`);
      matchedManuals.push(e.name);
    } catch { /* skip missing files */ }
  }

  return {
    contextPrefix: sections.length > 0
      ? `# Injected Manuals\n\n${sections.join('\n\n---\n\n')}`
      : '',
    matchedManuals,
  };
}
```

### API Chat Route (Full Pipeline)

```typescript
// app/api/chat/route.ts
import { NextRequest } from 'next/server';
import { buildContextPrefix } from '@/lib/contextInjector';
import { loadMemory, buildMemorySection } from '@/lib/memoryManager';
import { sendToClaude, buildSystemPrompt } from '@/lib/claudeClient';

export async function POST(request: NextRequest) {
  try {
    const { task, filePaths = [] } = await request.json();
    if (!task) return Response.json({ data: null, error: 'task required' }, { status: 400 });

    const [{ contextPrefix, matchedManuals }, memory] = await Promise.all([
      buildContextPrefix(task, filePaths),
      loadMemory(),
    ]);

    const systemPrompt = buildSystemPrompt(contextPrefix, buildMemorySection(memory));
    const response = await sendToClaude(systemPrompt, task);

    return Response.json({
      data: { response, matchedManuals, modifiedFiles: extractModifiedFiles(response) },
      error: null,
    });
  } catch (err) {
    console.error('[POST /api/chat]', err);
    return Response.json({ data: null, error: 'Chat failed' }, { status: 500 });
  }
}

function extractModifiedFiles(text: string): string[] {
  const match = text.match(/MODIFIED_FILES:\n([\s\S]*?)(?:\n\n|$)/);
  if (!match) return [];
  return match[1].split('\n').map(l => l.replace(/^-\s*/, '').trim()).filter(Boolean);
}
```

---

## 12. Environment & Config

### .env.local Template

```bash
# AI
ANTHROPIC_API_KEY=sk-ant-...

# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/mydb"

# Auth
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="My App"
```

### next.config.ts

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
  // Silence workspace root warning
  turbopack: { root: __dirname },
};

export default nextConfig;
```

### tsconfig.json Key Settings

```json
{
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./*"] }
  }
}
```

---

## 13. Error Handling Rules

```typescript
// ✅ Always wrap async functions
async function getUser(id: string): Promise<User | null> {
  try {
    return await db.user.findUnique({ where: { id } });
  } catch (err) {
    console.error('[getUser]', err);
    return null;
  }
}

// ✅ API routes: never leak internal errors
catch (err) {
  console.error('[POST /api/resource]', err);  // Log full error server-side
  return Response.json(
    { data: null, error: 'Internal server error' },  // Generic message to client
    { status: 500 }
  );
}

// ✅ Client-side: always set error state
catch (err) {
  setError(err instanceof Error ? err.message : 'Something went wrong');
}

// ✅ Error message from API response
const json = await res.json();
if (json.error) throw new Error(json.error);
if (!res.ok)    throw new Error(`Request failed: ${res.status}`);
```

---

## 14. Security Rules

### Input Validation with Zod

```typescript
import { z } from 'zod';

const CreateUserSchema = z.object({
  name:     z.string().min(1).max(100),
  email:    z.string().email(),
  password: z.string().min(8).max(100),
  role:     z.enum(['admin', 'user']).default('user'),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = CreateUserSchema.safeParse(body);

  if (!result.success) {
    return Response.json(
      { data: null, error: result.error.issues[0].message },
      { status: 422 }
    );
  }

  // result.data is now fully typed and validated
  const { name, email, password, role } = result.data;
  ...
}
```

### Password Hashing

```typescript
import bcrypt from 'bcryptjs';

// Hash before storing
const hash = await bcrypt.hash(password, 12);  // Min 12 rounds

// Verify on login
const isValid = await bcrypt.compare(inputPassword, storedHash);
```

### JWT

```typescript
import jwt from 'jsonwebtoken';

// Sign
const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET!,
  { expiresIn: '1h' }
);

// Verify — always in try/catch
try {
  const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  return payload;
} catch {
  throw new Error('Invalid or expired token');
}
```

### Never Do

```typescript
// ❌ SQL injection
db.query(`SELECT * FROM users WHERE id = ${userId}`);

// ✅ Parameterized
db.query('SELECT * FROM users WHERE id = $1', [userId]);

// ❌ Trust client ID
const userId = request.body.userId;

// ✅ Derive from token
const { userId } = verifyToken(request.headers.get('authorization'));

// ❌ Expose secrets in client code
const key = 'sk-ant-...';  // Committed to repo

// ✅ Environment variable
const key = process.env.ANTHROPIC_API_KEY;
```

---

## 15. Database Patterns (Prisma)

### Schema Conventions

```prisma
model User {
  id        String    @id @default(cuid())   // Always cuid or uuid
  email     String    @unique
  name      String?
  role      Role      @default(USER)
  posts     Post[]
  createdAt DateTime  @default(now())         // Always timestamps
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?                         // Soft delete

  @@index([email])                            // Index FK and filter columns
}

enum Role { USER ADMIN }
```

### Query Patterns

```typescript
// ✅ Paginated list — always paginate
const users = await prisma.user.findMany({
  where: { deletedAt: null },
  select: { id: true, name: true, email: true },  // Never SELECT *
  orderBy: { createdAt: 'desc' },
  take: 20,
  skip: (page - 1) * 20,
});

// ✅ Atomic multi-step operation
await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ data: { email } });
  await tx.profile.create({ data: { userId: user.id } });
  return user;
});

// ✅ Upsert
await prisma.user.upsert({
  where:  { email },
  update: { name },
  create: { email, name },
});
```

---

## 16. Git & GitHub Workflow

### Commit Convention

```bash
# Format: type(scope): description
git commit -m "feat(auth): add JWT login endpoint"
git commit -m "fix(ui): resolve hydration error in Nav"
git commit -m "refactor(db): extract query helpers to lib/db"
git commit -m "docs: add API reference to README"
git commit -m "chore: upgrade Next.js to 16"

# Types: feat fix refactor docs test chore perf style ci
```

### Full Commit + Push Flow

```bash
# Check what's changed
git status
git diff

# Stage specific files (never git add -A blindly)
git add app/ components/ lib/

# Commit with heredoc for multi-line
git commit -m "$(cat <<'EOF'
feat: add user authentication system

Implements JWT login/register with bcrypt password hashing.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"

# Push
git push origin main
```

### New Repo Setup

```bash
# 1. Initialize
git init
git add .
git commit -m "feat: initial project setup"

# 2. Create repo on GitHub (via CLI)
gh repo create my-app --public --source=. --push

# 3. Or manually add remote
git remote add origin https://github.com/username/repo.git
git branch -M main
git push -u origin main
```

---

## 17. GitHub Pages Setup

### Enable GitHub Pages from /docs

1. Create `docs/index.html` (single-file landing page)
2. Commit and push
3. Go to **GitHub repo → Settings → Pages**
4. Source: **Deploy from branch** · Branch: `main` · Folder: `/docs`
5. Save → live at `https://username.github.io/repo-name/`

### Single-File HTML Landing Page Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>App Name — Tagline</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
  <style>
    /* CSS variables → layout → sidebar → sections → components → animations */
    :root { --bg: #0d1117; --accent: #7c3aed; ... }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background: var(--bg); color: #e6edf3; display: flex; }

    /* Fixed sidebar */
    #sidebar { width: 260px; position: fixed; height: 100vh; overflow-y: auto; ... }
    #main    { margin-left: 260px; flex: 1; }

    /* Scrollspy: .active class on nav links */
    nav a.active { color: var(--accent); border-left: 2px solid var(--accent); }
  </style>
</head>
<body>
  <aside id="sidebar">
    <nav id="nav">
      <a href="#hero">🏠 Home</a>
      <a href="#features">✨ Features</a>
      <!-- ... -->
    </nav>
  </aside>

  <main id="main">
    <section id="hero">...</section>
    <section id="features">...</section>
    <!-- ... -->
  </main>

  <!-- Floating GitHub button -->
  <a id="gh-float" href="https://github.com/..." target="_blank" style="position:fixed;bottom:28px;right:28px;">
    ⭐ GitHub
  </a>

  <script>
    // Scrollspy
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
          document.querySelector(`nav a[href="#${e.target.id}"]`)?.classList.add('active');
        }
      });
    }, { threshold: 0.3, rootMargin: '-10% 0px -60% 0px' });

    document.querySelectorAll('section[id]').forEach(s => observer.observe(s));

    // Fade-in on scroll
    const fadeObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach(el => fadeObs.observe(el));
  </script>
</body>
</html>
```

---

## 18. HTML Landing Page Template

### Key Sections to Include

```
1. Hero          → gradient title, tagline, CTA buttons, tech badges
2. Problem       → before/after comparison (❌ vs ✅)
3. Features      → icon cards, 3–4 column grid
4. How it Works  → numbered steps or flow diagram
5. Code Demo     → syntax-highlighted code window with copy button
6. API Reference → table with method, endpoint, description
7. Quick Start   → numbered steps + terminal code block
8. CTA           → big centered call to action
```

### Reusable CSS Components

```css
/* Code window */
.code-window { background:#0d1117; border:1px solid #30363d; border-radius:12px; overflow:hidden; }
.code-header { background:#161b22; padding:10px 16px; display:flex; align-items:center; justify-content:space-between; }
.code-dot    { width:10px;height:10px;border-radius:50%; }
.code-body   { padding:20px;font-family:'JetBrains Mono',monospace;font-size:13px;line-height:1.7; }

/* Method badges */
.method.get  { background:rgba(63,185,80,0.15);  color:#3fb950; }
.method.post { background:rgba(88,166,255,0.15); color:#58a6ff; }

/* Gradient card */
.card { background:#161b22; border:1px solid #30363d; border-radius:16px; padding:28px; transition:all 0.25s; }
.card:hover { transform:translateY(-4px); box-shadow:0 12px 40px rgba(0,0,0,0.4); }
```

---

## 19. Testing Approach

```typescript
// Verify TypeScript compiles
npx tsc --noEmit

// Run dev and check for runtime errors
npm run dev

// Build for production (catches more issues)
npm run build

// Test API endpoint manually
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"task":"Add user login","filePaths":["app/api/auth.ts"]}'

// Test CLI tool
node scripts/inject-context.js "Add user login" src/api/auth.ts
```

---

## 20. Performance Checklist

```
✅ Paginate all list queries (take: 20, skip: page * 20)
✅ Use Server Components for data fetching (avoid useEffect fetches)
✅ Lazy load heavy components: dynamic(() => import('./Heavy'))
✅ Use next/image for all images
✅ Use next/font for custom fonts
✅ Avoid SELECT * — always specify columns
✅ Add database indexes on queried columns
✅ Cache frequently read, rarely changed data
✅ Use Promise.all for parallel async operations
✅ Memoize expensive computations with useMemo
```

---

## 21. Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod

# Set environment variable
vercel env add ANTHROPIC_API_KEY production

# View logs
vercel logs my-app.vercel.app
```

### vercel.json (if needed)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NODE_ENV": "production"
  }
}
```

---

## 22. Marketing Content Templates

### README.md Structure

```markdown
# 🤖 App Name
> One-line value proposition

![badge](shield) ![badge](shield)

## What Is This?
[2 paragraphs: problem + solution]

## Features
- ✅ Feature 1
- ✅ Feature 2

## Quick Start
\`\`\`bash
git clone ... && npm install && npm run dev
\`\`\`

## Project Structure
\`\`\`
[folder tree]
\`\`\`

## API Reference
| Method | Endpoint | Description |

## Tech Stack
| Package | Purpose |

## License
MIT © [Author]
```

### Platform-Specific Copy

| Platform | Format | Length | Hashtags |
|----------|--------|--------|----------|
| Facebook | 3 ad variants (awareness/consideration/conversion) | 150–300 words | Target by job title |
| Instagram | Caption + carousel + Reel script + Story | 50–150 words | 15–20 tags |
| Threads | 10-tweet thread + single post | 280 chars/post | Minimal |
| Blog (EN) | Full article with h2/h3 structure | 600–1200 words | SEO tags |
| 네이버 블로그 | Korean full article with tables | 800–1500 words | Korean tags |
| 티스토리 | Korean tech article | 800–1500 words | Korean tech tags |
| WordPress | Long-form article | 1000–2000 words | Categories |
| Newsletter | Subject + body with sections | 400–800 words | CTA at end |
| Email (5x) | Cold / community / follow-up / re-engage / welcome | 200–400 words | Personal |

---

## 23. Common Bugs & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `Event handlers cannot be passed to Client Component props` | Event handler in Server Component | Extract to `'use client'` component |
| `useEffect` infinite loop | Missing dependency array | Add `[]` or correct deps |
| Hydration mismatch | Server/client render differs | Move dynamic content to `useEffect` |
| `ANTHROPIC_API_KEY not set` | Missing env file | Create `.env.local` with key |
| `Cannot find module '@/...'` | Path alias not configured | Check `tsconfig.json` paths |
| `prisma not initialized` | Missing `npx prisma generate` | Run `npx prisma generate` |
| Build: "Multiple lockfiles" warning | Root package-lock.json exists | Add `turbopack: { root: __dirname }` to next.config.ts |
| CORS error in API | Missing CORS headers | Add `Access-Control-Allow-Origin` header |
| `params.id` is undefined | Wrong route file name | Check `[id]` bracket naming in folder |
| React hydration error | `localStorage` accessed at render | Wrap in `useEffect` |

---

## 24. Quick Reference Commands

```bash
# Development
npm run dev              # Start dev server (localhost:3000)
npm run build            # Production build
npm run start            # Start production server
npx tsc --noEmit         # TypeScript check only

# Database (Prisma)
npx prisma init          # Initialize Prisma
npx prisma generate      # Generate client after schema change
npx prisma migrate dev   # Create + apply migration
npx prisma studio        # Open Prisma GUI
npx prisma db seed       # Run seed script

# Git
git status               # Check changes
git add [files]          # Stage specific files
git commit -m "..."      # Commit
git push origin main     # Push to GitHub
gh repo create           # Create GitHub repo (needs gh CLI)

# Vercel
vercel                   # Deploy to preview
vercel --prod            # Deploy to production
vercel env add KEY prod  # Set env variable

# Packages
npm install [pkg]             # Install dependency
npm install -D [pkg]          # Install dev dependency
npm uninstall [pkg]           # Remove package
npm outdated                  # Check for updates
npx npm-check-updates -u      # Update all deps

# Debugging
npm run build 2>&1 | head -50          # See build errors
node scripts/[script].js               # Run standalone script
curl -X POST localhost:3000/api/[route] -H "Content-Type: application/json" -d '{}'
```

---

## Execution Checklist for Any Request

When given a web/app development request, execute in this order:

```
□ 1. Read existing code if project exists
□ 2. Write tasks/todo.md with plan + checklist
□ 3. Scaffold project (create-next-app + install deps)
□ 4. Create folder structure
□ 5. Write environment config (.env.local)
□ 6. Implement lib/ modules (DB, auth, utils)
□ 7. Build API routes (with { data, error } shape + error handling)
□ 8. Build components (typed props, loading/error states)
□ 9. Build pages (layout → index → feature pages)
□ 10. Run npx tsc --noEmit (fix any TS errors)
□ 11. Run npm run build (fix any build errors)
□ 12. Git commit + push
□ 13. Create docs/ (README, MANUAL, TUTORIAL, QUICKSTART)
□ 14. Create marketing/ content (all platforms)
□ 15. Create docs/index.html landing page
□ 16. Enable GitHub Pages
□ 17. Update tasks/todo.md with review section
```
