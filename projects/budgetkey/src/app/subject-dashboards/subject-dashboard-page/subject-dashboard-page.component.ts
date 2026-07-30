import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import mermaid from 'mermaid';
import { catchError, of, switchMap, timer } from 'rxjs';
import * as Showdown from 'showdown';

import { PlatformService } from '../../common-components/platform.service';

let mermaidInitialized = false;
function ensureMermaidInitialized(): void {
  if (mermaidInitialized) {
    return;
  }
  mermaid.initialize({ startOnLoad: false, securityLevel: 'strict' });
  mermaidInitialized = true;
}

let mermaidDiagramCounter = 0;

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
  if (!href || !href.endsWith('.md') || /^([a-z][a-z0-9+.-]*:)?\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('/')) {
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

  @ViewChild('mdContainer') mdContainer?: ElementRef<HTMLDivElement>;

  constructor(
    private http: HttpClient,
    private domSanitizer: DomSanitizer,
    private ps: PlatformService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.converter = new Showdown.Converter({
      tables: true,
      customizedHeaderId: true,
      openLinksInNewWindow: true,
    });

    this.route.url.pipe(
      switchMap((segments: UrlSegment[]) => {
        const slug = segments.map((segment) => segment.path).join('/');
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
          this.rewriteInternalLinks();
        });
      });
    });
  }

  onContentClick(event: MouseEvent): void {
    const anchor = (event.target as HTMLElement).closest('a[data-spa-link="true"]');
    const href = anchor?.getAttribute('href');
    if (!href) {
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
      anchor.setAttribute('data-spa-link', 'true');
      anchor.removeAttribute('target');
      anchor.removeAttribute('rel');
    });
  }

  private renderMermaidDiagrams(): void {
    const container = this.mdContainer?.nativeElement;
    if (!container) {
      return;
    }
    ensureMermaidInitialized();
    const codeBlocks = Array.from(container.querySelectorAll('pre > code.language-mermaid'));
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
  }
}
