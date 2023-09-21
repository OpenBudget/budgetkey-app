import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-timeline-part',
  templateUrl: './timeline-part.component.html',
  styleUrls: ['./timeline-part.component.less']
})
export class TimelinePartComponent implements OnInit {
  @Input() size: number;
  @Input() padding: number;
  @Input() major: boolean;
  @Input() first: boolean;
  @Input() last: boolean;
  @Input() percent: number;

  radius: number;
  fill: string;
  bg: string;
  stroke: string;
  strokeWidth: number;

  constructor(public sanitizer: DomSanitizer) {}

  ngOnInit() {
      this.bg = '#FFFBF2';
      if (this.major) {
          this.radius = (this.size - 2) / 2;
          this.fill = '#FFFBF2';
          this.stroke = '#512C0A';
          this.strokeWidth = this.radius > 10 ? 2 : 1;
      } else {
          this.radius = 5;
          this.fill = '#D3C7B8';
          this.stroke = 'none';
          this.strokeWidth = 0;
      }
  }

  path() {
      const x = this.size / 2;
      const y = this.size;
      return `M${x},${y}L${x},${y + this.padding}`;
  }

  arc() {
      const rad = Math.PI * this.percent / 50;
      const large = this.percent >= 50 ? 1 : 0;
      const c = this.size / 2;
      let d = `M ${c} ${c - this.radius} `;
      d += `A ${this.radius} ${this.radius} 0 ${large} 1 `;
      const endX = c + this.radius * Math.sin(rad);
      const endY = c - this.radius * Math.cos(rad);
      d += `${endX} ${endY} `;
      d += `L ${c} ${c}`;
      return d;
  }
}
