import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BkHeaderComponent } from './components/header/bk-header.component';
import { BkFooterComponent } from './components/footer/bk-footer.component';
import { BkSearchBar } from './components/searchbar/bk-search-bar.component';
import { BkTooltipDirective } from './components/tooltip/bk-tooltip.directive';
import { BkSubscribeStar } from './components/subscribe-star/bk-subscribe-star.component';
import { BkSubscriptionManager } from './components/subcsription-manager/bk-subscription-manager.component';
import { ModalComponent} from './components/modal/modal.component';

import { ListsService } from './services/lists.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { GlobalSettingsService } from './global-settings.service';
import { ClickOnReturnDirective } from './directives/click-on-return.directive';
import { PlatformService } from './platform.service';
import { AuthComponent } from './auth/auth.component';
import { AuthService } from './auth/auth.service';
import { RouterModule } from '@angular/router';
import { SeoService } from './seo.service';
import { LayoutService } from './layout.service';
import { WindowService } from './window.service';
import { ShareWidgetComponent } from './components/share-widget/share-widget.component';

/**
 * Created by adam on 27/12/2016.
 */
@NgModule({ declarations: [
        BkHeaderComponent,
        BkFooterComponent,
        BkSearchBar,
        BkTooltipDirective,
        BkSubscribeStar,
        BkSubscriptionManager,
        ModalComponent,
        ClickOnReturnDirective,
        AuthComponent,
        ShareWidgetComponent,
    ],
    exports: [
        BkHeaderComponent,
        BkFooterComponent,
        BkSearchBar,
        BkTooltipDirective,
        BkSubscribeStar,
        BkSubscriptionManager,
        ModalComponent,
        ClickOnReturnDirective,
        ShareWidgetComponent,
    ], imports: [CommonModule,
        FormsModule,
        RouterModule], providers: [
        ListsService,
        GlobalSettingsService,
        PlatformService,
        AuthService,
        SeoService,
        LayoutService,
        WindowService,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class CommonComponentsModule { }
