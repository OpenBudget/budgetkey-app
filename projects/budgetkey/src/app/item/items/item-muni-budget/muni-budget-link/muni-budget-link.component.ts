import { Component, Input } from '@angular/core';
import { GlobalSettingsService } from '../../../../common-components/global-settings.service';

@Component({
    selector: 'app-muni-budget-link',
    templateUrl: './muni-budget-link.component.html',
    styleUrls: ['./muni-budget-link.component.less'],
    standalone: false
})
export class MuniBudgetLinkComponent {
    @Input() item: any;
    @Input() entry: any;

    constructor(private globalSettings: GlobalSettingsService) {}

    public get href() {
        return `/i/muni_budgets/${this.item.muni_code}/${this.entry.code}/${this.item.year}?theme=${this.globalSettings.themeId}`;
    }
}
