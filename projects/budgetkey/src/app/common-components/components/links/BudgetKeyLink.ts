import {Component, Inject, Input} from '@angular/core';

export let LINK_TEMPLATE = '<a href="{{href}}" target="{{target}}" (click)="_onClick($event)">{{linkTitle}}</a>';

declare let window: any;

export class BudgetKeyLink {
    href = '#';
    target = '';
    handleClick: () => PromiseLike<any>;

    constructor () { }

    onInit (blank: boolean, handleClick: () => PromiseLike<any>) {
        if (blank) {
            this.target = '_blank';
        } else {
            this.target = '_self';
        }
        this.handleClick = handleClick;
    }

    _onClick($event: Event) {
        if (this.handleClick) {
            this.handleClick()
                .then((value: any) => {
                    window.open(this.href, this.target);
                });
            $event.preventDefault();
        }
    }
}
