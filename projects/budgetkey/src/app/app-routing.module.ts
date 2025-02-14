import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', loadChildren: () => import('./main-page/main-page.module').then(m => m.MainPageModule) },
  { path: 's', loadChildren: () => import('./search/search.module').then(m => m.SearchModule) },
  { path: 'i', loadChildren: () => import('./item/item.module').then(m => m.ItemModule) },
  { path: 'about', loadChildren: () => import('./about/about.module').then(m => m.AboutModule) },
  { path: 'p', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule) },
  { path: 'l', loadChildren: () => import('./list-page/list-page.module').then(m => m.ListPageModule) },
  { path: 'dashboards', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule) },
  { path: 'not-found', component: PageNotFoundComponent },
  { path: '**', pathMatch: 'full', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // initialNavigation: 'enabledBlocking',
    anchorScrolling: 'enabled',
    // enableTracing: true,
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
