import { Directive, Input, ElementRef, HostListener, OnInit } from '@angular/core';

@Directive({
    selector: '[bkTooltip]',
    standalone: false
})
export class BkTooltipDirective implements OnInit {

    @Input('bkTooltip') content: string;

    private tooltipEl: any;

    constructor(el: ElementRef) {
        this.tooltipEl = el.nativeElement;
        // el.nativeElement.classList.add('bk-tooltip-anchor');
    }

    ngOnInit() {
        const html = this.tooltipEl.innerHTML || '';
        if (html.indexOf('bk-tooltip-anchor') === -1) {
            this.tooltipEl.innerHTML += `<span class='bk-tooltip-anchor'><img src='assets/common/img/help.svg'>` +
                `<span class='bk-tooltip'>${this.content}</span></span>`;
        }
    }
}
