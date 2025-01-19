import { Component, Input, OnChanges } from '@angular/core';
import { Format } from '../../../format';
import { GlobalSettingsService } from '../../../common-components/global-settings.service';
import questions from './questions';
import { ItemApiService } from '../../item-api.service';

@Component({
    selector: 'app-item-muni-budget',
    templateUrl: './item-muni-budget.component.html',
    styleUrls: ['./item-muni-budget.component.less'],
    standalone: false
})
export class ItemMuniBudgetComponent implements OnChanges {

  @Input() item: any;

  format = new Format();
  totalValue = 0;

  constructor(public globalSettings: GlobalSettingsService, private itemApi: ItemApiService) { }

  ngOnChanges() {
    let children = this.item.children;
    if (children) {
      this.totalValue = 0;
      children.forEach((child: any) => {
        child.value = child.executed || child.revised || child.allocated;
        this.totalValue += child.value;
      });      
      children = children.sort((a: any, b: any) => b.value - a.value)
      children.forEach((child: any) => {
        child.pct = (child.value / this.totalValue * 100) + '%';
        child.value = this.format.ils(child.value);
      });
      this.item.children = children;
    }
    this.itemApi.setQuestions(questions);
  }
}
