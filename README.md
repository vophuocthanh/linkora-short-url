<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma" alt="Prisma 7" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql" alt="Neon PostgreSQL" />
  <img src="https://img.shields.io/badge/Auth-NextAuth_5-6C47FF" alt="NextAuth v5" />
  <img src="https://img.shields.io/badge/i18n-VN_|_EN-22C55E" alt="i18n VN | EN" />
</p>

<h1 align="center">Linkora</h1>
<p align="center"><strong>URL Shortener & QR Code Generator — fast, private, zero third-party APIs</strong></p>

---

## Features

[](https://github.com/dungngminh/simutil#features)

- **URL Shortener** — Create short links with full advanced options: custom slug, expiration (1/7/30 days), click limits, password protection (bcrypt), safe preview, built-in UTM builder.
- **Bulk Shorten** — Paste multiple URLs at once (one per line), process in parallel, export results as CSV.
- **Redirect 5-Step Gate** — Check existence → expiry/limit → password → safe preview → count click & redirect. Every branch renders friendly UI instead of bare errors.
- **Password-Protected Links** — Require a password before redirecting. Passwords are always bcrypt-hashed, never stored in plaintext.
- **Safe Preview** — Intermediate page showing the destination before redirecting, giving recipients peace of mind when clicking short links.
- **Analytics** — 14-day click chart + breakdown by device (mobile/desktop/tablet), traffic source (referrer), and country. Aggregated in pure JS, no chart library needed.
- **QR Code Client-Side** — 100% browser-rendered QR via the `qrcode` library — no external API calls, works offline. Customizable colors, error correction level (L/M/Q/H), logo embedding, PNG & SVG download, copy image to clipboard.
- **Dynamic QR** — QR points to a short link; change the destination without reprinting the QR.
- **Link-in-Bio** — Public bio page at `/u/username`. Toggle links on/off your bio right from the dashboard. Bio links still go through the full redirect flow.
- **Authentication** — NextAuth v5 with JWT strategy. Register / Sign in / Sign out. Links auto-attach to your account when signed in.
- **i18n** — Vietnamese (default) + English. Cookie-based locale — short links never have a `/vi/` or `/en/` prefix.
- **Glassmorphism UI** — Frosted glass effect throughout with animated aurora background, Plus Jakarta Sans + Geist Mono, dark theme.

## Architecture

[](https://github.com/dungngminh/simutil#architecture)

```
                         ┌─────────────────────────────────────────┐
                         │           USER (Browser)              │
                         └───────────────┬─────────────────────────┘
                                         │
       ┌─────────────────────────────────┼──────────────────────────────────┐
       │                                 │                                  │
  [Home page]                      [Click short link]               [Dashboard]
  /  (ToolPanel)                   /:slug                           /profile, /profile/:slug
       │                                 │                                  │
       ▼                                 ▼                                  ▼
 ┌───────────┐                   ┌──────────────┐                  ┌──────────────┐
 │ API layer │                   │ Resolve page │                  │ Server       │
 │/api/shorten│                  │ /[slug]      │                  │ Components   │
 │/api/unlock │                  │ (5-step gate)│                  │ + Actions    │
 └─────┬─────┘                   └──────┬───────┘                  └──────┬───────┘
       │                                │                                 │
       └────────────────┬───────────────┴─────────────────┬───────────────┘
                        ▼                                 ▼
                ┌───────────────┐                 ┌───────────────┐
                │  src/lib/     │                 │ Prisma Client │
                │ short-link    │◄────────────────►│  (PostgreSQL) │
                │ link-status   │                 │  Neon DB      │
                │ click, utm    │                 └───────────────┘
                │ analytics     │
                │ password      │
                │ qr-code       │
                └───────────────┘
```

### Design Principles

[](https://github.com/dungngminh/simutil#design-principles)

- **Separation of logic & UI** — `src/lib/` contains pure logic, unaware of HTTP or React. Easy to test, easy to reuse. Example: `getLinkStatus()` is called in 4 places but written only once.
- **Two-layer validation** — Client validates for fast UX, server validates for security. Never trust the client.
- **Right tool for each job** — Server Component for redirect + UI, Route Handler for API CRUD, Server Action for form mutations.
- **Denormalized `clickCount`** — Fast counter on the `Link` table for instant display; `Click` table stores per-event details for deep analytics.

## Project Structure

[](https://github.com/dungngminh/simutil#project-structure)

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout: fonts, i18n, auth provider
│   ├── page.tsx                  # Home page — ToolPanel (3 tabs)
│   ├── not-found.tsx             # Custom 404 page
│   ├── globals.css               # CSS variables, glass-surface, animations
│   ├── (auth)/                   # Auth layout group
│   │   ├── login/page.tsx        # Sign in page
│   │   └── register/page.tsx     # Sign up page
│   ├── [slug]/page.tsx           # Redirect handler — 5-step gate
│   ├── preview/[slug]/page.tsx   # Safe preview interstitial
│   ├── protected/[slug]/page.tsx # Password gate page
│   ├── profile/
│   │   ├── page.tsx              # Personal dashboard
│   │   ├── actions.ts            # Server Actions (delete, toggle bio, update profile)
│   │   └── [slug]/page.tsx       # Per-link analytics
│   ├── u/[username]/page.tsx     # Public link-in-bio page
│   └── api/
│       ├── shorten/route.ts      # POST /api/shorten
│       ├── unlock/route.ts       # POST /api/unlock
│       └── auth/
│           ├── register/route.ts # POST /api/auth/register
│           └── [...nextauth]/route.ts
│
├── components/
│   ├── features/                 # Feature components
│   │   ├── tool-panel.tsx        # Tab switcher (shorten / bulk / QR)
│   │   ├── url-shortener/        # Shortener panel + advanced options + result
│   │   ├── bulk-shortener/       # Bulk URL input + CSV export
│   │   ├── qr-generator/         # QR config + live preview
│   │   ├── analytics/            # Bar chart + breakdown cards
│   │   ├── auth/                 # Login / Register forms
│   │   ├── profile/              # Profile info, bio settings, link history
│   │   └── link/                 # Badges, status screen, unlock form
│   ├── ui/                       # Reusable UI primitives
│   │   ├── glass-card.tsx        # Frosted glass container
│   │   ├── glass-button.tsx      # 3 variants × 3 sizes + loading
│   │   ├── glass-input.tsx       # Frosted input + icon + invalid state
│   │   ├── tab-switcher.tsx      # Animated tab bar
│   │   ├── aurora-background.tsx # Animated gradient blobs
│   │   ├── copy-button.tsx       # Clipboard copy with transient state
│   │   ├── copy-image-button.tsx # Image-to-clipboard
│   │   ├── locale-switcher.tsx   # VN / EN dropdown
│   │   └── icons.tsx             # 15 hand-crafted SVG icons
│   ├── layout/                   # Header, footer, auth nav
│   └── providers/                # SessionProvider wrapper
│
├── lib/                          # Business logic (framework-agnostic)
│   ├── prisma.ts                 # Prisma singleton (Pg adapter)
│   ├── short-link.ts             # createShortLink()
│   ├── link-status.ts            # getLinkStatus(), isResolvable()
│   ├── click.ts                  # recordClick() — transaction
│   ├── analytics.ts              # buildDailySeries(), topBreakdown()
│   ├── password.ts               # hashPassword(), verifyPassword()
│   ├── qr-code.ts                # generateQrPng(), generateQrSvg()
│   ├── utm.ts                    # appendUtm(), hasUtm()
│   ├── user-agent.ts             # parseDevice()
│   ├── utils.ts                  # cn(), isValidUrl(), generateSlug(), formatDate(), ...
│   └── types.ts                  # Shared TypeScript interfaces
│
├── hooks/                        # React hooks
│   ├── use-copy-to-clipboard.ts
│   └── use-copy-image.ts
│
├── i18n/                         # next-intl configuration
│   ├── config.ts                 # Locales, localeDetails
│   ├── locale.ts                 # Server actions (get/set cookie)
│   └── request.ts                # Message loader
│
├── auth.ts                       # NextAuth v5 config (JWT + Credentials)
├── generated/prisma/             # Generated Prisma client (version-controlled)
└── types/next-auth.d.ts          # Session type augmentation

prisma/
├── schema.prisma                 # User → Link → Click
└── migrations/                   # SQL migration history

messages/
├── vi.json                       # 200+ Vietnamese strings
└── en.json                       # 200+ English strings
```

## Core Flows

[](https://github.com/dungngminh/simutil#core-flows)

### Shorten URL

[](https://github.com/dungngminh/simutil#shorten-url)

```
User input → Client validate → POST /api/shorten → Server validate
→ createShortLink() → prisma.link.create() → Return { slug, shortUrl }
```

1. Client: `isValidUrl()` + `applyUtm()` + compute `expiresAt`
2. Server: validate URL, check custom slug format + uniqueness, hash password (bcrypt)
3. `createShortLink()`: use custom slug if provided, otherwise generate random 6-char slug (retry max 5 times)
4. Attach `userId` if signed in, hash password if present before persisting

### Redirect (5-Step Gate)

[](https://github.com/dungngminh/simutil#redirect)

```
GET /:slug → findUnique → getLinkStatus()
  ├─ not found        → 404 page
  ├─ expired          → "Expired" page
  ├─ limit reached    → "Limit reached" page
  ├─ has password     → redirect /protected/:slug
  ├─ safe preview     → redirect /preview/:slug
  └─ active           → recordClick() → 302 redirect
```

The check order is deliberate: expiry/limit first → password → preview → only count click when the link is actually accessed.

### Password Gate & Safe Preview

[](https://github.com/dungngminh/simutil#password-gate--safe-preview)

- **Password Gate** (`/protected/:slug`) — Password input form, calls `POST /api/unlock`, verify bcrypt. Wrong → 401. Correct → record click → redirect.
- **Safe Preview** (`/preview/:slug`) — Shows destination hostname + "Continue" button. Submit form via Server Action → record click → redirect.
- Difference: Password uses API + fetch (needs error display), Preview uses Server Action (native form submit, no JS required).

### Analytics

[](https://github.com/dungngminh/simutil#analytics)

```
recordClick()                          /profile/:slug
  ├─ parseDevice(user-agent)           buildDailySeries() → 14-day chart
  ├─ referer (header)                  topBreakdown(device)
  └─ country (x-vercel-ip-country)     topBreakdown(referer)
       │                               topBreakdown(country)
       ▼                                    │
  Click row + clickCount++                  ▼
                                   [link-analytics.tsx]
                                   Bar chart + 3 breakdown cards (CSS only)
```

### QR Generation

[](https://github.com/dungngminh/simutil#qr-generation)

```
[qr-generator-panel.tsx] → Options change → useEffect
  → generateQrPng() → Canvas → composite logo → PNG data URL
  → generateQrSvg() → SVG string
  → [qr-code-preview.tsx] → Download PNG/SVG, Copy image, Copy text
```

- 100% client-side, zero external API calls, works offline.
- Logo: `errorCorrectionLevel: "H"`, size = 22% of canvas, 16% padding with rounded background.

## Database Schema

[](https://github.com/dungngminh/simutil#database-schema)

```
User ──1:N──▶ Link ──1:N──▶ Click
```

| Model     | Key Fields                                                                                                                                                                        | Notes                                       |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| **User**  | `id`, `email` (unique), `password` (bcrypt), `name?`, `username?` (unique), `bio?`, `createdAt`                                                                                   | Optional — links can be created anonymously |
| **Link**  | `id`, `slug` (unique), `originalUrl`, `title?`, `clickCount` (denormalized), `expiresAt?`, `password?` (bcrypt), `maxClicks?`, `safePreview`, `showOnBio`, `userId?`, `createdAt` | Denormalized `clickCount` for fast display  |
| **Click** | `id`, `linkId` (FK), `referer?`, `country?`, `device?`, `createdAt`                                                                                                               | One row per click event for deep analytics  |

## Installation

[](https://github.com/dungngminh/simutil#installation)

### Prerequisites

[](https://github.com/dungngminh/simutil#prerequisites)

- **Node.js** ≥ 20
- **pnpm** (recommended) or npm / yarn / bun
- **PostgreSQL** database (tested with [Neon](https://neon.tech) serverless)

### From source

[](https://github.com/dungngminh/simutil#from-source)

```bash
git clone https://github.com/<your-org>/linkora.git
cd linkora

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env — fill in DATABASE_URL and AUTH_SECRET

# Run database migrations
npx prisma migrate dev

# Start dev server
pnpm dev
# → http://localhost:3002
```

### Environment Variables

[](https://github.com/dungngminh/simutil#environment-variables)

```env
DATABASE_URL='postgresql://user:pass@host/db?sslmode=verify-full'
AUTH_SECRET='your-random-secret'
```

> ⚠️ Always use `sslmode=verify-full` with cloud PostgreSQL (Neon, Supabase, AWS RDS). Modes like `require`, `prefer`, `verify-ca` are treated as aliases now but will adopt weaker libpq semantics in a future version.

### Production Build

[](https://github.com/dungngminh/simutil#production-build)

```bash
pnpm build
pnpm start   # Runs on port 3002
```

## Design Decisions

[](https://github.com/dungngminh/simutil#design-decisions)

| Problem                   | Chosen Approach                                                 | Alternative                                                                                       |
| ------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Redirect handler**      | Server Component `page.tsx` — render UI + redirect in one place | Edge Middleware — faster but Prisma+PG can't run on Edge without HTTP driver                      |
| **Slug generation**       | Random 6 chars + retry (max 5)                                  | Base62 counter — shorter, no retry, but exposes order & link count                                |
| **Click counting**        | Synchronous in request (write then redirect)                    | Async via queue — faster redirect but delayed accuracy                                            |
| **Analytics aggregation** | Fetch all Click rows → group in JS                              | `prisma.groupBy` / SQL `GROUP BY` — faster at scale; JS is sufficient for current volume          |
| **QR rendering**          | `qrcode` npm, client-side only                                  | `qr-code-styling` — artistic QR (rounded dots, gradient) but heavier                              |
| **Logo in QR**            | PNG only (canvas compositing)                                   | Embed `<image>` in SVG string for SVG logo support                                                |
| **Link passwords**        | bcrypt (same strength as account passwords)                     | SHA-256 — faster for shared secrets but weaker against weak passwords                             |
| **Link-in-bio URL**       | `/u/username` (static prefix)                                   | `/@username` — conflicts with Next.js parallel route slots; `/[username]` collides with `/[slug]` |
| **i18n strategy**         | Cookie-based — short links stay clean                           | URL prefix (`/vi/`, `/en/`) — better SEO but breaks short link paths                              |
| **Slug uniqueness**       | Read-before-write (`findUnique` then create)                    | Catch `P2002` unique constraint — atomic, no race condition; chose read-before for simplicity     |

## Scripts

[](https://github.com/dungngminh/simutil#scripts)

| Script             | Description                                |
| ------------------ | ------------------------------------------ |
| `pnpm dev`         | Dev server at `localhost:3002` (Turbopack) |
| `pnpm build`       | Production build                           |
| `pnpm start`       | Run production build                       |
| `pnpm lint`        | ESLint                                     |
| `pnpm postinstall` | Auto-run `prisma generate`                 |

## Tech Stack

[](https://github.com/dungngminh/simutil#tech-stack)

- [Next.js 16](https://nextjs.org) — React framework (App Router, Turbopack)
- [React 19](https://react.dev) — UI library
- [Prisma 7](https://prisma.io) — TypeScript-first ORM
- [PostgreSQL](https://neon.tech) — Serverless database (Neon)
- [NextAuth v5](https://authjs.dev) — JWT-based authentication
- [Tailwind CSS 4](https://tailwindcss.com) — Utility-first CSS
- [next-intl v4](https://next-intl.dev) — i18n (VN + EN)
- [qrcode](https://www.npmjs.com/package/qrcode) — Client-side QR generation
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) — Password hashing

## Roadmap

[](https://github.com/dungngminh/simutil#roadmap)

See [`FEATURES_ANALYSIS.md`](./FEATURES_ANALYSIS.md) for the full analysis.

- [x] URL Shortener (basic + advanced options)
- [x] Redirect 5-step gate
- [x] Analytics (chart + breakdown)
- [x] QR client-side (PNG / SVG / Logo)
- [x] Link-in-Bio
- [x] Authentication (NextAuth v5)
- [x] i18n (VN / EN)
- [x] Bulk shorten + CSV export
- [ ] Custom domain
- [ ] Smart links (device / country based)
- [ ] Free / Pro plans
- [ ] API key for developers
- [ ] Rollup analytics (for large data)

## License

[](https://github.com/dungngminh/simutil#license)

MIT — see [LICENSE](./LICENSE)
