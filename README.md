# Maison — Home & Lifestyle

A Scandinavian-inspired boutique storefront built with React 19, strict TypeScript, Vite, Tailwind 3 and React Router 7.

## Development

Use Node.js 20.19+ or 22.12+. Run `npm install` and `npm run dev`. Validate with `npm run typecheck` and `npm run build`. Deploy `dist/` with an SPA fallback to `index.html`.

## Structure

- `src/app/`: router and providers; App only composes the router.
- `src/pages/`: home, URL-filtered catalog, product details, about, bag, wishlist, checkout and 404.
- `src/components/`: shared layout, visual sections and accessible UI primitives.
- `src/hooks/useShop.tsx`: React context state persisted to localStorage; cart, wishlist and notifications. No additional runtime dependencies.
- `src/data/catalog.ts`: twelve mock products and public Unsplash images.
- `src/styles/`: CSS variables and serializable Tailwind theme. CSS and IntersectionObserver provide reduced-motion-aware animation.

## Preview limitations

This is a mock storefront with no backend, payment processor or email service. Checkout prepares an email draft locally and clears the cart after a valid form submission; no order is transmitted. All contact addresses use the reserved `.example` domain and must be replaced before launch. Newsletter signup explicitly reports that the newsletter is coming soon; no subscriber data is transmitted. Social imagery is an editorial placeholder, not a live feed. Shipping estimates are $15, complimentary from $150; final shipping and applicable taxes require confirmation. No secrets or environment configuration are used.
