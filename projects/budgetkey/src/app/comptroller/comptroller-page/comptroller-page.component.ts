import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ComptrollerDashService, Dashboard } from '../comptroller-dash.service';
import { num, year } from '../dash-utils';
import { SeoService } from '../../common-components/seo.service';
import { GlobalSettingsService } from '../../common-components/global-settings.service';
import { PlatformService } from '../../common-components/platform.service';

// The landing page of the State Comptroller pages: high-level numbers, what the reports
// cover and how that changed, and how the data was collected
@UntilDestroy()
@Component({
  selector: 'app-comptroller-page',
  templateUrl: './comptroller-page.component.html',
  styleUrls: ['./comptroller-page.component.less'],
  standalone: false
})
export class ComptrollerPageComponent implements OnInit {

  num = num;
  year = year;
  dash: Dashboard | null = null;
  failed = false;
  nAudits = 0;
  nFindings = 0;

  constructor(private api: ComptrollerDashService, private seo: SeoService,
              private globalSettings: GlobalSettingsService, private ps: PlatformService,
              @Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {
    this.loadFont();
    this.globalSettings.ready.pipe(untilDestroyed(this)).subscribe(() => {
      this.seo.setSeo(this.globalSettings.siteName + ' - דוחות מבקר המדינה', 'https://next.obudget.org/comptroller');
      this.seo.setDescription('דוחות מבקר המדינה משנת 2000 ואילך: על מה המבקר כותב, איך זה השתנה לאורך השנים, ואילו ליקויים לא תוקנו גם אחרי עשרים שנה.');
    });
    this.api.dashboard().pipe(untilDestroyed(this)).subscribe({
      next: (dash) => {
        // The headline needs the comptrollers' totals; without them there's nothing to stand on
        if (!dash.comptrollers.length) {
          this.failed = true;
          return;
        }
        this.dash = dash;
        this.nAudits = dash.comptrollers.reduce((s, c) => s + c.n_audits, 0);
        this.nFindings = dash.comptrollers.reduce((s, c) => s + c.n_findings, 0);
      },
      error: (err) => {
        console.error('Failed to load the comptroller dashboard', err);
        this.failed = true;
      },
    });
  }

  // The word map's typeface, used only on this page
  private loadFont() {
    const id = 'font-secular-one';
    if (!this.document.getElementById(id)) {
      const link = this.document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Secular+One&display=swap';
      this.document.head.appendChild(link);
    }
  }
}
