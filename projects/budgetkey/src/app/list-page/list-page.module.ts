import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponentsModule } from '../list-components/list-components.module';
import { ListRoutingModule } from './list-routing.module';
import { ListPageComponent } from './list-page/list-page.component';
import { UserListsPageComponent } from './user-lists-page/user-lists-page.component';
import { CommonComponentsModule } from '../common-components/common-components.module';



@NgModule({
  declarations: [
    ListPageComponent,
    UserListsPageComponent
  ],
  imports: [
    CommonModule,
    CommonComponentsModule,
    ListComponentsModule,
    ListRoutingModule,
  ]
})
export class ListPageModule { }
