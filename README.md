# Sebastian Tiller - Personal Website

A clean, professional personal website showcasing my experience in technology leadership and enterprise software development. Built with vanilla HTML, CSS, and JavaScript for optimal performance and accessibility.

🔗 **Live Site**: [sebastiantiller.com](https://sebastiantiller.com)

## Features

- **🌓 Dark Mode**: Toggle between light and dark themes with persistent preference storage
- **📱 Fully Responsive**: Optimised for all devices from mobile to desktop
- **♿ Accessible**: WCAG compliant with proper ARIA labels and keyboard navigation
- **⚡ Performance Optimized**: Minimal dependencies, optimized images, and efficient code
- **🔒 Secure**: Implements CSP headers and security best practices
- **🎨 Coastal Theme**: Professional blue color palette inspired by Australian coastal aesthetics
- **✍️ Writing**: Built but NOT launched. Pages exist at `writing/`, unlinked, noindex'd, excluded from the sitemap and disallowed in robots.txt until the "How I work" article is finished.

## Project Structure

```
sebastiantiller/
├── index.html          # Main HTML file
├── styles.css          # All styling (with CSS variables for theming)
├── script.js           # JavaScript for interactivity
├── robots.txt          # Search engine crawl rules
├── sitemap.xml         # XML sitemap
├── .gitignore          # Ignored files (OS cruft, editor folders, logs)
├── writing/            # Long-form writing - BUILT BUT HIDDEN, not yet launched
├── tools/              # Build tools (OG image template), not site pages
│   ├── index.html      # Listing page for posts
│   └── how-i-work/
│       └── index.html  # "How I work" (currently a draft)
├── fonts/              # Self-hosted variable woff2 (CSP sets font-src 'self')
│   ├── space-grotesk-latin[-ext].woff2
│   ├── geist-latin[-ext].woff2
│   └── OFL.txt
├── imgs/               # Images directory
│   ├── Seb.png                       # Profile image (source, 1024x1024)
│   ├── seb-400.png                   # Optimised profile image (fallback)
│   ├── seb-400.webp                  # Optimised profile image (WebP)
│   └── sebastian-tiller-og-banner.png  # Open Graph / social share image
├── docs/               # Documents directory
│   └── Sebastian Tiller - Resume - 2022.pdf
├── CLAUDE.md          # Documentation for AI assistants
└── README.md          # This file
```

## Technology Stack

- **HTML5**: Semantic markup with structured data for SEO
- **CSS3**: Modern CSS with custom properties, Grid, and Flexbox
- **Vanilla JavaScript**: No framework dependencies for maximum performance
- **Self-hosted typography**: Space Grotesk (display) and Geist (text), variable woff2 in `fonts/`. The page CSP sets `font-src 'self'`, so a Google Fonts `<link>` would be blocked silently
- **Progressive enhancement**: scroll reveals are gated on the `js` class that the inline head script adds, so every section, including all five timeline entries, renders with JavaScript disabled

## Color Palette

The website uses a carefully selected coastal-inspired color scheme:

| Color | Hex | Usage |
|-------|-----|-------|
| Soft Ivory | `#F8F5EC` | Light mode background |
| Deep Navy | `#233775` | Primary accent, headings |
| Classic Denim | `#45649C` | Secondary accent, links |
| Dusty Cornflower | `#667DA6` | Tertiary accent |
| Deep Accent | `#0F2C68` | Additional accent (`--accent-light`) |
| Dark Background | `#1a1a1a` | Dark mode background |

## Development

### Prerequisites

- A modern web browser
- A local web server (optional, but recommended for testing)

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sebastiantiller.git
   cd sebastiantiller
   ```

2. Open `index.html` in your browser, or serve it with a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   ```

3. Visit `http://localhost:8000` in your browser

   Serve the site rather than opening `index.html` from the filesystem. The
   `writing/` pages use clean URLs and root-relative asset paths, so they only
   resolve when something is serving the folder as a site root.

### Making Changes

- **Styles**: Edit `styles.css` - uses CSS custom properties for easy theming
- **Content**: Update content in `index.html`
- **Functionality**: Modify `script.js` for interactive features

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Graceful degradation for older browsers

## License

© 1984 Sebastian Tiller. All rights reserved.

---

Built with 💙 for great teams and elegant software solutions.