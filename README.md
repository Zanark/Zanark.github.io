# Zanark Signal

An unpublished, local-first portfolio concept for Debashish Mishra. The entire
experience lives inside a stylized CRT television: original pixel artwork,
DeepSeaFoam phosphor colors, channel navigation, tangible display controls, and
real engineering stories.

**Publication is on hold. Do not commit, push, deploy, release, or upload this
preview without the owner's explicit request.** The existing public construction
page and `underConstruction` backup branch have not been changed by this work.

## Run locally

Use Node.js 24 LTS and npm.

```powershell
npm ci
npm test
npm run build
npm run preview -- --port 4321
```

Open **http://127.0.0.1:4321/**. The preview binds to loopback and serves the built
`dist` output, never the repository or private research root. Stop a foreground
server with `Ctrl+C`. For source development, `npm run dev` also binds to loopback;
use the built preview when sharing a screen or reviewing the finished experience.

## Explore

- Six channels: Signal, Work, Play, Story, Lab, and Contact.
- Four generalized engineering stories and six independent-project detail pages.
- An original midnight-workshop illustration and three project pixel illustrations.
- Channel buttons and `1` through `6` keyboard shortcuts.
- CRT-effects toggle, motion toggle, dark/light display, and a reversible standby button.
- A keyboard-accessible pixel sketchpad with local PNG export.
- A clearly synthetic evidence-readiness experiment, never connected to real systems.
- A newly written readable/printable profile, not a private dossier download.
- Real static routes, a themed 404 and a colophon with attribution/research links.

The interface has no autoplay audio, webcam requests, analytics, external embeds
or visitor-time font service calls. Fonts and art are local. Reduced motion
disables decorative animation, and ordinary navigation/content remain available
without JavaScript. CRT treatment is an artistic approximation, not a claim of
physical display accuracy or universal accessibility certification.

## Architecture

```text
src/
  components/     Small Astro UI building blocks and local lab
  data/           Curated local-review content, separate from rendering
  layouts/        Shared television shell
  lib/            Pure interaction logic
  pages/          Static home, profile, project and work routes
  scripts/        Typed display controls and browser-only experiments
  styles/         CRT treatment, layout and semantic palette
public/
  art/            Original self-contained pixel SVGs
  fonts/          Licensed self-hosted Latin WOFF2 assets
  licenses/       Font, theme and animation-library notices
checks/           Dependency-free Node behavior/source checks
scripts/          Built-output privacy and internal-link gate
dist/             Generated local preview only; ignored by Git
```

Astro 7 and TypeScript generate the static pages. GSAP provides restrained
entrance animation; CSS handles the glass, mask and scan beam. React and WebGL
were not added because these interactions do not need them. Dependencies are
locked in `package-lock.json`; TypeScript 6 is used because the installed Astro
checker does not accept TypeScript 7.

The old `site` and `tests` deletions were deliberate user changes and remain
deleted. The previous construction version is preserved in its Git history and
backup branch, not restored into this implementation.

## Content and privacy

This is an **editorial preview**, not approved public copy. The private research
pack was read across all 162 files, including all 358 pages of the 13 PDFs.
The three overlapping dossiers were read independently rather than counted as
separate corroboration. The source corrections take precedence over older
generated resume language.

Browser content is newly authored and generalized. There are no raw source
records, private PDFs, employer resource identifiers, customer names, personal
contact fields, claimed certifications, fabricated impact counters or copied
review quotations. Public source links that could not be confirmed were omitted.
The interactive lab and artwork are original illustrations, not product
screenshots, production simulations, or hidden connections to external services.

`.portfolio-input`, `.agent-context`, dependencies, build caches and local
artifacts stay ignored. The build never imports the private inputs. The output
gate rejects private-source markers, hidden/linked files, unexpected formats,
source maps and broken local links. Passing that gate does not grant disclosure
or publication approval.

The local workflow is **manual validation only** and has no publishing job,
artifact upload or Pages-write permission. This edit has not changed the workflow
on GitHub because nothing has been pushed.

## Visual foundations and rights

DeepSeaFoam is derived from Ethan Schoonover's Solarized. Its dark semantic roles
remain the primary reference. Harbor Daylight is the previously documented
portfolio-specific companion, not a new upstream release. CRT-case material
uses existing DeepSeaFoam preview neutrals as decorative hardware colors.

Pixelify Sans and IBM Plex Mono are distributed under their included SIL Open
Font Licenses. GSAP retains its own license and notices. Original pixel scenes
were created for this concept; no game sprites, third-party portraits, supplied
showcase music or rights-uncertain media are reused.

Research links and the distinction between the CRT approximation and real
historical displays are included in the `/colophon/` page.
