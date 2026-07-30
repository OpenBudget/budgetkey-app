import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import * as Showdown from 'showdown';

import { PlatformService } from '../../common-components/platform.service';

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

  constructor(
    private http: HttpClient,
    private domSanitizer: DomSanitizer,
    private ps: PlatformService,
    private route: ActivatedRoute
  ) {
    this.converter = new Showdown.Converter({
      tables: true,
      customizedHeaderId: true,
      openLinksInNewWindow: true,
    });

    this.route.url.pipe(
      switchMap((segments: UrlSegment[]) => {
        const slug = segments.map((segment) => segment.path).join('/');
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
    });
  }
}
