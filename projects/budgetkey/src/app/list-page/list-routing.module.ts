import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListPageComponent } from "./list-page/list-page.component";
import { MyListsPageComponent } from "./my-lists-page/my-lists-page.component";

const routes: Routes = [
  {
    path: 'my',
    component: MyListsPageComponent
  },
  {
    path: ':user-id/:list-id',
    component: ListPageComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListRoutingModule {}
