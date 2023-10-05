import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppContainerComponent } from './components/app-container/app-container.component';
import { BkHeaderComponent } from './components/header/bk-header.component';
import { BkFooterComponent } from './components/footer/bk-footer.component';
import { BkSearchBar } from './components/searchbar/bk-search-bar.component';
import { BkTooltipDirective } from './components/tooltip/bk-tooltip.directive';
import { BkSubscribeStar } from './components/subscribe-star/bk-subscribe-star.component';
import { BkSubscriptionManager } from './components/subcsription-manager/bk-subscription-manager.component';
import { ModalComponent} from './components/modal/modal.component';

import { AuthModule } from '../auth/auth.module';
import { ListsService } from './services/lists.service';
import { HttpClientModule } from '@angular/common/http';
import { GlobalSettingsService } from './global-settings.service';
import { ClickOnReturnDirective } from './directives/click-on-return.directive';
import { PlatformService } from './platform.service';

/**
 * Created by adam on 27/12/2016.
 */
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    AuthModule,
    FormsModule
  ],
  declarations: [
    AppContainerComponent,
    BkHeaderComponent,
    BkFooterComponent,
    BkSearchBar,
    BkTooltipDirective,
    BkSubscribeStar,
    BkSubscriptionManager,
    ModalComponent,
    ClickOnReturnDirective,
  ],
  providers: [
    ListsService,
    GlobalSettingsService,
    PlatformService
  ],
  exports: [
    AppContainerComponent,
    BkHeaderComponent,
    BkFooterComponent,
    BkSearchBar,
    BkTooltipDirective,
    BkSubscribeStar,
    BkSubscriptionManager,
    ModalComponent,
    ClickOnReturnDirective,
  ]
})
export class CommonComponentsModule { }
