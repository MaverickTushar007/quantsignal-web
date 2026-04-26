# QuantSignal Web — Architecture

## Stack
- **Framework:** Next.js 14 (App Router)
- **Auth:** Supabase
- **Deployment:** Netlify
- **API:** `process.env.NEXT_PUBLIC_API_URL` → quantsignal-api on Railway

---

## Directory Map

```
app/
├── page.tsx                  # Root redirect → /landing or /dashboard
├── layout.tsx                # Global layout, fonts, metadata
├── globals.css               # Global styles
│
├── dashboard/
│   └── page.tsx              # Main dashboard (1049 lines) — signal list,
│                             # detail panel, replay mode, mobile layout
│
├── landing/page.tsx          # Public landing page
├── auth/page.tsx             # Login / signup
├── agents/page.tsx           # AI agent management UI
├── guardian/page.tsx         # Trade Guardian standalone page
├── performance/page.tsx      # Performance tracking page
├── portfolio/page.tsx        # Portfolio page
├── pricing/page.tsx          # Pricing / upgrade page
├── onboarding/page.tsx       # New user onboarding
├── how-it-works/page.tsx     # Explainer page
├── admin/page.tsx            # Admin panel
│
├── components/
│   ├── AgentChat.tsx         # Perseus AI chat panel (props: symbol, userId)
│   ├── EconomicCalendar.tsx  # Economic events calendar
│   ├── MarketSentiment.tsx   # Market sentiment bar
│   ├── SignalDrawer.tsx      # Signal detail drawer (props: symbol, onClose)
│   ├── TradeGuardian.tsx     # Trade Guardian modal (props: signal, onClose)
│   ├── NewsTab.tsx           # News feed tab (props: symbol)
│   ├── ProGate.tsx           # Pro feature gate wrapper
│   ├── PerseusStream.tsx     # SSE streaming signal component
│   ├── TradingChart.tsx      # Price chart (props: symbol)
│   ├── FeedbackWidget.tsx    # User feedback button
│   ├── FinSightDrawer.tsx    # FinSight AI drawer
│   ├── UpgradeModal.tsx      # Upgrade prompt modal
│   ├── TutorialModal.tsx     # Onboarding tutorial
│   ├── Animated.tsx          # Animation primitives (StaggerList, SlideIn, etc.)
│   └── SmoothScroll.tsx      # Smooth scroll wrapper
│
├── components/dashboard/     # Dashboard-specific sub-components
│   ├── AlertBell.tsx         # Per-symbol alert subscription bell
│   ├── EarningsBadge.tsx     # Earnings event badge
│   ├── EstClock.tsx          # EST clock with timezone switcher
│   ├── LiquidityCard.tsx     # Liquidation levels card
│   ├── MTFBar.tsx            # Multi-timeframe alignment bar
│   ├── PushBell.tsx          # Push notification toggle
│   ├── ShockWarning.tsx      # Market shock warning banner
│   ├── SignalHelpers.tsx     # StaleBadge, MarketStatusBadge, generateOneLiner
│   └── TrackRecordTab.tsx    # Historical track record tab
│
├── lib/
│   ├── api.ts                # ALL API calls — single source of truth
│   │                         # fetchSignal, fetchAllSignals, fetchMarketMood,
│   │                         # fetchTradeHistory, fetchEvStats, fetchMorningBriefing,
│   │                         # fetchReplay, explainReplay, createCheckout,
│   │                         # subscribeAlert, UpgradeRequiredError
│   ├── utils.ts              # Shared utilities — formatPrice, dirColor, badge,
│   │                         # TYPE_FILTERS, getExecutionWindows, TIMEZONES
│   ├── supabase.ts           # Supabase client init
│   └── useAuth.ts            # Auth hook — user session, isPro flag
│
└── hooks/
    └── usePushNotifications.ts  # Web push notification hook
```

---

## Data Flow

```
User action
    ↓
dashboard/page.tsx  (state, layout, routing)
    ↓
lib/api.ts          (all fetch calls, error handling, auth headers)
    ↓
quantsignal-api     (Railway backend)
    ↓
Components render   (receive data as props)
```

---

## Key Rules

1. **All API calls go through `lib/api.ts`** — never call `fetch()` directly in a component
2. **API URL is set once** via `NEXT_PUBLIC_API_URL` env var — never hardcode the Railway URL
3. **Dashboard sub-components** live in `components/dashboard/` — they receive props, no internal fetch
4. **Shared logic** (formatPrice, dirColor, etc.) lives in `lib/utils.ts`
5. **Auth state** comes from `useAuth` hook — never read Supabase directly in components

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (set in Netlify dashboard) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
