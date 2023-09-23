import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./main-page/main-page.module').then(m => m.MainPageModule) },
  { path: 's', loadChildren: () => import('./search/search.module').then(m => m.SearchModule) },
  { path: 'i', loadChildren: () => import('./item/item.module').then(m => m.ItemModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }