import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { SingleSubscriptionItemComponent } from './single-subscription-item/single-subscription-item.component';
import { DeleteAllSubscriptionItemsComponent } from './delete-all-subscription-items/delete-all-subscription-items.component';


@NgModule({
  declarations: [
    ProfilePageComponent,
    SingleSubscriptionItemComponent,
    DeleteAllSubscriptionItemsComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    CommonComponentsModule
  ]
})
export class ProfileModule { }
