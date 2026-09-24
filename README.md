# Zanark's portfolio

A static portfolio hosted on GitHub Pages. The current landing page is a small
construction site: **Zanark at work**, bold industrial signage, a crane lifting
a code block, and three hard-hatted workers hammering, signaling, and moving
materials. Blueprint foundations, cones, and striped barriers complete the
scene. The full portfolio is still to come.

**Website:** [zanark.github.io](https://zanark.github.io/)

**Repository:** [Zanark/Zanark.github.io](https://github.com/Zanark/Zanark.github.io)

## Project structure

```text
site/
  index.html       Construction-site landing page
  404.html         Construction detour / not-found page
  palette.css      Canonical dark and adapted light colors
  styles.css       Shared responsive styles
  theme.js         Theme preference and toggle
  favicon.svg      Original hard-hat mark
  theme-LICENSE.txt  Palette attribution and upstream MIT notice
  barlow-condensed-800-latin.woff2  Self-hosted construction-sign type
  font-LICENSE.txt  Font provenance and SIL Open Font License
tests/
  theme.test.cjs   Dependency-free theme behavior tests
  palette.test.cjs Palette contrast and public-page contracts
  construction.test.cjs Font provenance, sign and worker contracts
.github/
  workflows/
    pages.yml      Public-site-only deployment
```

The site uses plain HTML, CSS, original inline SVG illustrations, and a small
theme script. It has no package dependencies, build step, third-party runtime
requests, analytics, audio, or backend. This placeholder does not introduce
the proposed framework for the future portfolio.

## Construction lettering and artwork

The signs use **Barlow Condensed ExtraBold**, an upright, condensed sans-serif,
in uppercase instead of editorial italic lettering. The unmodified Latin
WOFF2 is self-hosted (22,464 bytes), preloaded and displayed with a fallback
while it loads. Visitors do not contact Google Fonts. The font's source,
SHA-256 and complete SIL Open Font License are in `site/font-LICENSE.txt`.
Its sign-inspired character is a design choice, not a regulatory signage claim.

All three workers are original SVG illustrations using the existing theme
palette, hard hats and high-visibility vests. No new palette colors, copied
character artwork, stock images, or animation dependencies were introduced.

## Themes

Dark is the default, regardless of the operating system's theme. The header
switch animates a sunrise when entering light mode and a sunset when returning
to dark mode. Both the homepage and the not-found page share the same switch.

Dark colors preserve the semantic roles of
[DeepSeaFoam](https://github.com/Zanark/DeepSeaFoam), derived from
[Solarized](https://ethanschoonover.com/solarized/). The **Harbor Daylight** light
companion uses warm paper, pale sea-glass panels, deep teal ink, and darker
seafoam interactions. It is a portfolio-specific adaptation, not a canonical
upstream light release. Tokens live in `site/palette.css`; attribution and the
upstream license are retained in `site/theme-LICENSE.txt`.

A visitor's explicit choice is saved only in this site's local storage and
applied before the page paints. Open tabs stay in sync. If browser storage is
blocked or full, switching still works for the current page and a console
warning explains that the preference may not persist.

The switch supports keyboard input and respects reduced-motion preferences.
Without JavaScript the content remains available in dark mode, and the inactive
switch stays hidden.

The sign's hazard tape scrolls smoothly left in a seamless loop. It joins the
crane, warning light and workers in CSS animation. **Pause scene** stops all of
them using a native checkbox, including without JavaScript.
Reduced motion keeps the scene still and removes the unnecessary pause control.
The detour page's tape stays still; browsers without CSS `:has()` retain a static
home-page band rather than showing animation they cannot pause.
No percentage or countdown pretends to measure actual portfolio progress.

Run the theme, palette contrast, and page-contract tests with Node.js 22 or newer:

```powershell
node --test
```

## Local preview

From the repository root, using Python 3:

```powershell
python -m http.server 8000 --bind 127.0.0.1 --directory site
```

Open <http://127.0.0.1:8000>. Stop the server with `Ctrl+C`.

Only `site` is served. Do not start a server from the repository root without
the `--directory site` option.

## GitHub Pages deployment

The [Deploy GitHub Pages workflow](.github/workflows/pages.yml) runs on pushes to
`master` and can also be started manually from the repository's Actions tab.

1. In **Settings > Pages > Build and deployment**, set **Source** to
   **GitHub Actions**.
2. Push the public site changes to `master`.
3. Open the workflow run in **Actions** and follow its deployment link.

The workflow checks the public file allowlist, rejects symbolic/hard links,
uploads **only `site`**, and deploys through the `github-pages` environment.
It uses commit-pinned official GitHub actions. Deployment permissions are limited
to the deploy job; a failed preparation job cannot deploy.

If new public assets are added, update the allowlist in `pages.yml` after
reviewing them. The current allowlist is intentionally small while the site
is a placeholder.

## Content and privacy

Only explicitly reviewed public content belongs in `site`. Local research and
agent context are excluded from Git and must never be copied into site assets,
downloads, archives, HTML comments, or deployment artifacts. Ignore rules alone
are not a publication safeguard.

Before publishing, inspect the staged diff and confirm these commands list no
private files:

```powershell
git diff --cached
git ls-files -- .portfolio-input .agent-context
```

Do not deploy or archive the repository root. The future portfolio and resume
will use separately approved content rather than the private research inputs.
