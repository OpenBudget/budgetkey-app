import { Component, ElementRef, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

import * as Showdown from 'showdown';
import { Format } from '../../../format';
import { PlatformService } from '../../../common-components/platform.service';
import { SeoService } from '../../../common-components/seo.service';
import { ANALYSIS_CATEGORIES } from '../../../common-components/analysis-categories';

interface Segment {
  kind: 'md' | 'chart' | 'raw';
  html?: string;
  spec?: any;
  text?: string;
}

// A fenced ```plotly block holding a single JSON chart descriptor
const PLOTLY_FENCE = /^```plotly[^\n]*\n([\s\S]*?)^```[ \t]*$/gm;
// Absolute links to the site's own item pages, which we keep inside the SPA
const INTERNAL_LINK = /^https?:\/\/next\.obudget\.org(?=\/i\/)/;

const analysisMarkdown = () => [
  {
    type: 'output',
    regex: /<a href="([^"]+)"(.*?)>(.*?)<\/a>/g,
    replace: (match: string, href: string, otherAttributes: string, linkText: string) => {
      if (INTERNAL_LINK.test(href)) {
        return `<a href="${href.replace(INTERNAL_LINK, '')}"${otherAttributes}>${linkText}</a>`;
      }
      const ariaLabel = `מעבר לאתר אחר - ${linkText.replace(/<[^>]+>/g, '')} בטאב חדש`.split('"').join('\'');
      return `<a href="${href}"${otherAttributes} target="_blank" rel="noopener" aria-label="${ariaLabel}">${linkText}</a>`;
    }
  },
  {
    type: 'output',
    regex: /<table>([\s\S]*?)<\/table>/g,
    replace: '<div class="table-scroll"><table>$1</table></div>',
  },
  // "*Label:* item · item · …" lists of budget lines collapse behind their label
  {
    type: 'output',
    regex: /<p><(em|strong)>([^<]+?):<\/\1>\s*([\s\S]*?)<\/p>/g,
    replace: (match: string, tag: string, label: string, items: string) => {
      if (items.indexOf('·') < 0) {
        return match;
      }
      const count = items.split('·').length;
      return `<details class="item-list"><summary>${label} (${count})</summary><p>${items}</p></details>`;
    }
  },
  // Other paragraphs opening in italics are notes on the preceding chart or table
  {
    type: 'output',
    regex: /<p><em>/g,
    replace: '<p class="note"><em>',
  },
  {
    type: 'output',
    regex: /<h2>בקצרה<\/h2>([\s\S]*?)(?=<h2>|$)/,
    replace: '<h2>בקצרה</h2><div class="lead">$1</div>',
  },
  // The methodology section, always last
  {
    type: 'output',
    regex: /<h2>על הנתונים<\/h2>([\s\S]*)$/,
    replace: '<section class="about-data"><h2><i class="ai-icon" aria-hidden="true"></i>על הנתונים</h2>$1</section>',
  },
];

@Component({
    selector: 'app-item-analysis',
    templateUrl: './item-analysis.component.html',
    styleUrls: ['./item-analysis.component.less'],
    standalone: false
})
export class ItemAnalysisComponent implements OnChanges {
  @Input() item: any;

  format = new Format();
  segments: Segment[] = [];
  showCharts = false;

  private converter = new Showdown.Converter({
    extensions: [analysisMarkdown],
    tables: true,
    strikethrough: true,
    literalMidWordUnderscores: true,
    // Angular's sanitizer strips ids anyway
    noHeaderId: true,
  });

  constructor(private router: Router, private seo: SeoService, private el: ElementRef, ps: PlatformService) {
    this.showCharts = ps.browser();
  }

  ngOnChanges() {
    this.segments = this.split(this.item?.body || '');
    this.seo.setDescription(this.item?.description);
  }

  get category(): string {
    return ANALYSIS_CATEGORIES[this.item?.category] || '';
  }

  split(body: string): Segment[] {
    const segments: Segment[] = [];
    const addMarkdown = (md: string) => {
      if (md.trim()) {
        segments.push({kind: 'md', html: this.converter.makeHtml(md)});
      }
    };
    let last = 0;
    for (const match of body.matchAll(PLOTLY_FENCE)) {
      addMarkdown(body.slice(last, match.index));
      try {
        const spec = JSON.parse(match[1]);
        spec.layout = Object.assign({height: 450}, spec.layout);
        segments.push({kind: 'chart', spec});
      } catch (e) {
        segments.push({kind: 'raw', text: match[1]});
      }
      last = match.index! + match[0].length;
    }
    addMarkdown(body.slice(last));
    return segments;
  }

  scrollToAbout() {
    const about = (this.el.nativeElement as HTMLElement).querySelector('section.about-data');
    about?.scrollIntoView({behavior: 'smooth', block: 'start'});
  }

  // Navigate in-app for links to the site's own pages, rendered via innerHTML
  onClick(event: MouseEvent) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    const anchor = (event.target as HTMLElement).closest('a');
    const href = anchor?.getAttribute('href');
    if (href?.startsWith('/') && !anchor?.getAttribute('target')) {
      event.preventDefault();
      this.router.navigateByUrl(href);
    }
  }
}
