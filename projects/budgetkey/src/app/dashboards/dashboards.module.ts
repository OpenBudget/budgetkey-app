import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { DashboardsPageComponent } from './dashboards-page/dashboards-page.component';
import { DashboardsRoutingModule } from './dashboards-routing.module';
import { ListComponentsModule } from '../list-components/list-components.module';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    CommonComponentsModule,
    ListComponentsModule,  
    DashboardsRoutingModule,
  ]
})
export class DashboardsModule { }
