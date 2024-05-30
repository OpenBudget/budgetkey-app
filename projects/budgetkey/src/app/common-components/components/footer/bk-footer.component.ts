import {Component, Inject, Input, OnInit} from '@angular/core';
import { GlobalSettingsService } from '../../global-settings.service';
// const Smooch: any = require('smooch');
declare const Smooch: any;

@Component({
    selector: 'app-bk-footer',
    templateUrl: './bk-footer.component.html',
    styleUrls: ['./bk-footer.component.less'],
})
export class BkFooterComponent implements OnInit {
    public hasadnaUrl = 'http://www.hasadna.org.il/';

    @Input() helpWidget = true;

    constructor (public globalSettings: GlobalSettingsService) { }

    about(hash: string) {
        let ret = '/about';
        if (this.globalSettings.theme.themeId) {
            ret += '?theme=' + this.globalSettings.theme.themeId;
        }
        if (hash) {
            ret += '#' + hash;
        }
        return ret;
    }

    ngOnInit() {
    }
}
