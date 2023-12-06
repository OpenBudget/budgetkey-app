import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, Output, signal } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, first, fromEvent, timer } from 'rxjs';

@UntilDestroy()
@Directive({
  selector: '[editedContent]'
})
export class EditedContentDirective implements AfterViewInit {

  @Input() editedContent: boolean;
  @Output() updated = new EventEmitter<string>();

  active = false;

  constructor(private el_: ElementRef) {
  }

  ngAfterViewInit(): void {
    const el = this.el;
    el.style.cursor = 'edit';
    el.style.display = 'inline';
    el.style.whiteSpace = 'pre-wrap';

    fromEvent(el, 'click').pipe(
      untilDestroyed(this),
    ).subscribe(() => {
      if (this.editedContent) {
        this.edit();
      }
    });
    fromEvent(el, 'keydown').pipe(
      untilDestroyed(this),
      filter((ev: Event) => (ev as KeyboardEvent).key === 'Enter'),
    ).subscribe((ev) => {
      if (!this.active) {
        this.edit();
      } else {
        el.blur();
        ev.preventDefault()
      }
    });
  }

  get el(): HTMLElement {
    return this.el_.nativeElement;
  }

  edit() {
    const el = this.el;
    if (!this.active) {
      this.active = true;
      el.contentEditable = 'true';
      el.focus();
      fromEvent(el, 'blur').pipe(first()).subscribe(() => {
        el.contentEditable = 'false';
        this.active = false;
        const text = el.innerText;
        timer(0).subscribe(() => {
          this.updated.emit(text);
        });
      });    
    }
  }
}
