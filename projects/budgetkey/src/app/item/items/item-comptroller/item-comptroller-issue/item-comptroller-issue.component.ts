import { Component, Input, OnChanges } from '@angular/core';
import { SeoService } from '../../../../common-components/seo.service';
import { SEVERITIES, Status, TextBlock, auditDocId, findingAnchor, partialDate, status, textBlocks } from '../comptroller';

// Response groups longer than this start collapsed
const COLLAPSED_ROWS = 3;

const KIND_LABELS: {[kind: string]: string} = {
  finding: 'דוח מבקר המדינה',
  follow_up: 'ביקורת מעקב',
  response: 'תגובת הממשלה',
  body_response: 'תגובת הגוף המבוקר',
};

interface ResponseRow {
  title: string;
  // "body: answer" lines, and the tables between them
  answers: {body: string, text: string, tableHtml?: string}[];
  // The finding as the response book states it, when the book has no answer
  findingText: string;
  status: Status | null;
}

interface TimelineCard {
  kind: string;
  kindLabel: string;
  date: string;
  source: string;
  // Findings and follow-ups
  title?: string;
  text?: TextBlock[];
  auditDocId?: string | null;
  anchor?: string | null;
  status?: Status | null;
  // When the audit was carried out (findings and follow-ups)
  period?: string;
  // The audited bodies' responses as quoted in the report, a row per body
  quotes?: {body: string, text: TextBlock[], date: string}[];
  // Responses: one card per book, a row per entry
  url?: string;
  rows?: ResponseRow[];
  // The book's item title, when all the rows share it
  expanded?: boolean;
}

@Component({
    selector: 'app-item-comptroller-issue',
    templateUrl: './item-comptroller-issue.component.html',
    styleUrls: ['./item-comptroller-issue.component.less'],
    standalone: false
})
export class ItemComptrollerIssueComponent implements OnChanges {
  @Input() item: any;

  readonly collapsedRows = COLLAPSED_ROWS;
  partialDate = partialDate;

  cards: TimelineCard[] = [];
  audits: {docId: string, title: string}[] = [];

  constructor(private seo: SeoService) {}

  ngOnChanges() {
    const item = this.item || {};
    this.seo.setDescription(item.description);
    const ids: any[] = item.chapter_ids || [];
    const titles: string[] = item.chapter_titles || [];
    this.audits = ids.map((id, i) => ({docId: auditDocId(id), title: titles[i] || String(id)}));
    this.cards = this.buildTimeline(item.timeline || []);
  }

  get latestStatus(): Status | null {
    return status(this.item?.latest_status);
  }

  get severity(): string {
    return SEVERITIES[this.item?.severity] || '';
  }

  private buildTimeline(timeline: any[]): TimelineCard[] {
    const cards: TimelineCard[] = [];
    for (const entry of timeline) {
      if (entry.kind === 'body_response') {
        // Consecutive responses to the same finding (one per body) share a card
        // Undated ones ("לא צוין" in the report) show no date
        const quote = {body: entry.body || '', text: textBlocks(entry.text), date: entry.date ? partialDate(entry.date) : ''};
        const last = cards[cards.length - 1];
        if (last?.kind === 'body_response' && last.anchor === findingAnchor(entry.id)) {
          last.quotes!.push(quote);
          last.date = last.date || quote.date;
        } else {
          cards.push({
            kind: 'body_response', kindLabel: KIND_LABELS['body_response'],
            date: quote.date, source: entry.source || '',
            auditDocId: entry.chapter_id ? auditDocId(entry.chapter_id) : null,
            anchor: entry.id ? findingAnchor(entry.id) : null,
            quotes: [quote],
          });
        }
      } else if (entry.kind === 'response') {
        const row = this.responseRow(entry);
        // A response book contributes one entry per row of its table: consecutive ones share a card
        const last = cards[cards.length - 1];
        if (last?.kind === 'response' && last.source === (entry.source || '') && last.date === partialDate(entry.date)) {
          last.rows!.push(row);
        } else {
          cards.push({
            kind: 'response', kindLabel: KIND_LABELS['response'],
            date: partialDate(entry.date), source: entry.source || '', url: entry.url,
            rows: [row], expanded: false,
          });
        }
      } else {
        const chapter = entry.chapter_id;
        cards.push({
          kind: entry.kind,
          kindLabel: KIND_LABELS[entry.kind] || '',
          date: partialDate(entry.date),
          source: entry.source || '',
          title: entry.title || '',
          text: textBlocks(entry.text),
          auditDocId: chapter ? auditDocId(chapter) : null,
          anchor: chapter && entry.id ? findingAnchor(entry.id) : null,
          status: status(entry.status),
          period: entry.audit_period || '',
        });
      }
    }
    // Rows of a book usually share the item's title: show it once, on the card
    for (const card of cards) {
      const titles = new Set(card.rows?.map(r => r.title));
      if (card.rows && card.rows.length > 1 && titles.size === 1) {
        card.title = card.rows[0].title;
        card.rows.forEach(r => r.title = '');
      }
    }
    return cards;
  }

  private responseRow(entry: any): ResponseRow {
    const answers = textBlocks(entry.text).map(({line, tableHtml}) => {
      if (tableHtml) {
        return {body: '', text: '', tableHtml};
      }
      // "body: answer", but not "https://..."
      const m = line!.match(/^([^:.\d]{2,50}):(?!\/\/)\s*([\s\S]*)$/);
      return m ? {body: m[1], text: m[2]} : {body: '', text: line!};
    });
    return {
      title: entry.title || '',
      answers,
      findingText: answers.length ? '' : (entry.finding_text || ''),
      status: status(entry.status),
    };
  }
}
