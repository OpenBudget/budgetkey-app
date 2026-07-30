import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { SubjectDashboardsRoutingModule } from './subject-dashboards-routing.module';
import { SubjectDashboardsHomeComponent } from './subject-dashboards-home/subject-dashboards-home.component';
import { SubjectDashboardPageComponent } from './subject-dashboard-page/subject-dashboard-page.component';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { ListComponentsModule } from '../list-components/list-components.module';

@NgModule({
  declarations: [
    SubjectDashboardsHomeComponent,
    SubjectDashboardPageComponent
  ],
  imports: [
    CommonModule,
    CommonComponentsModule,
    ListComponentsModule,
    SubjectDashboardsRoutingModule
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class SubjectDashboardsModule { }
