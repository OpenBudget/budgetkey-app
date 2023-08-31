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
import { timer } from 'rxjs';

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
  @Input() selectedSearchType: SearchBarType;
  @Input() searchTerm: string;
  @Input() isSearching: boolean;
  @Input() disableAutofocus: boolean;
  @Input() allowSubscribe = false;
  @Input() newWindow = false;
  
  @Input() externalTitle: string;
  @Input() externalUrlParams: string;
  @Input() externalProperties: any;
  
  @Output() selected = new EventEmitter<any>();
  @Output() search = new EventEmitter<string>();
  @Output() navigate = new EventEmitter<string>();
  
  @ViewChild('searchBox') searchBox: ElementRef;
  @ViewChild('btnSearchMenu') btnSearchMenu: ElementRef;
  
  public isSearchBarHasFocus = false;
  public isSearchBarHasText = false;
  public dropdownOpen = false;
  public showSubscribe = false;
  public externalUrl: string;
  public forcedPlaceholder: string;
  
  constructor (public globalSettings: GlobalSettingsService) {
  }
  
  public static buildExternalUrl(searchTerm: string, searchType: SearchBarType, extraUrlParams: string | null, theme: any | null, lang: string | null) {
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
    return 'https://next.obudget.org/s/?' + urlParams;
  }
  
  
  @HostListener('document:click', ['$event'])
  onClickOutOfDropdown(event: any) {
    const isClickedOnDropdown = this.btnSearchMenu.nativeElement.contains(event.target);
    
    if (this.dropdownOpen && !isClickedOnDropdown) {
      this.dropdownOpen = false;
    }
  }
  
  public isNumeric(n: number) {
    return n !== null && n >= 0;
  }
  
  private calcExternalUrl() {
    this.externalUrl = BkSearchBar.buildExternalUrl(
      this.searchTerm,
      this.selectedSearchType,
      this.externalUrlParams,
      this.globalSettings.theme,
      this.globalSettings.lang
      );
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
      timer(100).subscribe(() => {
        if (this.searchBox.nativeElement.offsetWidth < 500) {
          this.forcedPlaceholder = 'בואו נחפש';
        }
      });
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
    
    openCloseSearchTypeDropDown() {
      this.dropdownOpen = !this.dropdownOpen;
    }
    
    switchTab($event: any, selectedSearchType: any) {
      $event.stopPropagation();
      $event.preventDefault();
      
      this.selectedSearchType = selectedSearchType;
      this.calcExternalUrl();
      
      this.selected.emit(selectedSearchType);
    }
    
    doNavigate(term: string) {
      this.searchTerm = term;
      this.calcExternalUrl();
      
      this.navigate.emit(this.externalUrl);
    }
    
    glassIcon() {
      return (!this.selectedSearchType.main && this.isSearchBarHasText)
      ? 'assets/common/img/search-glass-white.svg' :
      'assets/common/img/search-glass-red.svg';
    }
  }
  