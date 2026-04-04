# ScholaLMS — Next.js 14 + MUI Frontend

A modern Learning Management System built with **Next.js 14 App Router**, **React 18**, **TypeScript**, and **MUI v5**.

## Pages

| Route | Page |
|---|---|
| `/` | Landing page (public, no sidebar) |
| `/dashboard` | Student dashboard |
| `/courses` | Courses listing — search, filter by category/level, sort, My Courses tab |
| `/courses/:id` | Course detail — video player, tabs (overview, curriculum, discussion, resources) |
| `/quiz/:id` | Interactive quiz — MCQ, true/false, short answer, countdown timer, results |
| `/admin` | Admin dashboard — KPIs, bar chart, donut chart, user table, funnel, health |

## Stack

- **Next.js 14** — App Router, file-based routing, server components
- **React 18** — Client components with `'use client'`
- **TypeScript 5** — Strict mode + extra safety flags (`noUncheckedIndexedAccess`, `noImplicitReturns`)
- **MUI v5** — Material UI component library with custom theme
- **Tailwind CSS v3** — Utility classes alongside MUI; preflight disabled to avoid style conflicts
- **Emotion** — CSS-in-JS styling (bundled with MUI)
- **Google Fonts** — DM Serif Display + DM Sans (loaded in root layout)

## Quick start

```bash
# Install dependencies
npm install

# Run dev server → http://localhost:3000
npm run dev

# Type-check
npx tsc --noEmit

# Production build
npm run build && npm start
```

## Project structure

```
schola-lms-next/
├── app/
│   ├── layout.tsx              # Root layout (fonts, ThemeRegistry)
│   ├── page.tsx                # Landing page
│   ├── dashboard/
│   │   └── page.tsx            # Student dashboard
│   ├── courses/
│   │   ├── page.tsx            # Courses listing
│   │   └── [id]/
│   │       └── page.tsx        # Course detail
│   ├── quiz/
│   │   └── [id]/
│   │       └── page.tsx        # Quiz view
│   └── admin/
│       └── page.tsx            # Admin dashboard
├── components/
│   ├── layout/
│   │   ├── ThemeRegistry.tsx   # MUI ThemeProvider wrapper
│   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   └── DashboardLayout.tsx # Layout with sidebar
│   └── ui/
│       └── CourseCard.tsx      # Reusable course card
├── lib/
│   ├── theme.ts                # MUI custom theme
│   └── data.ts                 # Mock data + types
├── next.config.js
├── tsconfig.json
└── package.json
```

## Customizing the theme

Edit `lib/theme.ts`:

```ts
palette: {
  primary: { main: '#2d8a7a' },   // Teal — change for brand color
  secondary: { main: '#1a1a2e' }, // Dark sidebar
  background: { default: '#faf9f6', paper: '#ffffff' },
}
```

## Connecting to a real API

Replace static arrays in `lib/data.ts` with API calls in page components:

```tsx
// app/courses/page.tsx
const { data: courses } = await fetch('/api/courses').then(r => r.json())
```

Or use React Query / SWR for client-side fetching:

```tsx
import useSWR from 'swr'
const { data } = useSWR('/api/courses', fetcher)
```
