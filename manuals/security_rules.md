# Security Rules Manual

## Authentication & Authorization

### Rules
1. Never store plaintext passwords — always hash with bcrypt (min 12 rounds) or argon2.
2. JWT tokens must be short-lived (≤1h access, ≤7d refresh). Store refresh tokens httpOnly cookies.
3. Always verify token on EVERY protected route — no shortcuts.
4. Implement proper RBAC — check permissions, not just authentication.
5. Never log sensitive fields: passwords, tokens, credit card numbers, SSNs.

### JWT Best Practices
```typescript
// Good: verify token, extract claims, check expiry
import jwt from 'jsonwebtoken';

function verifyToken(token: string): { userId: string; role: string } {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    return { userId: payload.sub!, role: payload.role };
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
}
```

```typescript
// Bad: no verification, trusts client input
function getUser(token: string) {
  const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  return payload; // never do this — unverified!
}
```

## SQL Injection Prevention
- ALWAYS use parameterized queries or ORM methods — never string interpolation.
```typescript
// Good
const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);

// Bad — NEVER DO THIS
const user = await db.query(`SELECT * FROM users WHERE id = ${userId}`);
```

## XSS Prevention
- Sanitize all user-generated content before rendering.
- Use React's JSX (which auto-escapes) — never use `dangerouslySetInnerHTML` with unescaped input.
- Set Content Security Policy headers.

## Input Validation
- Validate and sanitize all inputs at the API boundary.
- Use a schema validation library (zod, yup) for request body validation.
- Reject unexpected fields (allowlist approach).

## CSRF Protection
- Use SameSite=Strict cookies for session tokens.
- Include CSRF tokens for state-changing operations.

## Secrets Management
- Never hardcode secrets in code — use environment variables.
- Never commit `.env` files — add to `.gitignore`.
- Rotate secrets regularly; use secret managers in production.

## MODIFIED_FILES Log
At the end of every response involving security changes, list:
```
MODIFIED_FILES:
- lib/auth.ts
- middleware.ts
```
