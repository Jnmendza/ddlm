# Oaxaca 2023

## Elevator Pitch

Immerse yourself in Oaxaca's Día de los Muertos through an interactive photo essay crafted for large-format storytelling. The site blends cinematic scroll effects, localized copy, and Supabase-powered galleries to surface the most evocative moments from 2023. Built for high-impact visuals, the experience pairs responsive video, performant media delivery, and a handcrafted component system.

## Tech Stack

| Layer     | Choice                                       | Notes                                                                |
| --------- | -------------------------------------------- | -------------------------------------------------------------------- |
| Framework | Next.js 15 (React 19, App Router, Turbopack) | Server/Client components, localized routing, background video        |
| Database  | Supabase Postgres + Storage                  | Photo metadata, tags, and asset delivery                             |
| Auth      | Supabase Auth via `@supabase/ssr`            | Cookie-aware client/server helpers, ready for session-based features |
| Hosting   | Vercel (recommended)                         | Edge-friendly Next.js deployment with media CDN                      |
| CI        | TBD                                          | Add GitHub Actions or Vercel Checks to mirror lint/build pipeline    |

## Quickstart

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure environment**
   Create `.env.local` and populate the Supabase keys (ask the project owner for values):
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
3. **Run the dev server**
   ```bash
   npm run dev
   ```
   Turbopack and `next-video` watcher run together; visit http://localhost:3000.
4. **Build for production**
   ```bash
   npm run build
   ```
5. **Lint / smoke-test**
   ```bash
   npm run lint
   ```

## Scripts

| Script          | Description                                                                         |
| --------------- | ----------------------------------------------------------------------------------- |
| `npm run dev`   | Starts the Turbopack dev server and watches local videos with `next-video sync -w`. |
| `npm run build` | Produces an optimized production build via `next build --turbopack`.                |
| `npm run start` | Serves the production build using Next.js.                                          |
| `npm run lint`  | Runs the repository-wide ESLint ruleset.                                            |

## Architecture Overview

- `src/app`: Next.js App Router pages, localized routes (`[locale]`), and API routes for images/tags.
- `src/components`: Reusable React components styled with Tailwind utilities (Hero, galleries, locale switcher).
- `src/hooks`: SWR-powered data hooks (`useImages`, `useTags`) for Supabase-backed endpoints.
- `src/lib`: Shared utilities for motion, media, scroll cleanup, and Supabase client wiring.
- `src/messages`: i18n message catalogs (EN/ES) consumed by `next-intl`.
- `src/i18n`: Locale definitions, type helpers, and middleware configuration.
- `public` / `videos`: Static assets and high-res background footage synced with `next-video`.

## Contributing

- **Branching**: Fork or branch off `main`; keep changes scoped and rebased.
- **Commits**: Follow Conventional Commits (`feat:`, `fix:`, `chore:`) so CI and changelogs stay readable.
- **Quality**: Run `npm run lint` before pushing; ensure new UI follows established Tailwind/TypeScript patterns.
- **PR Flow**: Open a draft PR early, request review when ready, and include screenshots or Looms for visual updates.
