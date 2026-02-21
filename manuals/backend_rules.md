# Backend Rules Manual

## API Route Design

### Rules
1. Every API route must return a consistent response shape: `{ data, error, status }`.
2. Always validate request body/query params before processing.
3. Use HTTP status codes correctly: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error.
4. Never expose internal error messages to clients — log them server-side, return generic messages.
5. API routes must be idempotent where possible (GET, PUT, DELETE).

### Next.js App Router API Routes
```typescript
// Good: consistent shape, proper status codes
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name) {
      return Response.json({ data: null, error: 'name is required' }, { status: 400 });
    }
    const result = await processData(body);
    return Response.json({ data: result, error: null }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/resource]', err);
    return Response.json({ data: null, error: 'Internal server error' }, { status: 500 });
  }
}
```

```typescript
// Bad: no validation, leaks error details
export async function POST(request: Request) {
  const body = await request.json();
  const result = await processData(body);
  return Response.json(result);
}
```

## Middleware & Auth
- Check auth tokens in middleware, not inside every route handler.
- Never trust client-provided user IDs — always derive from the session/token.

## Error Handling
- Wrap every async handler in try/catch.
- Log errors with context: `[METHOD /api/path]`.
- Return 500 only for truly unexpected errors; distinguish between 4xx (client fault) and 5xx (server fault).

## Rate Limiting
- Apply rate limiting to all public-facing endpoints.
- Use headers `X-RateLimit-Limit`, `X-RateLimit-Remaining`.

## MODIFIED_FILES Log
At the end of every response involving backend changes, list:
```
MODIFIED_FILES:
- app/api/[route]/route.ts
```
