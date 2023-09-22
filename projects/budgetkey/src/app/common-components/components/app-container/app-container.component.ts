import { HttpClient } from '@angular/common/http';
import {Component, ViewEncapsulation, Input} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalSettingsService } from '../../global-settings.service';
import { distinct, distinctUntilChanged, map, switchMap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

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

    constructor(private http: HttpClient, private route: ActivatedRoute, private globalSettings: GlobalSettingsService) {
        route.queryParams.pipe(
            untilDestroyed(this),
            map((params: any) => {
                console.log('params', params);
                const themeId = params.theme || 'budgetkey';
                const lang = params.lang || 'he';
                return {themeId, lang};
            }),
            distinctUntilChanged((a, b) => {
                return a.themeId === b.themeId && a.lang === b.lang;
            }),
            switchMap(({themeId, lang}) => {
                return this.http.get(`/assets/themes/theme.${themeId}.${lang}.json`).pipe(
                    map((theme: any) => {
                        return {theme, themeId, lang};
                    })
                );
            })            
        ).subscribe(({theme, themeId, lang}) => {
            const theme_ = Object.assign({}, 
                theme.BUDGETKEY_APP_GENERIC_ITEM_THEME || {},
                theme.BUDGETKEY_NG2_COMPONENTS_THEME || {}
            );
            globalSettings.theme = theme_;
            globalSettings.lang = lang;
            globalSettings.themeId = themeId;
            this.configured = true;
            globalSettings.ready.next();
            globalSettings.ready.complete();
        });
    }
}
