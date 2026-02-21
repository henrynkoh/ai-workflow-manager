# Frontend Rules Manual

## React Component Rules

### Rules
1. All components must be typed with TypeScript — no `any` types.
2. Use functional components with hooks only — no class components.
3. Extract reusable logic into custom hooks (`use*.ts`).
4. Keep components small: under 150 lines. Split if larger.
5. Never mutate state directly — always use the setter.
6. Loading and error states must always be handled in UI.

### Component Structure
```tsx
// Good: typed props, loading + error states handled
interface UserCardProps {
  userId: string;
  onSelect: (id: string) => void;
}

export function UserCard({ userId, onSelect }: UserCardProps) {
  const { data, isLoading, error } = useUser(userId);

  if (isLoading) return <div className="animate-pulse h-20 bg-gray-100 rounded" />;
  if (error) return <div className="text-red-500">Failed to load user.</div>;

  return (
    <button onClick={() => onSelect(userId)} className="p-4 border rounded hover:bg-gray-50">
      {data.name}
    </button>
  );
}
```

```tsx
// Bad: untyped, no error/loading handling, mutates state
export function UserCard({ userId, onSelect }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch(`/api/user/${userId}`).then(r => r.json()).then(d => user.name = d.name);
  }, []);
  return <div onClick={() => onSelect(userId)}>{user?.name}</div>;
}
```

## Tailwind CSS Rules
- Use utility classes exclusively — no inline styles unless dynamic.
- Group related classes: layout → spacing → colors → typography → interactions.
- Use `cn()` helper (clsx + tailwind-merge) for conditional class merging.

## Next.js App Router
- Use `'use client'` only when you need browser APIs or React hooks.
- Prefer Server Components for data fetching.
- Use `loading.tsx` and `error.tsx` files for route-level states.

## Hooks Rules
- Never call hooks inside conditions or loops.
- Custom hooks must start with `use`.
- Avoid large `useEffect` chains — split into focused hooks.

## MODIFIED_FILES Log
At the end of every response involving frontend changes, list:
```
MODIFIED_FILES:
- components/ComponentName.tsx
- app/page.tsx
```
