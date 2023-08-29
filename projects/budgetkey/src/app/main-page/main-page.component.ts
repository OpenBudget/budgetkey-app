import { Component, HostListener } from '@angular/core';
import { bubbles } from './bubbles';
import { HttpClient } from '@angular/common/http';
import { GlobalSettingsService } from '../common-components/global-settings.service';
import { switchMap } from 'rxjs';


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
  styleUrls: ['./main-page.component.less']
})
export class MainPageComponent {
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

  constructor(private globalSettings: GlobalSettingsService, private http: HttpClient) {
    this.year = bubbles.year;
    this.funcCategories = bubbles.func;
    this.econCategories = bubbles.econ;
    this.incomeCategories = bubbles.income;
    this.totalAmount = 0;
    this.funcCategories.forEach((category: any) => {
      this.totalAmount += category.amount;
    });
    this.proposalAmount = bubbles.proposalAmount;
    this.prevProposalAmount = bubbles.prevProposalAmount;
    globalSettings.ready.pipe(
      switchMap(() => this.http.get(`/assets/themes/main_page.translations.${globalSettings.lang}.json`))
    ).subscribe((translations: any) => {
      Object.assign(_TRANSLATIONS, translations);
      this.translationsLoaded = true;
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    this.adVisible = window.scrollY < 30;
  }

  ngOnInit() {
    this.adVisible = true;
  }

  onNavigate(url: string) {
    window.location.href = url;
  }
}
