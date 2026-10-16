import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { __T as __ } from '../main-page.component';

interface Analysis {
  doc_id: string;
  question: string;
  category: string;
}

const SHOWN = 6;

// The AI analysis pages, presented as a few of the questions they answer
@UntilDestroy()
@Component({
    selector: 'app-analysis-showcase',
    templateUrl: './analysis-showcase.component.html',
    styleUrls: ['./analysis-showcase.component.less'],
    standalone: false
})
export class AnalysisShowcaseComponent implements OnInit {

  __ = __;
  analyses: Analysis[] = [];
  shown: Analysis[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('https://next.obudget.org/search/analysis', {params: {q: '', size: 100}}).pipe(
      map((res: any) => (res.search_results || [])
        .map((r: any) => r.source)
        .filter((a: Analysis) => a.question && a.doc_id)
      ),
      catchError(() => of([])),
      untilDestroyed(this),
    ).subscribe((analyses: Analysis[]) => {
      this.analyses = analyses;
      // Deterministic first pick (the same on the server and in the browser), one per topic
      this.shown = this.spreadByCategory(analyses).slice(0, SHOWN);
    });
  }

  more() {
    const current = new Set(this.shown);
    const pool = this.analyses.filter((a) => !current.has(a));
    this.shown = this.spreadByCategory(this.shuffle(pool)).slice(0, SHOWN);
  }

  // Reorders the analyses so that consecutive ones are from different topics
  private spreadByCategory(analyses: Analysis[]): Analysis[] {
    const byCategory = new Map<string, Analysis[]>();
    for (const a of analyses) {
      byCategory.set(a.category, [...(byCategory.get(a.category) || []), a]);
    }
    const ret: Analysis[] = [];
    const queues = [...byCategory.values()];
    while (queues.some((q) => q.length)) {
      for (const q of queues) {
        const a = q.shift();
        if (a) {
          ret.push(a);
        }
      }
    }
    return ret;
  }

  private shuffle<T>(items: T[]): T[] {
    const ret = [...items];
    for (let i = ret.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ret[i], ret[j]] = [ret[j], ret[i]];
    }
    return ret;
  }
}
