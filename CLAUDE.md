# Unikove HRMS — Coding Standards

## Stack
Next.js 15 (App Router) · TypeScript · Tailwind CSS · Prisma 7 · Supabase (PostgreSQL) · NextAuth v5

---

## Color Tokens

Use design tokens, never raw Tailwind color names for brand colors.

| Purpose | Use | Never use |
|---|---|---|
| Primary CTA / brand | `bg-primary-600 hover:bg-primary-700` | `bg-indigo-600` |
| Primary text | `text-primary-600` | `text-indigo-600` |
| Primary border | `border-primary-600` | `border-indigo-600` |
| Focus ring | `focus:ring-primary-500` | `focus:ring-indigo-500` |
| AI accent | `bg-violet-*` / `text-violet-*` | — |
| Success | `bg-emerald-*` / `text-emerald-*` | — |
| Warning | `bg-amber-*` / `text-amber-*` | — |
| Error | `bg-rose-*` / `text-rose-*` | — |
| Info | `bg-sky-*` / `text-sky-*` | — |

`primary` and `indigo` map to the same hex value in Tailwind config, but only `primary` is the semantic token — always use `primary`.

---

## Component Architecture

### Server vs Client split

```
page.tsx           ← async server component, calls server actions directly
└── SomethingClient.tsx  ← "use client", receives data as props
```

- Server components: `async`, no `"use client"`, call server actions directly
- Client components: `"use client"` at top, receive all data as props from parent
- After any mutation: call `router.refresh()` to re-fetch server data

### File size

Keep every file under **300 lines**. If a component grows beyond that, extract sub-components into the same `_components/` folder.

---

## Server Actions

All actions live in `src/lib/actions/`.

### Auth guards

```ts
// Always first — auth errors propagate before any DB work
const user = await requireAuth();
// or
const user = await requireRole("HR_ADMIN", "MANAGER");
```

Never put `requireAuth()` inside a try/catch.

### Validation

```ts
const parsed = schema.safeParse(data);
if (!parsed.success) throw new Error("Invalid data");
```

Validate before the try/catch block — validation errors are application logic, not DB errors.

### Error handling

Wrap all database operations in try/catch using `toActionError` from `./utils`:

```ts
import { toActionError } from "./utils";

// Query
export async function getMyTasks() {
  const user = await requireAuth();
  try {
    return await db.task.findMany({ where: { orgId: user.orgId } });
  } catch (err) {
    throw toActionError(err);
  }
}

// Mutation
export async function createTask(data: z.infer<typeof taskSchema>) {
  const user = await requireAuth();                        // outside try
  const parsed = taskSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");   // outside try

  try {
    const task = await db.task.create({ data: { ...parsed.data, orgId: user.orgId } });
    revalidatePath("/tasks");
    return task;
  } catch (err) {
    throw toActionError(err);
  }
}
```

### Cross-org safety

Always scope queries to `orgId: user.orgId`. Never fetch data without an org boundary.

---

## Image Paths

Always use the full `/images/` prefix:

```tsx
<Image src="/images/user/user-01.png" ... />  // correct
<Image src="/user/user-01.png" ... />          // wrong
```

---

## Shared Utilities

Before adding a new pattern, check if it already exists:

| Need | Use |
|---|---|
| Toast notifications | `useToast()` from `@/hooks/use-toast` + `<Toast />` from `@/components/ui/toast` |
| Stat cards | `StatCard` component |
| Badges | `.badge`, `.badge-success`, `.badge-error`, etc. from globals.css |
| Cards | `.card`, `.card-p`, `.card-hover` utility classes |

---

## Prisma / Database

- Convert `Decimal` fields before passing to client components: `Number(row.salary)`
- DB client: `src/lib/db.ts` — import as `import { db } from "@/lib/db"`
- Schema: `prisma/schema.prisma`
- After schema changes: `npx prisma db push`

---

## TypeScript

- No `any` types — use proper types or `unknown` with narrowing
- No `as any` casts
- Augment session types in `src/types/next-auth.d.ts`

---

## What NOT to do

- Do not hardcode mock data in page or component files
- Do not skip `requireAuth()` in server actions
- Do not use `bg-indigo-*` — use `bg-primary-*`
- Do not add `console.log` — remove before committing
- Do not add comments explaining what the code does — only add comments for non-obvious WHY
- Do not create new files when an existing shared component covers the need
- Do not add error handling for scenarios that can't happen — only wrap actual DB/network calls

---

## Demo Credentials

```
URL:      http://localhost:3000
Email:    admin@unikove.com
Password: password123
Org:      Unikove Technologies (PRO_MAX plan)
```

## Dev Setup

```bash
npx prisma db push    # sync schema to Supabase
npx prisma db seed    # seed demo data
npm run dev           # start dev server
```
