import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { timer } from 'rxjs';

@Component({
    selector: 'app-multi-select',
    templateUrl: './multi-select.component.html',
    styleUrls: ['./multi-select.component.less'],
    standalone: false
})
export class MultiSelectComponent implements OnInit {

  @Input() value: any[];
  @Input() options: {value: any; display: string}[] = [];
  @Input() id: string;
  @Input() title: string;
  @Output() valueChange = new EventEmitter<any>();
  @Output() changed = new EventEmitter<void>();

  @ViewChild('select') select: ElementRef;

  _visible = false;

  constructor() { }

  ngOnInit() {
  }

  fixEmpty() {
    if (!this.value || !Array.isArray(this.value) || this.value.length === 0) {
      if (this.options && this.options.length > 0) {
        this.value = [this.options[0].value];
      } else {
        this.value = [];
      }
    }
    if (this.value.length > 1 && this.value.indexOf(this.options[0].value) >= 0) {
      this.value = this.value.filter(value => value !== this.options[0].value);
    }
  }

  get _value() {
    this.fixEmpty();
    return this.value;
  }

  set _value(value: any[]) {
    this.value = value;
  }

  get display() {
    let display = '';
    let count = 0;
    for (const value of this.value) {
      for (const option of this.options) {
        if (option.value === value) {
          if (display.length + option.display.length < 60 || display.length === 0) {
            if (display.length > 0) {
              display += ', ';
            }
            display += option.display;  
          } else {
            count += 1;            
          }
          break;
        }
      }  
    }
    if (display.length === 0) {
      this._value = [];
    }
    if (count > 0) {
      display += `... (+${count})`;
    }
    return display;
  }

  set visible(visible: boolean) {
    this._visible = visible;
    if (visible) {
      timer(0).subscribe(() => {
        this.select.nativeElement.focus();
      });
    } else {
      this.fixEmpty();
      this.valueChange.emit(this.value);
      this.changed.emit();  
    }
  }

  get visible() {
    return this._visible;
  }

  keyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.visible = false;
    }
  }
}
