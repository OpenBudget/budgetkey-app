import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { bubbles } from './bubbles';
import { HttpClient } from '@angular/common/http';
import { GlobalSettingsService } from '../common-components/global-settings.service';
import { switchMap } from 'rxjs';
import { PlatformService } from '../common-components/platform.service';
import { Router } from '@angular/router';
import { SeoService } from '../common-components/seo.service';


const _TRANSLATIONS: any = {};

export function __T(content: string) {
  const ret = _TRANSLATIONS[content];
  if (!ret) {
    return content;
  }
  return ret;
}

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.less'],
    standalone: false
})
export class MainPageComponent implements OnInit, OnDestroy {
  public funcCategories: any[];
  public econCategories: any[];
  public incomeCategories: any[];
  public totalAmount = 0;
  public proposalAmount = 0;
  public prevProposalAmount = 0;
  public year: number;
  public __ = __T;
  public adVisible = false;
  public translationsLoaded = false;

  constructor(private globalSettings: GlobalSettingsService, private http: HttpClient, private ps: PlatformService, private router: Router, private seo: SeoService) {
    this.year = bubbles.year;
    this.funcCategories = bubbles.func;
    this.econCategories = bubbles.econ;
    this.incomeCategories = bubbles.income;
    this.totalAmount = 0;
    this.funcCategories.forEach((category: any) => {
    this.totalAmount += category.amount;
    });
    this.proposalAmount = bubbles.proposalAmount || 0;
    this.prevProposalAmount = bubbles.prevProposalAmount;
    globalSettings.ready.pipe(
      switchMap(() => this.ps.cachedRequest(`translations.${globalSettings.lang}`, http.get(ps.BASE + `/assets/themes/main_page.translations.${globalSettings.lang}.json`)))
    ).subscribe((translations: any) => {
      Object.assign(_TRANSLATIONS, translations);
      this.translationsLoaded = true;
    });
  }

  @ViewChild('summary', {read: ElementRef}) summary: ElementRef;

  // The course ad shows until the budget summary reaches the upper half of the screen
  private onScroll = () => {
    const el = this.summary?.nativeElement;
    if (el) {
      this.adVisible = el.getBoundingClientRect().top > window.innerHeight / 2;
    }
  };

  ngOnInit() {
    this.adVisible = true;
    // Capture phase, as the page scrolls in an inner element (whose scroll events don't bubble)
    this.ps.browser(() => window.addEventListener('scroll', this.onScroll, {capture: true, passive: true}));
    this.globalSettings.ready.subscribe(() => {
      this.seo.setSeo(this.globalSettings.siteName, `https://next.obudget.org/`);
    });
  }

  ngOnDestroy() {
    this.ps.browser(() => window.removeEventListener('scroll', this.onScroll, {capture: true}));
  }
}
