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
        // if (Smooch && this.helpWidget) {
        //     Smooch.init({
        //         appId: '579deb5e8975e33e008f7067',
        //         displayStyle: 'button',
        //         customText: {
        //           headerText: '?אפשר לעזור',
        //           inputPlaceholder: 'כתבו לנו הודעה...',
        //           sendButtonText: 'לשלוח',
        //           introductionText: 'אתם מוזמנים לשאול אותנו הכל ומישהו' +
        //             ' מצוות המתנדבים שלנו ישתדל לענות כמה שיותר מהר. ' +
        //             'מכיוון שאנו לא תמיד זמינים, אתם מוזמנים להשאיר לנו ' +
        //             'גם כתובת מייל בכדי שנוכל לחזור אליכם כשנראה את ההודעה.',
        //         },
        //     }).then(() => {
        //         console.log('Smooch init');
        //     });
        // }
    }
}
