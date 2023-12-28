import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListPageComponent } from "./list-page/list-page.component";
import { UserListsPageComponent } from "./user-lists-page/user-lists-page.component";

const routes: Routes = [
  {
    path: ':user-id/:list-id',
    component: ListPageComponent
  },
  {
    path: ':user-id',
    component: UserListsPageComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListRoutingModule {}
