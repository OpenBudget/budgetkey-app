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
  sourceFiles: {url: string, name: string}[] = [];
  amount = 0;

  constructor(public globalSettings: GlobalSettingsService, private itemApi: ItemApiService) { }

  ngOnChanges() {
    let children = this.item.children;
    if (children) {
      this.totalValue = 0;
      children.forEach((child: any) => {
        // Revenues are stored as negative amounts in some sources
        child.value = Math.abs(child.executed || child.revised || child.allocated || 0);
        this.totalValue += child.value;
      });      
      children = children.sort((a: any, b: any) => b.value - a.value)
      children.forEach((child: any) => {
        child.pct = (child.value / this.totalValue * 100) + '%';
        child.value = this.format.ils(child.value);
        child.s_value = child.value;
      });
      this.item.children = children;
    }
    this.amount = Math.abs(this.item.allocated || this.item.revised || this.item.executed || 0);
    const yearHistory = (this.item.history || []).find((h: any) => h.year === this.item.year);
    const sourceFiles: string[] = this.item.source_files || yearHistory?.source_files || [];
    this.sourceFiles = sourceFiles.map((url) => ({url, name: this.sourceFileName(url)}));
    this.itemApi.setQuestions(questions);
  }

  // 'https://.../budget%202024.xlsx#sheet-הוצאות' => 'budget 2024.xlsx (גיליון הוצאות)'
  sourceFileName(url: string): string {
    const [path, fragment] = url.split('#');
    let name = path.split('/').pop() || url;
    try {
      name = decodeURIComponent(name);
    } catch (e) {}
    if (fragment?.startsWith('sheet-')) {
      let sheet = fragment.substring('sheet-'.length);
      try {
        sheet = decodeURIComponent(sheet);
      } catch (e) {}
      name += ` (גיליון ${sheet})`;
    }
    return name;
  }
}
