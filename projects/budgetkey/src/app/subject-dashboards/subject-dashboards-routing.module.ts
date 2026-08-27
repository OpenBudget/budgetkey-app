import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubjectDashboardsHomeComponent } from './subject-dashboards-home/subject-dashboards-home.component';
import { SubjectDashboardPageComponent } from './subject-dashboard-page/subject-dashboard-page.component';

const routes: Routes = [
  { path: '', component: SubjectDashboardsHomeComponent },
  { path: '**', component: SubjectDashboardPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubjectDashboardsRoutingModule { }
