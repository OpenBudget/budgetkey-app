import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { linkParts, LinkPart } from '../comptroller';

// Plain text with its bare URLs as links
@Component({
    selector: 'app-linked-text',
    template: `@for (p of parts; track $index) {@if (p.href) {<a [href]='p.href' target='_blank' rel='noopener'>{{ p.text }}</a>} @else {{{ p.text }}}}`,
    styles: [`a { overflow-wrap: anywhere; }`],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class LinkedTextComponent implements OnChanges {
  @Input() text: string | null | undefined;

  parts: LinkPart[] = [];

  ngOnChanges() {
    this.parts = linkParts(this.text);
  }
}
