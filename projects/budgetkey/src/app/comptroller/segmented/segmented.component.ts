import { AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone, OnChanges, OnDestroy, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { PlatformService } from '../../common-components/platform.service';

export interface SegmentedOption {
  key: string;
  label: string;
}

// A row of pills where one is selected; the selection slides from pill to pill
@Component({
  selector: 'app-segmented',
  templateUrl: './segmented.component.html',
  styleUrls: ['./segmented.component.less'],
  standalone: false
})
export class SegmentedComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() options: SegmentedOption[] = [];
  @Input() value = '';
  @Input() label = '';
  @Output() valueChange = new EventEmitter<string>();

  @ViewChild('row') row: ElementRef<HTMLElement>;
  @ViewChildren('pill') pills: QueryList<ElementRef<HTMLElement>>;

  // The thumb's place, in pixels from the row's left edge; null until measured (and on the server)
  thumb: {left: number, width: number} | null = null;
  private resize?: ResizeObserver;

  constructor(private ps: PlatformService, private zone: NgZone) {}

  ngOnChanges() {
    this.measure();
  }

  ngAfterViewInit() {
    this.ps.browser(() => {
      this.measure();
      // Web fonts and screen width change the pills' sizes
      this.resize = new ResizeObserver(() => this.zone.run(() => this.measure()));
      this.resize.observe(this.row.nativeElement);
    });
  }

  ngOnDestroy() {
    this.resize?.disconnect();
  }

  select(key: string) {
    if (key !== this.value) {
      this.value = key;
      this.valueChange.emit(key);
      this.measure();
    }
  }

  private measure() {
    this.ps.browser(() => {
      requestAnimationFrame(() => this.zone.run(() => {
        const index = this.options.findIndex((o) => o.key === this.value);
        const pill = this.pills?.get(index)?.nativeElement;
        this.thumb = pill ? {left: pill.offsetLeft, width: pill.offsetWidth} : null;
      }));
    });
  }
}
