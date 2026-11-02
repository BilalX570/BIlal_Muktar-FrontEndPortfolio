# Bilal Muktar — Portfolio

A lightweight, responsive portfolio built with plain HTML, CSS, and JavaScript. No build step or runtime dependencies are required.

## Screenshots

Add current desktop and mobile screenshots here after deployment.

## Run locally

1. Open a terminal in this folder.
2. Start a static file server:

   ```powershell
   py -m http.server 8000
   ```

3. Visit [http://localhost:8000](http://localhost:8000).

You can open `index.html` directly for a quick preview, but a local server better matches deployment behavior.

## Build and checks

There is no compilation step. Serve the folder as static files and check that `index.html`, `style.css`, `script.js`, `data.js`, `favicon.svg`, `robots.txt`, `sitemap.xml`, and `404.html` are deployed together.

## Edit the portfolio

- Update projects, skills, experience, social URLs, role text, or the analytics domain in `data.js`.
- Replace `images/bilu.png` with your preferred photo and `images/coding.jpg` with an image you have permission to publish. Keep the existing filenames, or update their paths in `index.html`.
- Project cards use custom lightweight illustrations until project-specific screenshots are available. Add a screenshot to a project in `data.js` and update its card rendering in `script.js` when ready.
- Add your CV as a downloadable file and update the “Request my CV” link in `index.html` when you want to publish it. Until then, the link opens an email request.
- The contact form opens the visitor's default email app; it does not upload or store messages. A hosted form endpoint can be configured later if you want submissions without an email client.
- Add your LinkedIn profile URL to the `socials` list in `data.js`.
- Add your Telegram profile URL to the `socials` list in `data.js`.
- Set `siteUrl` in `data.js` to your final HTTPS homepage to add canonical and Open Graph URL metadata.
- Set `plausibleDomain` in `data.js` to the exact domain registered with Plausible to enable privacy-friendly analytics. Analytics is off by default.
- Replace `https://YOUR-DOMAIN/` in `sitemap.xml` with your final HTTPS domain before publishing. The same domain should be used in any canonical/Open Graph URL metadata you add.

## Deploy

This is a static site: deploy the project folder as-is; do not run a framework build command.

### Vercel

1. Import the project repository in Vercel.
2. Select **Other** as the framework preset.
3. Leave the build command empty and set the output directory to `.`.
4. Deploy. Add a domain from **Project → Settings → Domains**, then follow the DNS instructions Vercel displays.

### Netlify

1. Import the repository in Netlify or drag the folder into Netlify Drop.
2. Leave the build command empty and set the publish directory to `.`.
3. Deploy. Add a domain under **Domain management** and follow Netlify's DNS instructions.

### GitHub Pages

1. Push the files to a GitHub repository.
2. In **Settings → Pages**, choose the deployment branch and the repository root as the source.
3. Save and wait for the site URL to become available. Add a custom domain under **Settings → Pages → Custom domain**, configure the DNS records GitHub lists, and enable HTTPS when available.

For every host, update `sitemap.xml` to use the final domain and add the domain to Plausible if you enable analytics.

## Before launch

- [ ] Confirm the headshot and coding photo are the ones you want to publish.
- [ ] Add a CV if you want a direct download.
- [ ] Add screenshots for the projects.
- [ ] Add GitHub/demo links for Dilla Integrity Bot, Digital Iqub, and Muktar Metal Work; verify the existing coffee-house demo URL.
- [ ] Add your Telegram and LinkedIn URLs and confirm the email/social links.
- [ ] Add the Ethio Telecom internship dates and any education details you want shown.
- [ ] Replace `YOUR-DOMAIN` in the sitemap after choosing a domain.
- [ ] Set a Plausible domain only if you want analytics enabled.
