# Zanark's portfolio

A static portfolio hosted on GitHub Pages. The current site is a temporary
placeholder; the full portfolio's content and design are still to come.

**Website:** [zanark.github.io](https://zanark.github.io/)

**Repository:** [Zanark/Zanark.github.io](https://github.com/Zanark/Zanark.github.io)

## Project structure

```text
site/
  index.html       Temporary landing page
  404.html         Not-found page
  styles.css       Shared responsive styles
.github/
  workflows/
    pages.yml      Public-site-only deployment
```

The site uses plain HTML and CSS. It has no package dependencies, build step,
JavaScript, external fonts, analytics, or backend.

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
