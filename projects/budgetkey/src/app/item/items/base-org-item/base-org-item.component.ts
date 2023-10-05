import { Component, Input } from '@angular/core';
import { Question } from '../../model';
import { Format } from '../../../format';
import { ItemApiService } from '../../item-api.service';
import questions from './questions';

@Component({
  selector: 'app-base-org-item',
  templateUrl: './base-org-item.component.html',
  styleUrls: ['./base-org-item.component.less']
})
export class BaseOrgItemComponent {
  @Input() item: any;

  @Input() overrideText = false;
  @Input() overrideAmount = false;

  format = new Format();

  constructor(private api: ItemApiService) { }

  ngOnInit(): void {
    this.api.setQuestions(questions);
  }
}
