import { HttpClient } from '@angular/common/http';
import {Component, ViewEncapsulation, Input} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalSettingsService } from '../../global-settings.service';
import { distinct, distinctUntilChanged, map, switchMap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PlatformService } from '../../platform.service';

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

    configured = false;

    constructor(private http: HttpClient, private route: ActivatedRoute, private globalSettings: GlobalSettingsService, private ps: PlatformService) {
        globalSettings.ready.subscribe(() => {
            this.configured = true;
        });
        globalSettings.init(this, route);
    }
}
