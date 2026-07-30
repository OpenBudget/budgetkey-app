import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import mermaid from 'mermaid';
import { catchError, of, switchMap, timer } from 'rxjs';
import * as Showdown from 'showdown';

import { PlatformService } from '../../common-components/platform.service';
import { PlotlyService } from '../../charts/chart-plotly/plotly.service';

// Matches the app's design tokens in `common.less` (`@color-fill-lead`,
// `@color-tertiary-700`, `@color-gray-*`) so diagrams look like part of the
// product rather than mermaid's stock teal theme.
let mermaidInitialized = false;
function ensureMermaidInitialized(): void {
  if (mermaidInitialized) {
    return;
  }
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: 'base',
    themeVariables: {
      primaryColor: '#FFE3E4',
      primaryTextColor: '#332A2A',
      primaryBorderColor: '#FF5A5F',
      secondaryColor: '#E3F3FF',
      secondaryBorderColor: '#6D82B4',
      tertiaryColor: '#F7FAFC',
      lineColor: '#6D82B4',
      textColor: '#332A2A',
      mainBkg: '#FFE3E4',
      nodeBorder: '#FF5A5F',
      clusterBkg: '#E3F3FF',
      clusterBorder: '#9CD3FE',
      titleColor: '#3C4B7C',
      edgeLabelBackground: '#FFFFFF',
      fontSize: '16px',
      pie1: '#FF5A5F',
      pie2: '#6D82B4',
      pie3: '#9CD3FE',
      pie4: '#495A8F',
      pie5: '#CCC3C3',
      pie6: '#3C4B7C',
      pieOpacity: '0.9',
      pieOuterStrokeColor: '#FFFFFF',
      pieSectionTextColor: '#332A2A',
      // xychart-beta ignores primaryColor/mainBkg for its bars and background —
      // it only reads themeVariables.xyChart. Without this override it falls
      // back to mermaid's own pastel defaults (cream/salmon bars on a light-gray
      // plot area), which read as washed-out against the white card background.
      xyChart: {
        backgroundColor: '#FFFFFF',
        titleColor: '#332A2A',
        xAxisLabelColor: '#332A2A',
        xAxisTitleColor: '#332A2A',
        xAxisTickColor: '#665859',
        xAxisLineColor: '#665859',
        yAxisLabelColor: '#332A2A',
        yAxisTitleColor: '#332A2A',
        yAxisTickColor: '#665859',
        yAxisLineColor: '#665859',
        plotColorPalette: '#FF5A5F,#6D82B4,#3C4B7C,#9CD3FE,#495A8F,#CCC3C3',
      },
    },
  });
  mermaidInitialized = true;
}

let mermaidDiagramCounter = 0;

/**
 * Ensures a Showdown-generated `target="_blank"` anchor also carries
 * `rel="noopener noreferrer"` (browsers don't add this automatically, and
 * `window.opener` access from the new tab is a reverse-tabnabbing risk).
 */
Showdown.extension('safeExternalLinks', () => [
  {
    type: 'output',
    regex: /<a ([^>]*target="_blank"[^>]*)>/g,
    replace: (match: string, attrs: string) => (/\brel=/.test(attrs) ? match : `<a ${attrs} rel="noopener noreferrer">`),
  },
]);

/** Rejects any slug containing empty, `.`, or `..` path segments. */
function isValidSlug(slug: string): boolean {
  return slug.length > 0 && slug.split('/').every((segment) => segment !== '' && segment !== '.' && segment !== '..');
}

interface SubjectDashboardMeta {
  title: string;
  created: string;
  updated: string;
  model: string;
  path: string;
}

interface ParsedDashboardFile {
  meta: SubjectDashboardMeta;
  body: string;
}

const REQUIRED_META_FIELDS: (keyof SubjectDashboardMeta)[] = ['title', 'created', 'updated', 'model', 'path'];

function parseFrontmatter(content: string): ParsedDashboardFile | null {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return null;
  }

  const frontmatter: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const fieldMatch = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (!fieldMatch) {
      continue;
    }
    const [, key, rawValue] = fieldMatch;
    frontmatter[key] = rawValue.trim().replace(/^["'](.*)["']$/, '$1');
  }

  if (REQUIRED_META_FIELDS.some((field) => !frontmatter[field])) {
    return null;
  }

  return {
    meta: frontmatter as unknown as SubjectDashboardMeta,
    body: match[2],
  };
}

/**
 * Resolves a Markdown link's raw `href` against the directory of `currentSlug`,
 * the same way a filesystem would resolve a relative path. Returns the target
 * slug (no `.md` suffix) or `null` if the link isn't an internal `.md` link,
 * or if resolving `..` segments would escape the `subject-dashboards` root.
 */
function resolveRelativeMdLink(currentSlug: string, href: string | null): string | null {
  // Reject any URI with a scheme component (`javascript:`, `mailto:`, `data:`, ...)
  // and any protocol-relative (`//host/...`) or absolute (`/...`) reference —
  // only plain relative paths within the subject-dashboards tree are resolved.
  if (!href || !href.endsWith('.md') || /^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//') || href.startsWith('/')) {
    return null;
  }

  const currentDir = currentSlug.includes('/') ? currentSlug.slice(0, currentSlug.lastIndexOf('/')) : '';
  const combinedParts = (currentDir ? `${currentDir}/${href}` : href).split('/');

  const resolvedParts: string[] = [];
  for (const part of combinedParts) {
    if (part === '' || part === '.') {
      continue;
    }
    if (part === '..') {
      if (resolvedParts.length === 0) {
        return null;
      }
      resolvedParts.pop();
    } else {
      resolvedParts.push(part);
    }
  }

  if (resolvedParts.length === 0) {
    return null;
  }

  return resolvedParts.join('/').replace(/\.md$/, '');
}

@Component({
    selector: 'app-subject-dashboard-page',
    templateUrl: './subject-dashboard-page.component.html',
    styleUrls: ['./subject-dashboard-page.component.less'],
    standalone: false
})
export class SubjectDashboardPageComponent {
  converter: Showdown.Converter;
  meta: SubjectDashboardMeta | null = null;
  html: SafeHtml | null = null;
  notFound = false;

  private currentSlug = '';
  private readonly spaLinkAnchors = new WeakSet<HTMLAnchorElement>();

  @ViewChild('mdContainer') mdContainer?: ElementRef<HTMLDivElement>;

  constructor(
    private http: HttpClient,
    private domSanitizer: DomSanitizer,
    private ps: PlatformService,
    private route: ActivatedRoute,
    private router: Router,
    private plotly: PlotlyService
  ) {
    this.converter = new Showdown.Converter({
      extensions: ['safeExternalLinks'],
      tables: true,
      customizedHeaderId: true,
      openLinksInNewWindow: true,
    });

    this.route.url.pipe(
      switchMap((segments: UrlSegment[]) => {
        const slug = segments.map((segment) => segment.path).join('/');
        if (!isValidSlug(slug)) {
          return of(null);
        }
        this.currentSlug = slug;
        return this.http.get(this.ps.BASE + `/assets/subject-dashboards/${slug}.md`, { responseType: 'text' }).pipe(
          catchError(() => of(null))
        );
      })
    ).subscribe((text) => {
      const parsed = text === null ? null : parseFrontmatter(text);
      if (!parsed) {
        this.notFound = true;
        return;
      }
      this.meta = parsed.meta;
      this.html = this.domSanitizer.bypassSecurityTrustHtml(this.converter.makeHtml(parsed.body));
      this.ps.browser(() => {
        timer(0).subscribe(() => {
          this.renderMermaidDiagrams();
          this.renderPlotlyCharts();
          this.rewriteInternalLinks();
        });
      });
    });
  }

  onContentClick(event: MouseEvent): void {
    const anchor = (event.target as HTMLElement).closest('a');
    const href = anchor?.getAttribute('href');
    // Only anchors this component itself rewrote (tracked by identity, not a
    // DOM attribute the markdown source could forge) trigger SPA navigation.
    if (!anchor || !href || !this.spaLinkAnchors.has(anchor)) {
      return;
    }
    event.preventDefault();
    this.router.navigateByUrl(href);
  }

  private rewriteInternalLinks(): void {
    const container = this.mdContainer?.nativeElement;
    if (!container) {
      return;
    }
    const anchors = Array.from(container.querySelectorAll<HTMLAnchorElement>('a[href]'));
    anchors.forEach((anchor) => {
      const resolvedSlug = resolveRelativeMdLink(this.currentSlug, anchor.getAttribute('href'));
      if (resolvedSlug === null) {
        return;
      }
      anchor.setAttribute('href', `/subject-dashboards/${resolvedSlug}`);
      anchor.removeAttribute('target');
      anchor.removeAttribute('rel');
      this.spaLinkAnchors.add(anchor);
    });
  }

  private renderMermaidDiagrams(): void {
    const container = this.mdContainer?.nativeElement;
    if (!container) {
      return;
    }
    const codeBlocks = Array.from(container.querySelectorAll('pre > code.language-mermaid'));
    if (codeBlocks.length === 0) {
      return;
    }
    ensureMermaidInitialized();
    // Mermaid measures node/label box sizes against the DOM at render time.
    // If the "Abraham TRIAL" web font used for diagram text (see
    // ensureMermaidInitialized) hasn't finished loading yet, that measurement
    // locks in box sizes for the fallback font's (narrower) metrics, and text
    // clips once the real font swaps in. Waiting for document.fonts.ready
    // guarantees the measurement happens with the actual rendered font.
    document.fonts.ready.then(() => {
      codeBlocks.forEach((codeEl) => {
        const source = codeEl.textContent || '';
        const id = `subject-dashboard-mermaid-${mermaidDiagramCounter++}`;
        mermaid.render(id, source)
          .then(({ svg }) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'mermaid-diagram';
            wrapper.innerHTML = svg;
            codeEl.parentElement?.replaceWith(wrapper);
          })
          .catch(() => {
            // leave the original code block rendered as-is if the diagram source is invalid
          });
      });
    });
  }

  private renderPlotlyCharts(): void {
    const container = this.mdContainer?.nativeElement;
    if (!container) {
      return;
    }
    const codeBlocks = Array.from(container.querySelectorAll('pre > code.language-plotly'));
    codeBlocks.forEach((codeEl) => {
      let parsed: { data?: unknown; layout?: unknown; config?: unknown };
      try {
        parsed = JSON.parse(codeEl.textContent || '');
      } catch {
        // leave the original code block rendered as-is if the JSON is invalid
        return;
      }
      if (!Array.isArray(parsed.data)) {
        return;
      }
      const wrapper = document.createElement('div');
      wrapper.className = 'plotly-embed';
      codeEl.parentElement?.replaceWith(wrapper);
      // Plotly sizes itself against the container's current offsetHeight when no
      // explicit height is given; without a default here the wrapper (freshly
      // inserted, no intrinsic height) collapses the plot to a sliver.
      const layout = Object.assign({ height: 450 }, parsed.layout as object);
      const config = Object.assign({ responsive: true }, parsed.config as object);
      this.plotly.newPlot(wrapper, parsed.data as any, layout, config);
    });
  }
}
