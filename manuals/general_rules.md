# General Rules Manual

## Naming Conventions

### Rules
1. Variables and functions: `camelCase`.
2. Types, interfaces, classes, components: `PascalCase`.
3. Constants: `SCREAMING_SNAKE_CASE`.
4. Files: `kebab-case.ts` for utilities, `PascalCase.tsx` for components.
5. Boolean variables should read as questions: `isLoading`, `hasError`, `canEdit`.
6. Functions should be named with verb phrases: `getUser`, `createPost`, `validateEmail`.

### Examples
```typescript
// Good
const MAX_RETRIES = 3;
const isAuthenticated = true;

async function fetchUserById(userId: string): Promise<User> { ... }

interface UserProfile { ... }

// Bad
const retry_max = 3;
const auth = true;
async function user(id: string) { ... }
```

## Code Comments
- Add comments for WHY, not WHAT — the code shows what, comments explain intent.
- Document non-obvious business logic or workarounds.
- Mark technical debt with `// TODO:` or `// FIXME:` including author and date.
- Keep comments up to date — stale comments are worse than none.

```typescript
// Good: explains why
// Using 60s cache to avoid hammering the external API rate limit
const data = await cache.get(key, () => fetchFromApi(key), 60);

// Bad: restates the code
// Get data from cache
const data = await cache.get(key, ...);
```

## Git Commit Rules
- Use conventional commits format: `type(scope): message`.
  - Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`.
- Keep commits small and focused — one logical change per commit.
- Write commit messages in imperative mood: "Add login endpoint" not "Added login endpoint".
- Reference issue numbers: `fix(auth): resolve token expiry bug (#123)`.

### Examples
```
feat(users): add profile picture upload
fix(api): handle missing auth header gracefully
refactor(db): extract query helpers to lib/db.ts
docs(readme): update setup instructions
```

## Code Style
- Max line length: 100 characters.
- Use 2-space indentation (enforced by Prettier).
- No trailing whitespace.
- Files end with a newline.
- Prefer `const` over `let`; avoid `var`.
- Prefer early returns to reduce nesting.
- Destructure objects and arrays where it improves readability.

## DRY Principle
- Extract repeated logic (≥3 occurrences) into a shared function or hook.
- Don't over-abstract — wait until a pattern is clear before abstracting.
- Shared utilities go in `lib/` or `utils/`.

## MODIFIED_FILES Log
At the end of every response involving code changes, list:
```
MODIFIED_FILES:
- [list all changed files]
```
