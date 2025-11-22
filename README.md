# eizyGroup — Bias-Free Group Generator (UI only)

Static UI built with plain HTML, CSS, and JavaScript. This branch contains a polished landing page with four full-viewport sections showing browser information, plus a dashboard demo.

Files:

- `index.html` — Landing page (four full-screen sections with SVGs) and login modal.
- `dashboard.html` — Dashboard UI and generator demo.
- `css/styles.css` — Styles including scroll-snap full-page sections and dashboard styles.
- `js/app.js` — UI behaviors and placeholder functions. Populates landing sections with browser info.

Quick test (PowerShell):

```powershell
cd "C:\Users\code\Desktop\group generator app"
python -m http.server 8000;

# Then open http://localhost:8000 in your browser
```

Notes:

- App name changed to `eizyGroup` and an inline SVG icon was added for a cleaner look.
- The landing page sections are full viewport height and use CSS scroll-snap for a clean, modern feel.
- The JS populates the four sections with `navigator` and `screen` data; these are UI-only displays and not sent anywhere.
