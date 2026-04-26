# Contributing — quantsignal-web

## Architecture Rules (enforced, not optional)

### 1. No bare fetch() outside lib/api.ts
All API calls must go through `app/lib/api.ts`.
- ✅ `import { fetchSignal } from "../lib/api"`
- ❌ `fetch("https://quantsignal-api...")`

### 2. dashboard/page.tsx is a shell only
Only state wiring and component composition belong in `dashboard/page.tsx`.
- ✅ `<AssetList signals={signals} ... />`
- ❌ Writing JSX blocks or business logic inline in page.tsx

### 3. No hardcoded API URLs anywhere
Use `process.env.NEXT_PUBLIC_API_URL` — set it in your deployment dashboard.
- ✅ Env var set in Netlify/Vercel
- ❌ Hardcoding `railway.app` URLs in any component or hook

### 4. Dashboard-only components go in components/dashboard/
- ✅ `app/components/dashboard/MyNewWidget.tsx`
- ❌ Defining components inline inside page.tsx

### 5. Shared helpers go in lib/utils.ts
Formatting, color helpers, constants — not inline in components.

## File Size Limits
| Type | Max lines |
|---|---|
| Page (shell) | ~400 |
| Component | ~300 |
| lib/api.ts | ~200 |
| lib/utils.ts | ~100 |

If a file exceeds this, split it before adding more features.

## Before every PR
- No new `console.log` in production code
- No new hardcoded URLs
- No new inline component definitions in page.tsx
