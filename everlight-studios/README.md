# EVERLIGHT STUDIOS — Website

A static, responsive photography portfolio (HTML5 + CSS3 + vanilla JavaScript).
No build step, no backend, no dependencies other than the Google Fonts stylesheet
(Playfair Display + Inter; the site falls back to system serif/sans if offline).

## Run it

- **Locally:** double-click `index.html`, or serve the folder (`python3 -m http.server`) and open `http://localhost:8000`.
- **GitHub Pages:** push the folder to a repo → Settings → Pages → deploy from the `main` branch root.
- **Netlify:** drag the `everlight-studios` folder onto app.netlify.com/drop.
- **Vercel:** `vercel` from inside the folder (framework preset: "Other").

## Structure

```
everlight-studios/
├── index.html
├── css/style.css
├── js/script.js
├── images/
│   ├── hero/hero.jpg                 full-screen hero (upscaled + lightly sharpened)
│   ├── about/about.jpg               4:5 crop for the About section
│   ├── featured/featured-cinematic.jpg   wide crop for the Featured project
│   ├── portfolio/                    all 20 gallery photos at full size (1080px)
│   │   └── thumbs/                   720px versions used by the gallery grid
│   ├── logo-mark.png, favicon.png    from the Instagram profile picture
│   └── og-image.jpg                  1200×630 social-sharing preview
└── README.md
```

## Things to check / replace before launch

| What | Where |
|---|---|
| Email, phone, location | `index.html` (Contact section + JSON-LD block in `<head>`) and `CONFIG.email` at the top of `js/script.js`. They were taken from the Instagram bio: `everlightstudio.co@gmail.com`, `+679 9632853`, Korovuto, Nadi. |
| Canonical URL / absolute og:image | Once hosted, add `<link rel="canonical" href="https://your-domain/">` and make the `og:image` / `twitter:image` URLs absolute (social sites ignore relative ones). |
| Service categories | Presented as categories only. No prices or packages are published; edit the four cards in the Services section. |
| Photo titles & alt text | `index.html` gallery list (generated markup, but plain HTML — edit freely). |

## Contact form (static-site note)

A static site has no server to receive form posts, so the form **validates, then opens the
visitor's email app with the enquiry pre-filled** (`mailto:`). It works everywhere but depends
on the visitor having an email app set up (a "Copy our email address" fallback is shown).

For real in-page submission, use a form service, no backend code needed:
1. **Formspree / Basin / Web3Forms:** create a form, then set `<form action="https://formspree.io/f/XXXX" method="POST">` and remove the `submit` listener in `js/script.js` (or replace the `mailto` line with a `fetch()` POST).
2. **Netlify Forms:** add `data-netlify="true" name="enquiry"` to the `<form>` and a hidden `form-name` input.

## Adding more photos

1. Put the full-size JPEG in `images/portfolio/` and a ~720px-wide copy in `images/portfolio/thumbs/` (same filename).
2. Copy any `<li class="g-item" data-cat="…">` block in the gallery and change the `href`, `src`, `srcset`, `width`/`height`, `data-title`, `alt` and `data-cat` (`automotive`, `exterior`, `interior`, `details`, `creative`).
   Keep `width`/`height` equal to the real file size so the layout doesn't jump while images load.

## Image quality note

The supplied Instagram downloads are 1080px on the long edge, which is the maximum Instagram serves.
They look sharp in the gallery and lightbox, but on very large screens the full-screen hero is
upscaled and will look a little soft. For the best result, replace `images/hero/hero.jpg` (and any
featured photo) with the original high-resolution files from the camera: use ~2400px wide, JPEG
quality ~80, and keep the same filenames.

## Features

Transparent → solid sticky nav · mobile hamburger menu · cinematic hero with text animation ·
masonry gallery with category filters, hover zoom + titles · full-screen lightbox (buttons, keyboard
arrows, Esc, swipe, focus trapping) · featured project editorial layout · scroll reveals ·
back-to-top · form validation · lazy-loaded images with `srcset` · SEO title/description,
Open Graph + Twitter tags, JSON-LD · respects `prefers-reduced-motion`.
