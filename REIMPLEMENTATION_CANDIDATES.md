# Candidates to reimplement vs `z-archive/better-stack`

This note compares **this repo** (`forge-site/public/...`) to a full localhost snapshot at  
`/Users/aeells/projects/z-archive/better-stack/BetterStack_files/`.

**Method:** For every file that exists in both trees under the **same basename**, SHA-256 was compared.

- **32 files** are **byte-identical** to the archived Better Stack asset (same build artifact).
- **4 files** share the same basename but **differ** (likely edited locally while still clearly originating from the same upstream bundle).
- **`main.css`** is not the same filename as in the archive (`betterstack_v2-aea2cff5.css`), but both are **Tailwind CSS v4.0.9** compiled output from the same generation of the site; the Forge copy is **smaller** (purged). Treat as **derived from the same stylesheet pipeline**, not independent work.

Reinstalling standard vendor libraries from official packages is usually enough for **MIT-licensed third-party** files; **reimplementation** matters most for **site-specific** JS and for **visual assets** you want to clearly distinguish.

---

## 1. Byte-identical to archive (same file as snapshot)

These hashes match the archived file with the same name.

### Site-specific / glue JavaScript (highest priority to replace or rewrite)

| Path | Capability |
|------|------------|
| `public/assets/js/site/menu-aae23c36.js` | Mobile menu open/close, click-outside to close, resize handling; `turbo:load` re-bind; desktop menu helpers (`aria-haspopup` / `role="menu"`) and optional hover “safe triangle” for a platform dropdown. |
| `public/assets/js/common/railsSetup-6f180b29.js` | Turbo Rails: tweaks `Accept` for non-stream responses; `popstate` workaround to reload first history entry. |
| `public/assets/js/common/aos-f5c6bb9a.js` | Initializes AOS (animate-on-scroll), refreshes on Turbo navigations and image loads. |
| `public/assets/js/common/lazy-3f5ba6f1.js` | Lazysizes hook: sets `backgroundImage` from `data-bg` on `lazybeforeunveil`. |
| `public/assets/js/common/site_settings_bootstrap-c104a0e6.js` | Cookie consent bootstrap: reads cookie, auto-grants for non-EU via `fetchCountryData` (in Forge: stubbed), dispatches `cookie-consent-granted` custom events; runs on load and `turbo:load`. |
| `public/assets/js/common_controllers/carousel_controller-6effa5a6.js` | Stimulus controller: horizontal snap carousel, prev/next, gradient buttons, drag-to-scroll. |
| `public/assets/js/common_controllers/index-48f61257.js` | Stimulus app entry: `eagerLoadControllersFrom('common_controllers', ...)`. |

### Third-party / vendor (reinstalled from npm + official `stimulus-rails` tag)

Synced into `public/assets/js/vendor/` via `npm run vendor:sync` (see `scripts/sync-vendor-js.mjs`). Stable filenames:

| Path | Capability |
|------|------------|
| `public/assets/js/vendor/turbo-rails.js` | Hotwired Turbo (Rails bundle, `@hotwired/turbo-rails`). |
| `public/assets/js/vendor/stimulus.js` | Stimulus (`@hotwired/stimulus`). |
| `public/assets/js/vendor/stimulus-loading.js` | Eager/lazy Stimulus controllers (`hotwired/stimulus-rails` v1.3.4 `stimulus-loading.js`). |
| `public/assets/js/vendor/aos.js` | AOS (`aos`). |
| `public/assets/js/vendor/lazysizes.min.js` | Lazysizes. |
| `public/assets/js/vendor/es-module-shims.js` | Import map / ES module shims (`es-module-shims`). |

### Icons (Heroicons-derived SVGs)

| Path | Capability |
|------|------------|
| `public/assets/icons/heroicons_v2/outline/bars-3-4a440a20.svg` | Menu (hamburger) icon. |
| `public/assets/icons/heroicons_v2/outline/x-mark-1a7d1e94.svg` | Close icon. |
| `public/assets/icons/heroicons_v2/mini/chevron-left-cb239563.svg` | Carousel chevron left. |
| `public/assets/icons/heroicons_v2/mini/chevron-right-03b53609.svg` | Carousel chevron right. |
| `public/assets/icons/heroicons_v2/outline/chevron-right-46102eb0.svg` | Chevron right (outline). |

### Images & illustration assets

| Path | Capability |
|------|------------|
| `public/assets/images/brand/crossed-hammers.png` | Brand / decorative image. |
| `public/assets/images/homepage/customers-6feb4e86.svg` | Customer strip / logos treatment (if used). |
| `public/assets/images/backgrounds/flare-8e4033ba.png` | Background flare art. |
| `public/assets/images/homepage/flare-sm-e5829b13.png` | Smaller flare variant. |
| `public/assets/images/backgrounds/hero-bg-9b9a659a.jpg` | Hero background image. |
| `public/assets/images/brand/status-page-53c30561.jpg` | Marketing / carousel imagery. |
| `public/assets/images/homepage/hero-carousel/status-page-sm-98ab852e.jpg` | Responsive carousel image. |
| `public/assets/images/social/github-8e0718fe.svg` | GitHub social icon. |
| `public/assets/images/social/instagram-d9614e51.svg` | Instagram social icon. |
| `public/assets/images/social/linkedin-143ab64c.svg` | LinkedIn social icon. |
| `public/assets/images/social/status-green-4e79760e.svg` | Status indicator icon. |

### Fonts

| Path | Capability |
|------|------------|
| `public/assets/fonts/Helvetica/HelveticaNowDisplay-Bold.woff2` | Display Bold. |
| `public/assets/fonts/Helvetica/HelveticaNowDisplay-Medium.woff2` | Display Medium. |
| `public/assets/fonts/Helvetica/HelveticaNowText-Bold.woff2` | Text Bold. |
| `public/assets/fonts/Helvetica/HelveticaNowText-Medium.woff2` | Text Medium. |
| `public/assets/fonts/Helvetica/HelveticaNowText-Regular.woff2` | Text Regular. |

*(Helvetica files may require their own licensing check independent of this repo.)*

---

## 2. Same basename as archive but content differs (edited fork)

| Path | Capability | Note |
|------|------------|------|
| `public/assets/js/common/site_settings_panel-812b3a51.js` | Cookie banner UI: show/hide, buttons, cookies, events. | Likely edited (e.g. copy, `console.log`, stub behavior). |
| `public/assets/images/brand/favicon.png` | Favicon. | Replace with a Forge-specific asset if desired. |

---

## 3. Stylesheet: derived pipeline, different filename

| Forge path | Archive counterpart | Capability |
|------------|----------------------|------------|
| `public/assets/css/main.css` | `BetterStack_files/betterstack_v2-aea2cff5.css` (not basename-equal) | Full Tailwind v4 CSS output for the marketing site. Forge file is **purged** and shorter; same generator family. **Re-theme or rebuild from your own Tailwind config** to differentiate. |

---

## 4. Not compared by basename (still worth knowing)

- **`public/index.html`** is customized for Forge and is not expected to match `BetterStack.html` byte-for-byte.
- Scripts only in **Forge** (e.g. `layout-shell.js`, `formspree.js`, `pricing.js`, `homepage-imports.js`) have **no** namesake in the archive snapshot and are not listed above.

---

## 5. Suggested priority for “lower downstream risk”

1. **Rewrite or replace** `site/menu-*.js`, `railsSetup-*.js`, and cookie modules with **your own** minimal implementations (or delete unused branches).
2. **Replace** raster/SVG marketing assets and **font** choices with assets you have clear rights to use.
3. **Rebuild CSS** from a clean Tailwind config and your own design tokens (keep `main.css` as generated output, not hand-edited upstream paste).
4. **Vendor JS**: keep versions pinned from official `@hotwired/*`, `turbo`, `aos`, `lazysizes`, `es-module-shims` releases rather than copying files out of an old snapshot.

---

*Generated for internal tracking; confirm GitHub Pages publish settings if this file should stay private.*
