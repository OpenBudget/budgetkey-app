import { Directive, Input, ElementRef, HostListener, OnInit } from '@angular/core';

@Directive({
    selector: '[bkTooltip]',
})
export class BkTooltipDirective implements OnInit {

    @Input('bkTooltip') content: string;

    private tooltipEl: any;

    constructor(el: ElementRef) {
        this.tooltipEl = el.nativeElement;
        // el.nativeElement.classList.add('bk-tooltip-anchor');
    }

    ngOnInit() {
        this.tooltipEl.innerHTML += `<span class='bk-tooltip-anchor'><img src='assets/common/img/help.svg'>` +
            `<span class='bk-tooltip'>${this.content}</span></span>`;
    }
}
