import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SearchPageComponent } from "./search-page/search-page.component";
import { BarePageComponent } from "./bare-page/bare-page.component";

const routes: Routes = [
    {
      path: '',
      component: SearchPageComponent
    },
    { 
      path: 'bare',
      component: BarePageComponent
    },
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class SearchRoutingModule {}
  