# Restrate — React

The existing six-page website has been migrated to React. All original page URLs, Swedish content, restaurant information, responsive layouts and browser-local features are retained. No JavaScript is loaded from a CDN: React is installed locally and bundled into the static production assets.

## Development

Use Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Open `/menu.html` for the original menu entry page, or `/index.html` for the restaurant overview.

## Static deployment

```sh
npm run build
npm run preview
```

Deploy the complete `dist/` directory to a static host. All six HTML entrypoints are generated; server-side routing and rewrite rules are not required. Relative asset paths also support subdirectory hosting. Source HTML files require the Vite development server; the built files can be served by any static web server.

## Structure

- `assets/main.js`: React bootstrap.
- `assets/main.jsx`: shared layout, page components, data and React-managed interactions.
- `assets/styles.css`: shared responsive styling and dark theme.
- `vite.config.js`: multi-page static build configuration.

Favorites, theme, consent, ratings and review drafts retain the existing `restrate-*` localStorage keys. Reviews and ratings remain local previews, not server submissions. OpenStreetMap is loaded only after explicit interaction. Images and fonts use the original external image/font services.
