import {Component, Input, Output, EventEmitter, OnChanges, OnInit} from '@angular/core';


@Component({
    selector: 'app-bk-sub-star',
    templateUrl: './bk-subscribe-star.component.html',
    styleUrls: ['./bk-subscribe-star.component.less'],
})
export class BkSubscribeStar implements OnInit {
    @Input() enabled = true;
    @Input() active = true;
    @Output() clicked = new EventEmitter<any>();

    constructor () {}

    ngOnInit() {
    }

    click(e: any) {
        this.clicked.next(e);
    }
}
