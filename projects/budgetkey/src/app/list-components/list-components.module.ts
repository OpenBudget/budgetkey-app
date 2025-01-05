import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AddToListIconComponent } from './add-to-list-icon/add-to-list-icon.component';
import { ListViewComponent } from './list-view/list-view.component';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { SearchResultComponent } from './search-result/search-result.component';
import { EditedContentDirective } from './edited-content.directive';
import { AppContainerComponent } from './app-container/app-container.component';
import { AddToListDialogComponent } from './add-to-list-dialog/add-to-list-dialog.component';
import { ListDialogService } from './list-dialog.service';

/**
 * Created by adam on 27/12/2016.
 */
@NgModule({ declarations: [
        AddToListIconComponent,
        ListViewComponent,
        SearchResultComponent,
        EditedContentDirective,
        AppContainerComponent,
        AddToListDialogComponent,
    ],
    exports: [
        AddToListIconComponent,
        ListViewComponent,
        SearchResultComponent,
        AppContainerComponent,
    ], imports: [CommonModule,
        FormsModule,
        RouterModule,
        CommonComponentsModule], providers: [
        ListDialogService,
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class ListComponentsModule { }
