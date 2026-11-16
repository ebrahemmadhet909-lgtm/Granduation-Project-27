# ServiX front-end (Tailwind CSS)

25 static pages — open `index.html` (or serve the folder with any static server).

- Styling: Tailwind utility classes in the HTML/JS. Design tokens (colors, shadow, font) live in `tailwind.config.js`.
- `css/tailwind.css` is the compiled stylesheet that the pages load (no CDN needed).
- To rebuild after changing classes:
  ```
  npm install
  npm run build:css      # or: npm run watch:css
  ```
- JS: `js/data.js` (demo data), `layout.js` (sidebar/topbar), `render.js` (tables/cards/charts), `ui.js` (toast, modal, filters), `pages.js` (page logic).
# Granduation-Project-27
