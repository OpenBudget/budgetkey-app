import { Component, Input } from '@angular/core';
import { Question } from '../../model';
import { Format } from '../format';
import { ItemApiService } from '../../item-api.service';

@Component({
  selector: 'app-org-item',
  templateUrl: './org-item.component.html',
  styleUrls: ['./org-item.component.less']
})
export class OrgItemComponent {
  @Input() item: any;
  @Input() questions: Question[];

  @Input() overrideText = false;
  @Input() overrideAmount = false;

  format = new Format();

  constructor(private api: ItemApiService) { }

  ngOnInit(): void {
    if (this.questions) {
      this.api.setQuestions(this.questions);
    }
  }
}
