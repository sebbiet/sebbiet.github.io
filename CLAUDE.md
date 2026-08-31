# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is Sebastian Tiller's personal website repository. It contains a professional portfolio and resume site built with vanilla HTML, CSS, and JavaScript.

## Repository Structure

```
sebastiantiller/
├── index.html              # Main website file
├── styles.css             # All styling
├── script.js              # JavaScript for interactions
├── robots.txt              # Search engine crawl rules
├── sitemap.xml             # XML sitemap
├── .gitignore              # Ignored files (OS cruft, editor folders, logs)
├── README.md              # Project readme
├── CLAUDE.md              # This file
├── writing/                # Long-form writing - BUILT BUT HIDDEN, not yet launched
│   ├── index.html          # Listing page for posts
│   └── how-i-work/
│       └── index.html      # "How I work" - a README for working with Seb (DRAFT)
├── docs/                  # Document assets
│   └── Sebastian Tiller - Resume - 2022.pdf
├── fonts/                  # Self-hosted woff2 (the CSP sets font-src 'self')
│   ├── space-grotesk-latin[-ext].woff2   # Display face
│   ├── geist-latin[-ext].woff2           # Text face
│   └── OFL.txt             # Licences + how to refresh the files
├── tools/                  # Build tools, not site pages
│   └── og-image.html       # 1200x630 OG image template; see its comment
│                           # block for how to regenerate the PNG
└── imgs/                  # Image assets
    ├── Seb.png             # Profile image (1024x1024)
    ├── seb-400.png         # Optimised profile image (fallback)
    ├── seb-400.webp        # Optimised profile image (WebP)
    ├── sebastian-tiller-og-2026.png    # Current Open Graph / social share image
    └── sebastian-tiller-og-banner.png  # Previous OG image, no longer referenced
```

## Website Features

The personal website includes:
- **Hero Section**: With tagline "Building enterprise software that doesn't feel like enterprise software"
- **About Me**: Personal introduction with career journey and values
- **My Journey**: Professional experience timeline
- **Projects & Experiments**: Mix of serious business projects and fun experiments
- **Writing**: BUILT BUT HIDDEN. The homepage band is commented out, the nav
  link is commented out, both pages are noindex'd, removed from sitemap.xml and
  disallowed in robots.txt. The article "How I work" is an unfinished draft with
  ~11 `SEB:` placeholder gaps. See the launch checklist in the commented-out
  writing section of index.html
- **Contact**: Links to LinkedIn and X (Twitter)

## Adding a new article

There is no build step, so adding an article is a manual, seven-step job. Miss a
step and the site is quietly inconsistent rather than broken, so work the list.

1. `mkdir writing/<slug>/` and copy `writing/how-i-work/index.html` as the
   starting point.
2. In the copy, update: `<title>`, `<meta name="description">`, canonical URL,
   all og/twitter tags, the `<h1>`, standfirst, date and read time.
3. Write the article inside `<div class="prose">`. Use the existing heading and
   blockquote patterns - `.prose h2` auto-numbers via a CSS counter.
4. Add an entry to the list in `writing/index.html`.
5. Add an entry to the `#writing` band in `index.html` (the homepage shows the
   most recent piece only).
6. Update the `.post-note` copy in BOTH `writing/index.html` and `index.html`.
   It currently says "One piece so far", which stops being true at article two.
7. Add the URL to `sitemap.xml`.

### The duplication problem

Every page carries its own copy of the `<head>` (CSP, meta, OG, canonical,
theme-init script, font preloads), the full navbar, and the footer. That is
roughly 70 lines duplicated per page. Consequences:

- Changing a nav item means editing every page, not one.
- The theme-init script MUST be present in `<head>` on every page or that page
  flashes the wrong theme and ignores the saved preference.
- The full navbar markup MUST be present, because `script.js` queries
  `.theme-toggle`, `.hamburger` and `.nav-menu` without guarding for null.

This is fine at two or three articles. It gets genuinely annoying past that.

### When it stops being fine

GitHub Pages runs Jekyll natively, and this repo has no `.nojekyll` file, so
Jekyll is already available at zero setup cost. Moving to it would mean layouts
and includes for the shared head/nav/footer, a `_posts` collection, and an
auto-generated listing page and sitemap - collapsing the seven steps above to
"write a Markdown file with front matter".

The trade-off is real: front matter and templating replace plain HTML files, and
previewing changes locally would need Ruby and `bundle exec jekyll serve` rather
than just opening the file. Worth it somewhere around the fourth or fifth
article; not worth it before then.

## Development Notes

### Tech Stack
- Pure HTML5 with semantic markup
- CSS3 with custom properties (CSS variables)
- Vanilla JavaScript for smooth scrolling and mobile menu
- No build process or dependencies
- Emoji favicon (🔧)

### Design system
`styles.css` opens with a comment block documenting the whole system: type
scale, colour roles, spacing, radii, shadows, motion and naming conventions.
**Read it before adding a section**, and extend the tokens rather than adding
new hardcoded values.

Two hard rules that are easy to break by accident:
1. The page CSP sets `font-src 'self'`. A Google Fonts `<link>` is blocked
   silently. New faces must be self-hosted in `fonts/`.
2. Scroll-reveal start states are scoped to `html.js`, which the inline head
   script adds. Anything that hides content before an animation must sit
   behind `.js` so the page still reads with JavaScript disabled.

`script.js` depends on these class names: `.navbar`, `.nav-menu`, `.nav-link`,
`.theme-toggle`, `.hamburger`, `.btn`, `.btn-primary`, `.js-years`,
`[data-reveal]`. Renaming any of them breaks behaviour or Google Analytics.

### Adding a page outside the homepage
Every page shares `styles.css`, `script.js` and the navbar markup verbatim.
Three things a new page must copy or it will misbehave:
1. The inline theme-init script in `<head>`, before the stylesheet. Without it
   the page flashes and ignores the visitor's saved theme.
2. The **full** navbar, including `.theme-toggle` and `.hamburger`. `script.js`
   queries them without checking they exist, so a missing button throws.
3. Root-relative links (`/styles.css`, `/script.js`, `/#about`). A bare
   `#about` on a sub-page scrolls nowhere.

The long-form pages use layout family 7, the "editorial measure" (section 15 of
`styles.css`): one column at `--measure-long`, separated by rules rather than
cards, with section numbers hanging in the gutter above 1080px.

### Styling
- Colour scheme: Coastal & serene blues (#233775, #45649C, #667DA6) with soft ivory (#F8F5EC)
- Typography: Space Grotesk (display) + Geist (text), both self-hosted variable woff2
- Responsive design with mobile-first approach
- Both light and dark themes are designed explicitly, not derived from each other
- Accessible with ARIA labels, skip navigation and a 2px `:focus-visible` ring

### Content Guidelines
- Write in Australian English (colour, organisation, centre)
- Maintain conversational, approachable tone
- Include personality and humour where appropriate
- Focus on making enterprise software more human

### Testing
Use a local server (`python3 -m http.server 8000`), not `file://`. The clean
URLs under `writing/` and the root-relative asset paths only resolve when the
site is served from a root.

### Instructions
- ALWAYS write headings and content in Australian English, not American.

### Colour Palette
- ■	#F8F5EC
- ■	#233775
- ■	#45649C
- ■	#667DA6
- ■	#0F2C68