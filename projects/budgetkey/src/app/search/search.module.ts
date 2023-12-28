import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchPageComponent } from './search-page/search-page.component';
import { SearchRoutingModule } from './search-routing.module';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { BarePageComponent } from './bare-page/bare-page.component';
import { BareSearchBarComponent } from './bare-search-bar/bare-search-bar.component';
import { SearchComponent } from './search/search.component';
import { HorizontalResultsComponent } from './horizontal-results/horizontal-results.component';
import { SearchFilterMenuComponent } from './search-filter-menu/search-filter-menu.component';
import { SearchFilterMenuBarComponent } from './search-filter-menu-bar/search-filter-menu-bar.component';
import { SearchModeSelectorComponent } from './search-mode-selector/search-mode-selector.component';
import { SearchTagComponent } from './search-tag/search-tag.component';
import { VerticalResultsComponent } from './vertical-results/vertical-results.component';
import { FormsModule } from '@angular/forms';

import { SearchApiService } from './search-api.service';
import { ListComponentsModule } from '../list-components/list-components.module';

@NgModule({
  declarations: [
    SearchPageComponent,
    BarePageComponent,
    BareSearchBarComponent,
    SearchComponent,
    HorizontalResultsComponent,
    SearchFilterMenuComponent,
    SearchFilterMenuBarComponent,
    SearchModeSelectorComponent,
    SearchTagComponent,
    VerticalResultsComponent,
  ],
  imports: [
    CommonModule,
    CommonComponentsModule,
    FormsModule,
    SearchRoutingModule,
    ListComponentsModule,
  ],
  providers: [
    SearchApiService
  ]
})
export class SearchModule { }
