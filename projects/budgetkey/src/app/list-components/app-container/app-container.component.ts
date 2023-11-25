import { HttpClient } from '@angular/common/http';
import {Component, ViewEncapsulation, Input} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalSettingsService } from '../../common-components/global-settings.service';
import { distinct, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PlatformService } from '../../common-components/platform.service';
import { ListContents, ListsService } from '../../common-components/services/lists.service';
import { LayoutService } from '../../common-components/layout.service';

@UntilDestroy()
@Component({
    selector: 'app-container',
    templateUrl: './app-container.component.html',
    styleUrls: ['./app-container.component.less'],
})
export class AppContainerComponent {
    @Input() showHeader = true;
    @Input() showFooter = true;
    @Input() showSearchBar = false;
    @Input() showLanguages = false;
    @Input() helpWidget = true;
    @Input() listSideView = false;

    configured = false;

    constructor(private route: ActivatedRoute, private globalSettings: GlobalSettingsService, public lists: ListsService, public layout: LayoutService) {
        this.globalSettings.ready.subscribe(() => {
            this.configured = true;
        });
        this.globalSettings.init(this, this.route);
        this.route.queryParams.pipe(
            untilDestroyed(this),
            map((params) => params['list']),
            distinctUntilChanged(),
            tap((list) => {
                if (!list) {
                    this.lists.currentList.set(null);
                }
            }),
            filter((list) => !!list),
            map((list) => list.split(':')),
            switchMap((parts) => this.lists.getAnonymous(parts[0], parts[1])),
        ).subscribe((list) => {
            this.lists.currentList.set(list);
        });
    }
}
