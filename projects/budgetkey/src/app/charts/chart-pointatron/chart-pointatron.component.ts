import { Component, Input, OnInit } from '@angular/core';
import { hierarchy, pack } from 'd3-hierarchy';

@Component({
  selector: 'app-chart-pointatron',
  templateUrl: './chart-pointatron.component.html',
  styleUrls: ['./chart-pointatron.component.less']
})
export class ChartPointatronComponent implements OnInit {  
  @Input() public data: any;
  
  roots: any[] = [];
  MAX_RADIUS = 5;
  MAX_AMOUNT = 2500;
  
  constructor() {}
  
  ngOnInit() {
    for (const v of this.data.values) {
      let amount = v.amount;
      if (amount > this.MAX_AMOUNT) {
        amount = this.MAX_AMOUNT;
      }
      let root: any = {
        title: v.title,
        amount: v.amount,
        color: v.color,
        scale: 1,
      };
      if (amount > 0) {
        const nodes: any = [];
        for (let i = 0 ; i < amount ; i ++) {
          nodes.push({value: 0.75 + 0.5 * Math.random(), i: i});
        }
        const root_: any = {
          children: nodes
        };
        const root__ = hierarchy(root_);
        root__.sum((d: any) => d.value).sort((a: any, b: any) => b.value - a.value);
        const layout = pack().size([200, 200]);
        layout(root__);
        const children = root__.children || []
        if (children && children.length > 0) {
          const lastChild: any = children[children.length - 1];
          const radius = lastChild['r'];
          root__.sort((a: any, b: any) => b.i - a.i);
          layout(root__);
          let scale = 1;
          if (radius > this.MAX_RADIUS) {
            scale = radius / this.MAX_RADIUS;
          }
          root = Object.assign(root, root__);
          root['radius'] = radius;
          root['scale'] = scale;  
        }
      }
      this.roots.push(root);
    }
  }
  
}
