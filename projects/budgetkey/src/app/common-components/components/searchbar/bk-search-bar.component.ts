import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { GlobalSettingsService } from '../../global-settings.service';
import { first, fromEvent, timer } from 'rxjs';
import { PlatformService } from '../../platform.service';

declare var window: any;

export class FilterOption {
  id: string;
  display: string;
  filters?: any;
}

export class FilterMenu {
  id: string;
  display: string;
  options: FilterOption[];
  selected?: FilterOption;
}

export interface SearchBarType {
  id: string;
  name: string;
  display: string;
  description: string;
  types: string[];
  amount: number;
  main?: boolean;
  placeholder?: string;
  defaultTerm?: string;
  filters?: any;
  filterMenu?: FilterMenu[];
  ordering?: any;
  score?: number;
}


@Component({
  selector: 'app-bk-search-bar',
  templateUrl: './bk-search-bar.component.html',
  styleUrls: ['./bk-search-bar.component.less'],
})
export class BkSearchBar implements OnChanges, AfterViewInit, OnInit {
  
  @Input() searchTypes: SearchBarType[];
  @Input() selectedSearchType: SearchBarType | undefined;
  @Input() searchTerm: string;
  @Input() isSearching: boolean;
  @Input() disableAutofocus: boolean;
  @Input() allowSubscribe = false;
  @Input() newWindow = false;
  
  @Input() externalTitle: string;
  @Input() externalUrlParams: string;
  @Input() externalProperties: any;
  @Input() fake = false;
  
  @Output() selected = new EventEmitter<any>();
  @Output() search = new EventEmitter<string>();
  
  @ViewChild('searchBox') searchBox: ElementRef;
  @ViewChild('btnSearchMenu') btnSearchMenu: ElementRef;
  
  public isSearchBarHasFocus = false;
  public isSearchBarHasText = false;
  public dropdownOpen = false;
  public showSubscribe = false;
  public externalUrl: string;
  public externalUrlHref: boolean;
  public forcedPlaceholder: string;
  
  constructor (public globalSettings: GlobalSettingsService, private ps: PlatformService) {
  }
  
  public static buildExternalUrl(
    searchTerm: string, searchType: SearchBarType, extraUrlParams: string | null, 
    theme: any | null, lang: string | null, hostname: string
  ): [string, boolean] {
    let urlParams =
    'q=' + encodeURIComponent(searchTerm) +
    '&dd=' + searchType.id;
    if (extraUrlParams) {
      urlParams += '&' + extraUrlParams;
    }
    const params = new URLSearchParams(urlParams);
    if (theme) {
      params.set('theme', theme.themeId || 'budgetkey');
    }
    if (lang) {
      params.set('lang', lang);
    }
    urlParams = params.toString();
    const url = '/s/?' + urlParams;
    if (hostname !== 'next.obudget.org' && hostname.indexOf('localhost') !== 0 && hostname.indexOf('whiletrue') < 0 && hostname.indexOf('127.0.0.1') !== 0) {
      return ['https://next.obudget.org' + url, true];
    } else {
      return [url, false];
    }
  }
  
  public isNumeric(n: number) {
    return n !== null && n >= 0;
  }
  
  private calcExternalUrl() {
    if (this.selectedSearchType) {
      [this.externalUrl, this.externalUrlHref] = BkSearchBar.buildExternalUrl(
        this.searchTerm,
        this.selectedSearchType,
        this.externalUrlParams,
        this.globalSettings.theme,
        this.globalSettings.lang,
        this.ps.browser() ? window.location.hostname : 'next.obudget.org'
      );  
    }
  }
    
  ngOnInit() {
    this.searchTypes = this.searchTypes || this.globalSettings.theme.searchBarConfig;
    this.searchTerm = this.searchTerm || '';
    this.selectedSearchType = this.selectedSearchType || this.searchTypes[0];
    this.isSearchBarHasText = this.searchTerm !== '';
    this.showSubscribe = !this.globalSettings.theme.disableAuth && this.allowSubscribe;
    this.calcExternalUrl();
  }
    
  ngAfterViewInit() {
    if (!this.fake) {
      timer(100).subscribe(() => {
        if (this.searchBox.nativeElement.offsetWidth < 500) {
          this.forcedPlaceholder = 'בואו נחפש';
        }
      });  
    }
  }
    
  ngOnChanges() {
    if (this.selectedSearchType) {
      this.calcExternalUrl();
    }
  }
  
  doSearch(term: string) {
    this.isSearchBarHasText = term !== '';
    
    this.searchTerm = term;
    this.calcExternalUrl();
    
    this.search.emit(term);
  }
  
  openCloseSearchTypeDropDown(event?: Event) {
    event?.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
    if (this.dropdownOpen) {
      fromEvent(window, 'click').pipe(first()).subscribe(() => {
        this.dropdownOpen = false;
      });
    }
  }
  
  switchTab($event: any, selectedSearchType: any) {
    $event.stopPropagation();
    $event.preventDefault();
    
    this.selectedSearchType = selectedSearchType;
    this.calcExternalUrl();
    
    this.selected.emit(selectedSearchType);
  }
  
  glassIcon() {
    return (!this.selectedSearchType?.main && this.isSearchBarHasText)
    ? 'assets/common/img/search-glass-white.svg' :
    'assets/common/img/search-glass-red.svg';
  }
}
