import { AfterViewInit, Directive, ElementRef, EventEmitter, Output } from '@angular/core';

@Directive({
    selector: '[clickOnReturn]',
    standalone: false
})
export class ClickOnReturnDirective implements AfterViewInit{
  @Output() activated = new EventEmitter<Event>();

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    const el = this.el.nativeElement;
    el.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.keyCode === 13 || event.keyCode === 32) {
        event.preventDefault();
        this.activated.emit(event);
      }
    });
    el.addEventListener('click', (event: MouseEvent) => {
      event.stopPropagation();
      this.activated.emit(event);
    });
    el.setAttribute('tabindex', '0');
    if (el.tagName !== 'button' && !el.getAttribute('role')) {
      el.setAttribute('role', 'button');
    }
  }

}
