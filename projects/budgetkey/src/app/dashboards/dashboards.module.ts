import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { DashboardsPageComponent } from './dashboards-page/dashboards-page.component';
import { DashboardsRoutingModule } from './dashboards-routing.module';
import { ListComponentsModule } from '../list-components/list-components.module';
import { ItemModule } from '../item/item.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { DashboardsApiService } from './dashboards-api.service';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    CommonComponentsModule,
    ListComponentsModule,  
    DashboardsRoutingModule,
    ItemModule,
  ],providers: [
    DashboardsApiService,
    provideHttpClient(withInterceptorsFromDi()),
  ]
})
export class DashboardsModule { }
