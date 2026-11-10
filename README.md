# Two Fold Destiny

Responsive wedding design studio website. Plain HTML, CSS, and JavaScript; no dependencies or build step.

Run `npm run dev` from this directory and open http://127.0.0.1:3000. Run `npm run check` to validate JavaScript syntax.

## Content and media

All 21 supplied projects are in `dist/projects.json`. Edit titles, categories, and descriptions there. The hero, detail section, and project tiles intentionally use architectural CSS placeholders. Replace `.hero-scene` and `.philosophy-art` contents with real images when supplied. Project tiles are created in `dist/app.js`; add image paths to the project data and render corresponding image elements there. Set meaningful alt text, image dimensions, and lazy loading for images below the fold. Replace the text wordmark with the approved logo when supplied.

## Enquiries

The form prepares a WhatsApp message for the supplied business number. Visitors review and send it in WhatsApp. No form data is stored and there is no email delivery backend. Direct email and Instagram links are also available.
