import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AddToListIconComponent } from './add-widget-icon/add-to-list-icon.component';
import { ListViewComponent } from './list-view/list-view.component';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { SearchResultComponent } from './search-result/search-result.component';
import { ListPageComponent } from './list-page/list-page.component';
import { ListRoutingModule } from './list-routing.module';

/**
 * Created by adam on 27/12/2016.
 */
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    CommonComponentsModule,
    ListRoutingModule
  ],
  declarations: [
    AddToListIconComponent,
    ListViewComponent,
    SearchResultComponent,
    ListPageComponent
  ],
  providers: [
  ],
  exports: [
    AddToListIconComponent,
    ListViewComponent,
    SearchResultComponent
  ]
})
export class ListComponentsModule { }
