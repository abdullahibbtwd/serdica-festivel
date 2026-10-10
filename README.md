# Ulpia Serdica Festival

Bilingual static site (Bulgarian default + English) for a Roman living-history festival in Sofia, organised by Serdica Aeterna Association.

Currently in **between-editions** mode: past editions 2025 and 2026 are documented; the next edition is not yet announced.

## Stack

- Astro (static) + TypeScript strict
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Content collections + Zod
- Self-hosted Fontsource: EB Garamond + Inter (latin + cyrillic)
- Icons via `astro-icon` + `@iconify-json/material-symbols`
- `@astrojs/sitemap`, hreflang + JSON-LD (Organization + past Events)

## Commands

```bash
npm install
npm run dev       # drafts visible automatically
npm run build     # production — draft / unconfirmed items hidden
PUBLIC_SHOW_DRAFTS=true npm run build   # preview with PLACEHOLDER markers
npm run preview
npm run check
```

## Locales

- `/` → `/bg/`
- English: `/en/…`
- Edition pages: `/bg/editions/2026/`, `/en/editions/2025/`, …
- Programme: only generated when `festival.mode: upcoming` and at least one confirmed programme item exists

## Editing content

| Path | Purpose |
| --- | --- |
| `src/content/festival.yaml` | Mode, admission, contact, hero, photographers |
| `src/content/editions/` | One file per year (2025, 2026) |
| `src/content/about/` | “Who are we?” bilingual text |
| `src/content/expect/` | Six theme cards (draft until activities confirmed) |
| `src/content/partners/` | Organiser / funder / institutional / sponsors |
| `src/content/gallery/` | Photos by edition (`rightsConfirmed`, `credit`) |
| `src/content/programme/` | Upcoming programme days (empty until next edition) |
| `src/content/locations/` | Venues for an upcoming edition (empty for now) |
| `src/i18n/ui.ts` | UI chrome labels |

Every bilingual field needs both `bg` and `en`. Bulgarian drafts are marked `# DRAFT-BG: needs native review`.

Draft / unconfirmed items use `status: draft`, `rightsConfirmed: false`, or `phoneStatus` / `facebookStatus: draft`. They appear in `astro dev` and when `PUBLIC_SHOW_DRAFTS=true`, with a visible PLACEHOLDER marker.

### Bringing back an upcoming edition

1. Set `mode: upcoming`, `nextEdition: 2026` (or the year), and dates on that edition.
2. Set `admission: free` only if confirmed.
3. Add confirmed programme items under `src/content/programme/` and locations if needed.
4. Rebuild — hero date, Free Admission badge (if free), Programme nav link and `/programme/` pages appear automatically.
