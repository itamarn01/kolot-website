# KOLOT – קולות · kolotband.co.il

The KOLOT band website, rebuilt in code (Next.js) from the WordPress/Elementor site — same pages, URLs, content, fonts, colors and angled-shape design — plus animations, a cookie-consent system, an accessibility menu and legal pages.

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (all pages are static)
```

Deploy: import the repo in **Vercel** (framework preset: Next.js). No environment variables are needed.

## What's where

| Path | What it is |
| --- | --- |
| `content/pages/*.json` | **All page content** (texts, images, videos, packages, prices). Edit these to change the site. |
| `content/testimonials.json` | Customer reviews (4 shown, "load more" shows the rest). |
| `lib/site.ts` | Contact details, menu, **Zooglot form links**, legal placeholders. |
| `lib/legal.tsx` | Accessibility statement, privacy policy, cookie policy, terms (HE + EN). |
| `components/sections/*` | One component per section type (hero, banners, intro, gallery, videos, packages…). |
| `components/SiteHeader.tsx` | Logo, desktop trapezoid menu, mobile GSAP overlay, language switch. |
| `components/SiteFooter.tsx` | "צרו קשר" + Zooglot form, social/contact bar, legal links. |
| `components/consent.tsx` | Cookie banner. Google Tag Manager (`GTM-W5DWRFJ6`) loads **only after consent**. |
| `components/AccessibilityWidget.tsx` | Accessibility menu (text size, contrast, grayscale, links, readable font, stop animations…). |
| `app/globals.css` | Design tokens and all styles. |
| `public/media`, `public/icons` | Images and SVG icons taken from the original site. |
| `app/fonts/` | Self-hosted fonts: **barlev** (headings), **Assistant** (body), Karantina, ADAM.CG PRO. |

## URLs (1:1 with WordPress)

`/`, `/להקה-לחתונה/`, `/להקה-לחתונה-copy/` (bar/bat mitzva), `/reception/`, `/corporate/`, `/djs/`, `/packages/`, `/ppackages/`, `/energy-packages/`, `/en/`, `/en/wedding-band/`, `/en/barbatmitzva/`, `/en/reception-2/`, `/en/corporate-2/`, `/en/djs2/`, `/en/packages-en/`, `/en/ppackages-en/`.

New: `/accessibility-statement/`, `/privacy-policy/`, `/cookie-policy/`, `/terms/` (+ `/en/…`), `/sitemap.xml`, `/robots.txt`.

Hebrew URLs are served through rewrites in `next.config.ts` (Next.js can't prerender non-ASCII folder names), so the public addresses are unchanged. Old WP URLs (`/hello-world/`, `/testimonial/*`) redirect.

## KOLOT Worldwide (destination weddings & luxury events)

`/en/international/` (flagship) and `/international/` – linked from the menu (gold item) and a teaser on both home pages.

* Texts, destinations, partners: `lib/international.ts`
* **Videos:** put MP4s in `public/media/international/` and set `video` on each story (and `HERO_VIDEO`) in `lib/international.ts`. Until then each card shows a still and links to the Instagram reel.
* **Separate lead form:** paste the Zooglot embed links into `ZOOGLOT_FORM_INTL` in `lib/site.ts` (falls back to the regular forms while empty).
* Animations: GSAP ScrollTrigger (pinned horizontal destinations, count-up stats, timeline, word reveals) – all disabled for "reduce motion" / the accessibility menu.

## Contact form → Zooglot

The form is the Zooglot embed (Hebrew form on Hebrew pages, English form on English pages). To change it, edit `ZOOGLOT_FORM` in `lib/site.ts`. Submissions go straight into the Zooglot app.

## Before going live – fill in

In `lib/site.ts` → `LEGAL`: legal business name, business ID (ח.פ / ע.מ), address, accessibility coordinator name, and the court district in `lib/legal.tsx` (terms). They are highlighted in yellow on the legal pages until replaced.

## Notes

* **barlev** and **ADAM.CG PRO** are commercial fonts copied from the current site — make sure your license covers web use on the new site.
* The page layout mirrors the original exactly, including the English pages (which used an RTL layout on WordPress); English text blocks are marked `lang="en"`/`dir="ltr"` so punctuation renders correctly.
* Animations respect the visitor's "reduce motion" setting and the "stop animations" option in the accessibility menu.
