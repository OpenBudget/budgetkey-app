import { HttpClient } from '@angular/common/http';
import {Component, ViewEncapsulation, Input} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalSettingsService } from '../../global-settings.service';

@Component({
    selector: 'app-container',
    templateUrl: './app-container.component.html',
})
export class AppContainerComponent {
    @Input() showHeader = true;
    @Input() showFooter = true;
    @Input() showSearchBar = false;
    @Input() showLanguages = false;
    @Input() helpWidget = true;

    configured = false;

    constructor(private http: HttpClient, private route: ActivatedRoute, private globalSettings: GlobalSettingsService) {
        route.queryParams.subscribe((params: any) => {
            console.log('params', params);
            const theme = params.theme || 'budgetkey';
            const lang = params.lang || 'he';
            this.http.get(`/assets/themes/theme.${theme}.${lang}.json`).pipe(

            ).subscribe((response: any) => {
                const config = Object.assign({}, 
                    response.BUDGETKEY_APP_GENERIC_ITEM_THEME || {},
                    response.BUDGETKEY_NG2_COMPONENTS_THEME || {}
                );
                globalSettings.theme = config;
                globalSettings.lang = lang;
                globalSettings.themeId = theme;
                this.configured = true;
                globalSettings.ready.next();
            });
        });
    }
}
