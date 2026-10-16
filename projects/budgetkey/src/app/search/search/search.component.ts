import { Component, OnInit, Inject, Input, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';

import { SearchParams } from '../../common-components/search-models';
import { SearchState } from '../search-state/search-state';
import { AuthService } from '../../common-components/auth/auth.service';
import { filter, first, map, switchMap } from 'rxjs/operators';
import { GlobalSettingsService } from '../../common-components/global-settings.service';
import { SearchBarType } from '../../common-components/components/searchbar/bk-search-bar.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { timer } from 'rxjs';
import { PlatformService } from '../../common-components/platform.service';
import { SeoService } from '../../common-components/seo.service';
import { SearchApiService } from '../search-api.service';

@UntilDestroy()
@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.less'],
    standalone: false
})
export class SearchComponent implements OnInit {
  
  @Input() bare = false;
  
  // SearchManager
  searchState: SearchState;
  
  // Component state
  public subscriptionProperties: any = {};
  public subscriptionUrlParams: string;
  isSearching = false;
  
  // Tabs selection
  public docTypes: any[];
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public globalSettings: GlobalSettingsService,
    private ps: PlatformService,
    private seo: SeoService,
    private searchApi: SearchApiService,
    private el: ElementRef
  ) {
    this.searchState = new SearchState(<SearchBarType[]>this.globalSettings.theme.searchBarConfig);
    this.docTypes = this.globalSettings.theme.searchBarConfig;
    this.globalSettings.theme['__tttt__'] = 1;
    this.searchState.searchContext = this.globalSettings.theme.searchContext;
  }
    
  ngOnInit() {
    this.searchState.searchQueue.pipe(
      untilDestroyed(this),
    ).subscribe((sp: SearchParams) => {
      this.subscriptionUrlParams = '';
      if (this.globalSettings.lang) {
        this.subscriptionUrlParams += `&lang=${this.globalSettings.lang}`;
      }
      if (this.globalSettings.themeId) {
        this.subscriptionUrlParams += `&theme=${this.globalSettings.themeId}`;
      }
      
      const queryParams: any = {};
      if (sp.docType.filterMenu) {
        for (const filterMenu of sp.docType.filterMenu) {
          if (filterMenu.selected) {
            this.subscriptionUrlParams += '&' + filterMenu.id + '=' + filterMenu.selected.id;
            queryParams[filterMenu.id] = filterMenu.selected.id;
          }
        }
      }
      
      queryParams['q'] = sp.term || '';
      queryParams['dd'] = sp.docType.id;
      this.router.navigate([], {
        queryParams,
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
      
      this.updateSubscriptionProperties(sp);
      
      this.ps.browser(() => {
        const gtag: any = (window as any)['gtag'];
        if (sp.offset === 0) {
          if (gtag) {
            gtag('event', 'search', { 
              search_term: sp.term,
              kinds: sp.docType.id 
            });
          }
          this.seo.setSeo(this.globalSettings.siteName + ' - חיפוש ' + sp.term, `https://next.obudget.org/s?q=${encodeURIComponent(sp.term)}`);
        }
      });
    });
      
    // Handle the URL query params
    this.route.queryParams.pipe(
      switchMap((params: Params) => {
        if (params['q']) {
          this.searchState.term = params['q'];
        }
        
        if (params['dd']) {
          for (const dt of this.docTypes) {
            if (dt.id === params['dd']) {
              this.searchState.docType = dt;
              break;
            }
          }
        }

        // Load data-driven filter options first, so that they can be selected from the URL
        return this.searchApi.resolveFilterMenus(this.searchState.docType).pipe(map(() => params));
      }),
      untilDestroyed(this),
    ).subscribe((params: Params) => {
      // Filters
      if (this.searchState.docType.filterMenu) {
        for (const filterMenu of this.searchState.docType.filterMenu) {
          if (params[filterMenu.id]) {
            for (const option of filterMenu.options) {
              if (params[filterMenu.id] === option.id) {
                filterMenu.selected = option;
                break;
              }
            }
          }
          if (!filterMenu.selected) {
            filterMenu.selected = filterMenu.options[0];
          }
        }
      }
      this.searchState.start();

      return null;
    });
  }
    
  //// UI HELPERS
  
  onTermChanged(term: string) {
    this.searchState.term = term;
  }
  
  onDocTypeSelected(docType: any) {
    this.searchState.docType = docType;
  }
            
  onSearchFilterMenuChange() {
    this.searchState.initiateSearch();
  }
  
  //// MISCELLANEOUS
  updateSubscriptionProperties(sp: SearchParams) {
    // Update subscription properties
    this.subscriptionProperties = Object.assign({}, sp);
    this.subscriptionProperties.kind = 'search';
    delete this.subscriptionProperties['offset'];
    delete this.subscriptionProperties['pageSize'];
  }

  setIsSearching(isSearching: boolean) {
    timer(0).subscribe(() => {
      this.isSearching = isSearching;
      if (!isSearching) {
        // The tags are re-rendered after each search, so wait for them
        timer(0).subscribe(() => this.scrollSelectedTagIntoView());
      }
    });
  }

  // When the tags row scrolls sideways (mobile), keep the selected tag visible.
  // Only scrolls the row itself, never the page.
  scrollSelectedTagIntoView() {
    this.ps.browser(() => {
      const container: HTMLElement | null = this.el.nativeElement.querySelector('.count-tags');
      const tag: HTMLElement | null = container?.querySelector('.search-tag-name.selected') || null;
      if (container && tag && container.scrollWidth > container.clientWidth) {
        const c = container.getBoundingClientRect();
        const t = tag.getBoundingClientRect();
        container.scrollLeft += (t.left + t.width / 2) - (c.left + c.width / 2);
      }
    });
  }
}
