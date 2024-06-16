import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutPageComponent } from './about-page/about-page.component';

const routes: Routes = [
  { path: 'a11y', component: AboutPageComponent, data: {a11y: true}},
  { path: '', component: AboutPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutRoutingModule { }
