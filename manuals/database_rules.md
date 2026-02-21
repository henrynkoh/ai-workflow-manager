# Database Rules Manual

## Schema Design

### Rules
1. Every table must have a primary key (`id`) and timestamps (`createdAt`, `updatedAt`).
2. Use descriptive, snake_case column names in the database; camelCase in application code.
3. Add indexes on foreign keys and frequently queried columns.
4. Use soft deletes (`deletedAt`) for important records instead of hard deletes.
5. Never store computed values that can be derived — calculate at query time.

### Prisma Schema Example
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@index([email])
}

enum Role {
  USER
  ADMIN
}
```

## Query Rules

### Rules
1. Never SELECT * in production — explicitly list needed columns.
2. Always paginate list queries — never return unbounded result sets.
3. Use transactions for multi-step operations that must be atomic.
4. Avoid N+1 queries — use `include`/`join` or batch loading.

### Good vs Bad Queries
```typescript
// Good: paginated, specific fields, uses index
const users = await prisma.user.findMany({
  where: { role: 'USER', deletedAt: null },
  select: { id: true, name: true, email: true },
  orderBy: { createdAt: 'desc' },
  take: 20,
  skip: page * 20,
});

// Bad: unbounded, SELECT *
const users = await prisma.user.findMany();
```

## Migrations
- Always create a new migration file — never edit existing ones.
- Test migrations on a copy of production data before applying.
- Keep migrations idempotent where possible.
- Name migrations descriptively: `add_role_to_users`, `create_posts_table`.

## Connection Management
- Use a connection pool — never open a new connection per request.
- Set appropriate pool limits for your environment.
- Always close connections in finally blocks or use `using` pattern.

## Performance
- Use `EXPLAIN ANALYZE` to verify query plans on slow queries.
- Cache frequently read, rarely changed data (Redis or in-memory).
- Batch inserts/updates instead of looping individual writes.

## MODIFIED_FILES Log
At the end of every response involving database changes, list:
```
MODIFIED_FILES:
- prisma/schema.prisma
- prisma/migrations/[timestamp]_[name]/migration.sql
```
