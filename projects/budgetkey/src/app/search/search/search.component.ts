import { Component, OnInit, Inject, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';

import { SearchParams } from '../model';
import { SearchState } from '../search-state/search-state';
import { AuthService } from '../../auth/auth.service';
import { filter, first, switchMap } from 'rxjs/operators';
import { GlobalSettingsService } from '../../common-components/global-settings.service';
import { SearchBarType } from '../../common-components/components/searchbar/bk-search-bar.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { timer } from 'rxjs';


const gtag: any = (window as any)['gtag'];



@UntilDestroy()
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less']
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
      
      if (sp.offset === 0) {
        if (gtag) {
          gtag('event', 'search', { 
            search_term: sp.term,
            kinds: sp.docType.id 
          });
        }
      }
    });
      
    // Handle the URL query params
    this.route.queryParams.pipe(
      untilDestroyed(this),
    ).subscribe((params: Params) => {
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
    });
  }
}
