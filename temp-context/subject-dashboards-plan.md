# Subject Dashboards — Implementation Plan

Persistent plan for the "subject-dashboards" feature. Each numbered step below is
meant to be done in its own session by someone unfamiliar with this thread — read
the "Decisions" section first, then do exactly one step, then run its
Verification before starting the next. Check off steps as you complete them
(edit this file) so the next session knows where things stand.

## Context

- Repo: Angular 19 app with SSR (`projects/budgetkey/src/server.ts`, Express +
  `CommonEngine`), `prerender: true` in `angular.json`.
- Existing precedent to copy the pattern from: `projects/budgetkey/src/app/about/about-page/`
  fetches a raw `.md` file via `HttpClient` (`responseType: 'text'`), converts it
  with `Showdown`, and renders via `[innerHtml]` + `DomSanitizer.bypassSecurityTrustHtml`.
  Reuse that pattern's shape; don't touch the `about` module itself.
- There is an unrelated existing module also called `dashboards`
  (`projects/budgetkey/src/app/dashboards/`, route `/dashboards`) — a config-driven
  visualization feature. Not related to this work; don't confuse the two.
- Content schema/examples for this feature are in `temp-context/` (this repo, untracked):
  `overview.md`, `hebrew-example.md`, `getting-started.md`, `reports/q1-metrics.md`,
  `reports/tipat-chalav.md`, and `content-file-schema.md` (the schema doc itself —
  not a content sample, has no frontmatter). Note: `content-file-schema.md` and
  `getting-started.md` describe a *different* reference implementation (mentions
  a `server/` + React app, `main_agent/`) — that's just where the schema was
  authored, not this repo's stack. Ignore its tech-stack mentions; only the
  frontmatter/body **schema rules** in `content-file-schema.md` apply here.

## Decisions (already made — don't re-litigate)

1. **Content delivery**: content is baked into the Angular build as static assets,
   same as the `about` module. The cronjob/pipeline commits `.md` files into
   `projects/budgetkey/src/assets/subject-dashboards/`, and a normal rebuild+redeploy
   picks up changes. No server-side directory reads, no Docker volume, no new
   Express routes.
2. **Content index**: generated at build time by a small script in this repo (not
   by the content pipeline). It walks `assets/subject-dashboards/`, reads each
   file's frontmatter, and writes `assets/subject-dashboards/index.json`. The app
   only ever fetches that one JSON file — it never lists a directory at runtime.
3. **Home page UX**: `/subject-dashboards` renders a **nested list mirroring the
   directory structure** (folders as grouping labels, files as links using their
   `title`) — not a flat list, not a search box.
4. **Naming**: plural throughout — route `/subject-dashboards`, module
   `SubjectDashboardsModule`, folder `subject-dashboards`, asset dir
   `assets/subject-dashboards/`.
5. **Detail routing**: `/subject-dashboards/<slug>` where `<slug>` is the file's
   path under `assets/subject-dashboards/` minus `.md`, and can be multiple
   segments deep (e.g. `/subject-dashboards/reports/tipat-chalav`). Needs a
   wildcard (`**`) route, not a single `:param`.
6. **Prerendering**: don't fight Angular's static `prerender` enumeration for this
   feature. Confirm in step 9 whether the lazy module's wildcard route breaks
   `ng build`'s prerender step; if it does, exclude these routes from prerender
   and let the existing SSR path (`server.ts` / `CommonEngine`) render them
   per-request — that already works for any route and doesn't need new code.
7. **Security**: unlike `about` page content (hand-authored by the dev team), this
   content is LLM/automation-generated on a schedule. Sanitize the Showdown output
   with DOMPurify before `bypassSecurityTrustHtml` (new dependency) — defense in
   depth, since `about` page's existing "trust it raw" approach isn't appropriate
   for automation-generated content.

## Directory/file layout this plan produces

```
projects/budgetkey/src/assets/subject-dashboards/
  overview.md
  getting-started.md
  hebrew-example.md
  reports/
    q1-metrics.md
    tipat-chalav.md
  index.json              <- generated, gitignored, not hand-edited

projects/budgetkey/scripts/
  generate-subject-dashboards-index.js   <- Node script, run before `ng build`

projects/budgetkey/src/app/subject-dashboards/
  subject-dashboards.module.ts
  subject-dashboards-routing.module.ts
  subject-dashboards-home/
    subject-dashboards-home.component.{ts,html,less}
  subject-dashboard-page/
    subject-dashboard-page.component.{ts,html,less}
```

---

## Step 1 — Fixtures + asset directory scaffolding [DONE]

- Create `projects/budgetkey/src/assets/subject-dashboards/`.
- Copy these files from `temp-context/` into it, preserving relative paths:
  `overview.md`, `getting-started.md`, `hebrew-example.md`,
  `reports/q1-metrics.md`, `reports/tipat-chalav.md`.
  (Do **not** copy `content-file-schema.md` — it's schema documentation, not a
  dashboard file; it has no frontmatter and would fail to parse.)
- Add `projects/budgetkey/src/assets/subject-dashboards/index.json` to `.gitignore`
  (it's a generated build artifact, step 2 produces it).

**Verification**: the 5 files exist under the new path with identical content to
`temp-context/`. `git status` shows the new files as untracked (or staged, per
your workflow) and `index.json` is ignored once step 2 generates it.

## Step 2 — Build-time index generator [DONE]

- Write `projects/budgetkey/scripts/generate-subject-dashboards-index.js`
  (plain Node/CommonJS — `package.json` has no `"type": "module"`, so this
  matches the rest of the repo's tooling scripts).
- It should:
  - Recursively walk `projects/budgetkey/src/assets/subject-dashboards/**/*.md`.
  - For each file, extract the frontmatter block (`---\n...\n---`) with a small
    regex-based parser — the schema only has 5 flat scalar fields
    (`title`, `created`, `updated`, `model`, `path`), so a full YAML parser is
    unnecessary. Normalize `created`/`updated` to `YYYY-MM-DD` strings (strip
    surrounding quotes if present).
  - Compute `slug` = the file's path relative to `assets/subject-dashboards/`,
    with `.md` stripped and backslashes normalized to `/` (matters on Windows).
  - Skip any file that fails to parse required frontmatter fields (log a
    warning to stdout, don't crash the build).
  - Write a JSON array of `{ slug, title, created, updated, model, path }` to
    `assets/subject-dashboards/index.json`.
- Wire it into the build: add an npm script
  `"generate:subject-dashboards-index": "node projects/budgetkey/scripts/generate-subject-dashboards-index.js"`,
  and prefix it onto `build`, `build-dev`, and `watch` in `package.json`
  (e.g. `"build": "npm run generate:subject-dashboards-index && ng build"`).

**Verification**: run
`node projects/budgetkey/scripts/generate-subject-dashboards-index.js` manually.
Inspect the generated `index.json`: 5 entries, slugs are
`overview`, `getting-started`, `hebrew-example`, `reports/q1-metrics`,
`reports/tipat-chalav`, Hebrew `title` values are intact UTF-8 (not mangled/escaped
oddly), `updated >= created` for all entries.

## Step 3 — Angular module + routing scaffolding

- Generate `SubjectDashboardsModule` under
  `projects/budgetkey/src/app/subject-dashboards/`, lazy-loaded, following the
  exact pattern of `about.module.ts` / `about-routing.module.ts` (imports
  `CommonModule`, `CommonComponentsModule`; provides `provideHttpClient(withInterceptorsFromDi())`
  if it does its own HTTP calls, matching `about.module.ts`).
- Add to `app-routing.module.ts`:
  `{ path: 'subject-dashboards', loadChildren: () => import('./subject-dashboards/subject-dashboards.module').then(m => m.SubjectDashboardsModule) }`.
- Internal routes in `subject-dashboards-routing.module.ts`:
  - `{ path: '', component: SubjectDashboardsHomeComponent }`
  - `{ path: '**', component: SubjectDashboardPageComponent }`
- Both components can be empty placeholders for this step (just render a string).

**Verification**: `ng serve`, navigate to `/subject-dashboards` (renders home
placeholder) and `/subject-dashboards/reports/tipat-chalav` (renders detail
placeholder, does **not** 404). Confirm `/dashboards` (the other, unrelated
existing feature) still works unchanged.

## Step 4 — Home page: nested tree from index.json

- `SubjectDashboardsHomeComponent` fetches `assets/subject-dashboards/index.json`
  via `HttpClient` (same `ps.BASE + '/assets/...'` pattern as `about-page.component.ts`
  uses via `PlatformService`).
- Build a nested tree in the component from the flat `{slug, title, ...}[]` list,
  splitting each `slug` on `/`: intermediate segments become folder nodes
  (label = the raw segment name), the last segment is a leaf node (label =
  `title`, links to `/subject-dashboards/<slug>`).
- Render the tree as nested `<ul>/<li>` (a small recursive component, or a
  recursive `ng-template`, is fine — keep it minimal, no accordion/collapse
  behavior needed).

**Verification**: `/subject-dashboards` shows `overview`, `getting-started`,
`hebrew-example` at the top level and a `reports` folder label containing
`q1-metrics` and `tipat-chalav` as children (using their `title` frontmatter
values as link text, in Hebrew for `tipat-chalav`). Clicking a leaf navigates to
`/subject-dashboards/<slug>`.

## Step 5 — Detail page: fetch, parse, render

- `SubjectDashboardPageComponent` reads the full wildcard path from
  `ActivatedRoute` (join the matched URL segments) to reconstruct the slug, then
  fetches `assets/subject-dashboards/<slug>.md` as raw text.
- Split frontmatter from body (small local parser — duplicating step 2's regex
  logic here is fine and preferred: it's ~10 lines, and sharing it between a
  Node build script and Angular app code isn't worth the wiring).
- Render frontmatter fields (`title`, `created`, `updated`, `model`, `path`) in a
  simple header, then convert the body with `Showdown` (same converter options as
  `about-page.component.ts`) and render via
  `DomSanitizer.bypassSecurityTrustHtml` + `[innerHtml]`.
- If the fetch 404s (bad slug), show a simple "not found" state — don't crash.

**Verification**: visit all 5 fixture slugs. Confirm: title/metadata header shows
correct values; tables and lists render; `hebrew-example` and `tipat-chalav`
display RTL correctly (wrap the content container with `dir="auto"`); the
` ```bash ` code block in `hebrew-example.md` stays LTR even inside RTL content;
an invalid slug (e.g. `/subject-dashboards/does-not-exist`) shows a not-found
state instead of a broken page.

## Step 6 — Mermaid rendering

- Add `mermaid` as a dependency.
- After Showdown renders (Showdown turns ` ```mermaid ` fences into
  `<pre><code class="language-mermaid">...</code></pre>`, HTML-escaped), find
  those blocks in the rendered container (`AfterViewInit`, browser-only — guard
  with the existing `PlatformService` browser check, same as other components
  that need `isPlatformBrowser`), decode the escaped text back to the raw Mermaid
  source, and call `mermaid.render(...)` (`securityLevel: 'strict'`, per the
  schema doc) to get an SVG string, then replace the block's content with it.
- Must be a no-op (not throw) during SSR/prerender, where there's no DOM for
  Mermaid to measure text into.

**Verification**: `overview.md` and `hebrew-example.md`'s flowcharts, and
`q1-metrics.md`/`tipat-chalav.md`'s pie charts, render as actual SVG diagrams in
the browser (not raw text/code). `npm run build` (full production build,
including prerender) still completes without throwing from the Mermaid code path.

## Step 7 — Internal link rewriting + SPA navigation

- Content links to other dashboards as relative `.md` links resolved against the
  **current file's directory** (e.g. `q1-metrics.md` links to `../overview.md`).
  After render, rewrite anchors whose `href` resolves (relative to the current
  slug's directory) to another file under `assets/subject-dashboards/` into the
  matching `/subject-dashboards/<slug>` app route.
- Intercept clicks on those rewritten anchors (a click listener on the rendered
  container) and navigate via Angular `Router` instead of a full page reload.
  Leave `http(s)://` / `mailto:` links completely alone — they should keep
  opening in a new tab (already the case via Showdown's
  `openLinksInNewWindow: true`); explicitly ensure `rel="noopener noreferrer"`
  is present on those (per this repo's security rules — `target="_blank"`
  without `rel` is a known issue).
- Per the schema doc: never resolve/rewrite a link that would escape
  `assets/subject-dashboards/` — leave it as a normal (broken) link rather than
  guessing.

**Verification**: on `q1-metrics.md`, click "product overview" and "getting
started guide" — both navigate client-side (check Network tab: no full HTML
document reload) to the right page. On `overview.md`, confirm the external
"Vite docs" link opens in a new tab and has `rel="noopener noreferrer"`. On
`tipat-chalav.md`, confirm the "Sources" links (external `next.obudget.org`
links) are untouched and open normally.

## Step 8 — Security & sanitization pass

- Add `DOMPurify` (`isomorphic-dompurify` for SSR compatibility) and sanitize the
  Showdown-produced HTML string before `bypassSecurityTrustHtml`, in both the
  home page (if it ever renders any content-derived HTML) and the detail page.
- Confirm Mermaid's `securityLevel: 'strict'` is actually set (blocks
  `click`/script bindings in diagrams, per the schema doc).
- Re-check step 7's link handling still works after sanitization (DOMPurify must
  not strip the rewritten `href`/data attributes your click handler depends on).

**Verification**: run the `security-reviewer` agent against the new
`subject-dashboards` module. No CRITICAL/HIGH findings. Manually confirm all 5
fixture pages still render identically to step 7 (sanitization didn't silently
drop legitimate content).

## Step 9 — Full regression + prerender check

- Run a full production build (`npm run build`). If Angular's prerender step
  fails or errors on the new lazy wildcard route (unknown route depth at build
  time), configure that route to skip static prerendering (per-route
  `renderMode` in the server routing config) and rely on the existing SSR path
  instead — don't spend effort making wildcard-depth routes enumerable for
  prerendering.
- Boot the SSR server (`npm run serve:ssr:budgetkey`) and confirm
  `/subject-dashboards` and `/subject-dashboards/reports/tipat-chalav` serve
  correctly server-rendered (view source should contain real content, not an
  empty shell).
- Spot-check that unrelated existing routes/features (`/`, `/about`,
  `/dashboards`, `/s`, `/i`) still work — this feature should be additive only.

**Verification**: `npm run build` exits 0. SSR server serves both new routes
with real server-rendered HTML. No regressions on the spot-checked existing
routes.
