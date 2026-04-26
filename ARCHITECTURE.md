# quantsignal-web — Architecture

## Stack
- Next.js 14 (App Router)
- TypeScript
- Supabase (auth)
- Deployed on Vercel/Netlify

## Environment Variables
```
NEXT_PUBLIC_API_URL=https://quantsignal-api-production-a5e1.up.railway.app/api/v1
```
All API calls fall back to the hardcoded URL if this env var is not set. Set it in your deployment dashboard.

---

## Directory Map

```
app/
├── dashboard/
│   └── page.tsx              # 608 lines — shell only, composes all subcomponents
├── agents/page.tsx           # Agents page
├── guardian/page.tsx         # TradeGuardian page
├── portfolio/page.tsx        # Portfolio page
├── performance/page.tsx      # Performance page
├── pricing/page.tsx          # Pricing page
├── landing/page.tsx          # Landing/marketing page
├── auth/page.tsx             # Auth page
├── onboarding/page.tsx       # Onboarding flow
├── admin/page.tsx            # Admin panel
├── how-it-works/page.tsx     # Explainer page
│
├── components/
│   ├── dashboard/            # Dashboard-specific subcomponents
│   │   ├── AssetList.tsx     # Left panel — signal list + filters
│   │   ├── SignalTab.tsx     # Signal detail + replay tab
│   │   ├── SidebarContent.tsx# Right sidebar — levels, confluence, factors
│   │   ├── SignalHelpers.tsx  # StaleBadge, MarketStatusBadge, generateOneLiner
│   │   ├── LiquidityCard.tsx # Liquidity levels card
│   │   ├── TrackRecordTab.tsx# Track record / EV stats tab
│   │   ├── EstClock.tsx      # EST clock display
│   │   ├── AlertBell.tsx     # Push alert bell per symbol
│   │   ├── ShockWarning.tsx  # Shock/volatility warning badge
│   │   ├── MTFBar.tsx        # Multi-timeframe bar
│   │   ├── EarningsBadge.tsx # Earnings event badge
│   │   └── PushBell.tsx      # Global push notification bell
│   │
│   ├── AgentChat.tsx         # Perseus AI chat component
│   ├── PerseusStream.tsx     # Perseus streaming signal generator
│   ├── EconomicCalendar.tsx  # Economic calendar widget
│   ├── MarketSentiment.tsx   # Market sentiment display
│   ├── SignalDrawer.tsx      # Signal detail drawer
│   ├── TradeGuardian.tsx     # TradeGuardian alert modal
│   ├── ProGate.tsx           # Pro feature gate wrapper
│   ├── NewsTab.tsx           # News feed tab
│   ├── TradingChart.tsx      # TradingView chart embed
│   ├── FinSightDrawer.tsx    # FinSight AI drawer
│   ├── UpgradeModal.tsx      # Upgrade prompt modal
│   ├── TutorialModal.tsx     # Onboarding tutorial modal
│   ├── FeedbackWidget.tsx    # In-app feedback widget
│   ├── Animated.tsx          # StaggerList / StaggerItem animation wrappers
│   └── SmoothScroll.tsx      # Smooth scroll wrapper
│
├── lib/
│   ├── api.ts                # 112 lines — ALL API calls go through here
│   └── utils.ts              # 37 lines — formatPrice, dirColor, badge, getExecutionWindows, TIMEZONES, TYPE_FILTERS
│
└── hooks/
    └── usePushNotifications.ts
```

---

## Data Flow

```
page.tsx (shell)
  ├── useEffect → lib/api.ts → Railway backend
  ├── state: signals, selected, detail, filter, search, outcomeMap
  ├── state: replayMode, replayData, replayDate, replayAIText
  ├── renders → <AssetList />        (left panel)
  ├── renders → <SignalTab />         (signal detail + replay)
  ├── renders → <SidebarContent />    (right sidebar)
  └── renders → <TradeGuardian />     (alert modal)
```

---

## API Client — lib/api.ts

All fetch calls go through `apiFetch()` which:
- Injects `x-user-id` header automatically
- Throws `UpgradeRequiredError` on 429 (rate limit)

Exported functions:
| Function | Endpoint |
|---|---|
| `fetchSignal(symbol)` | GET /signals/:symbol |
| `fetchAllSignals(type?)` | GET /signals |
| `fetchMarketMood()` | GET /market/mood |
| `subscribeAlert(email, symbol)` | POST /alerts/subscribe |
| `fetchTradeHistory()` | GET /history/trades |
| `fetchEvStats()` | GET /system/ev-stats |
| `fetchMorningBriefing()` | GET /system/morning-briefing |
| `fetchReplay(symbol, date)` | GET /signals/:symbol/replay |
| `explainReplay(payload)` | POST /replay/explain |
| `createCheckout(email, userId)` | POST /payments/checkout |

---

## Rules

1. **Never hardcode the API URL** — use `process.env.NEXT_PUBLIC_API_URL`
2. **All API calls go through lib/api.ts** — no bare `fetch()` calls in components
3. **Shared formatting/helpers go in lib/utils.ts** — not inline in components
4. **Dashboard subcomponents live in components/dashboard/** — not inline in page.tsx
5. **page.tsx is a shell only** — it holds state and composes components, no large JSX blocks

---

## Line Count Reference (post-refactor)

| File | Lines |
|---|---|
| dashboard/page.tsx | 608 |
| lib/api.ts | 112 |
| lib/utils.ts | 37 |
| components/dashboard/AssetList.tsx | 138 |
| components/dashboard/SignalTab.tsx | 160 |
| components/dashboard/SidebarContent.tsx | 391 |
| components/dashboard/SignalHelpers.tsx | 64 |
