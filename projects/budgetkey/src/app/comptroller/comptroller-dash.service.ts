import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { PlatformService } from '../common-components/platform.service';

// The State Comptroller dashboard tables, read through the public query API.
// They're rebuilt after each weekly comptroller run.

export type Axis = 'domain' | 'lens';
export type Pattern = 'comptroller' | 'rising' | 'falling' | 'stable';

export interface Comptroller {
  comptroller: string;
  name: string;
  start_date: string;
  end_date: string | null;
  first_year: number;
  last_year: number;
  n_audits: number;
  n_findings: number;
}

export interface Trend {
  axis: Axis;
  key: string;
  label: string;
  n: number;
  share: number;
  share_by_comptroller: {[comptroller: string]: number};
  peak_comptroller: string;
  low_comptroller: string;
  odds_ratio_per_decade: number;
  p_trend: number;
  p_comptroller: number;
  pattern: Pattern;
  search_url: string;
}

export interface Count {
  axis: Axis;
  key: string;
  label: string;
  period_kind: 'all' | 'comptroller';
  period: string;
  n: number;
  total: number;
  share: number;
  lift: number;
  search_url: string;
}

export interface DashEvent {
  event: string;
  name: string;
  // The everyday name, e.g. "מגפת הקורונה", for where the full one doesn't fit
  short_name: string;
  event_when: string;
  description: string;
  last_published: string;
  n_reports: number;
  n_chapters: number;
  n_findings: number;
  search_url: string;
}

export interface ChronicIssue {
  rank: number;
  issue_id: string;
  title: string;
  bodies: string[];
  first_reported: string;
  first_chapter_title: string;
  latest_verdict_label: string;
  latest_verdict_date: string;
  latest_verdict_chapter_title: string;
  years_open: number;
  n_audits: number;
  government_status: string | null;
  url: string;
}

export interface Totals {
  // Distinct issues: a finding repeated in a follow-up audit is the same issue
  issues: number;
  revisited: number;
  chronic: number;
  chronic_decade: number;
  last_published: string;
}

export interface Dashboard {
  comptrollers: Comptroller[];
  trends: Trend[];
  counts: Count[];
  events: DashEvent[];
  chronic: ChronicIssue[];
  totals: Totals | null;
  // CSV downloads of each table's rows, as given by the query API
  downloads: {[name in QueryName]?: string};
}

const QUERIES = {
  comptrollers: `SELECT comptroller, name, start_date, end_date, first_year, last_year, n_audits, n_findings
    FROM state_comptroller_dash_comptrollers ORDER BY start_date`,
  trends: `SELECT axis, key, label, n, share, share_by_comptroller, peak_comptroller, low_comptroller,
      odds_ratio_per_decade, p_trend, p_comptroller, pattern, search_url
    FROM state_comptroller_dash_trends ORDER BY axis, n DESC`,
  counts: `SELECT axis, key, label, period_kind, period, n, total, share, lift, search_url
    FROM state_comptroller_dash_counts WHERE period_kind IN ('all', 'comptroller')`,
  events: `SELECT event, name, short_name, event_when, description, last_published, n_reports, n_chapters, n_findings, search_url
    FROM state_comptroller_dash_events WHERE kind = 'event' ORDER BY last_published DESC`,
  chronic: `SELECT rank, issue_id, title, bodies, first_reported, first_chapter_title, latest_verdict_label,
      latest_verdict_date, latest_verdict_chapter_title, years_open, n_audits, government_status, url
    FROM state_comptroller_dash_chronic_issues WHERE chain_rank = 1 ORDER BY rank LIMIT 12`,
  totals: `SELECT
      (SELECT count(*) FROM state_comptroller_issues) AS issues,
      (SELECT count(*) FROM state_comptroller_issues WHERE n_audits > 1) AS revisited,
      (SELECT count(*) FROM state_comptroller_dash_chronic_issues) AS chronic,
      (SELECT count(*) FROM state_comptroller_dash_chronic_issues WHERE years_open >= 10) AS chronic_decade,
      (SELECT max(publish_date) FROM state_comptroller_audits) AS last_published`,
};

export type QueryName = keyof typeof QUERIES;

const QUERY_URL = 'https://next.obudget.org/api/query';

@Injectable()
export class ComptrollerDashService {

  constructor(private http: HttpClient, private ps: PlatformService) {}

  dashboard(): Observable<Dashboard> {
    const downloads: Dashboard['downloads'] = {};
    // A table that fails to load leaves its section out, rather than the whole page
    const rows = <T>(name: QueryName) => this.query<T>(name).pipe(
      map((res) => {
        downloads[name] = res.download_url;
        return res.rows || [];
      }),
      catchError((err) => {
        console.error('Failed to load the comptroller dashboard table', name, err);
        return of([] as T[]);
      })
    );
    return forkJoin({
      comptrollers: rows<Comptroller>('comptrollers'),
      trends: rows<Trend>('trends'),
      counts: rows<Count>('counts'),
      events: rows<DashEvent>('events'),
      chronic: rows<ChronicIssue>('chronic'),
      totals: rows<Totals>('totals').pipe(map((r) => r[0] || null)),
    }).pipe(map((d) => ({...d, downloads})));
  }

  private query<T>(name: QueryName): Observable<{rows: T[], download_url: string}> {
    return this.ps.cachedRequest(`comptroller-dash.${name}`,
      this.http.get<{rows: T[], download_url: string}>(QUERY_URL, {params: {query: QUERIES[name].replace(/\s+/g, ' ')}})
    );
  }
}
