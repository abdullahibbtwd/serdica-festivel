# Ulpia Serdica Festival

Bilingual static site (Bulgarian default + English) for a Roman living-history festival in Sofia.

## Stack

- Astro (static) + TypeScript strict
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Content collections + Zod
- Self-hosted Fontsource: EB Garamond + Inter (latin + cyrillic)
- Icons via `astro-icon` + `@iconify-json/material-symbols`
- `@astrojs/sitemap`, hand-written hreflang + JSON-LD

## Commands

```bash
npm install
npm run dev       # drafts visible automatically
npm run build     # production — draft items hidden
PUBLIC_SHOW_DRAFTS=true npm run build   # preview full design with PLACEHOLDER markers
npm run preview
npm run check
```

## Locales

- `/` → `/bg/`
- English: `/en/…`
- Programme: `/bg/programme/`, `/en/programme/`

## Editing content

| Path | Purpose |
| --- | --- |
| `src/content/festival.yaml` | Hero, about, contact, stats, admission |
| `src/content/expect/` | Six “what to expect” cards |
| `src/content/programme/` | Days + timed items (`highlight: true` for home) |
| `src/content/locations/` | Venues + map pins |
| `src/content/partners/` | Organiser / institutional / sponsors |
| `src/content/gallery/` | Gallery images (`rightsConfirmed`) |
| `src/i18n/ui.ts` | UI chrome labels |

Every bilingual field needs both `bg` and `en`. Bulgarian drafts are marked `# DRAFT-BG: needs native review`.

Draft / unconfirmed items use `status: draft` or `rightsConfirmed: false`. They appear in `astro dev` and when `PUBLIC_SHOW_DRAFTS=true`, with a visible PLACEHOLDER marker.

Replace images in `src/assets/placeholders/` (or point content `image`/`src` fields at new assets under `src/assets/`).
