import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Question } from '../../model';
import { Format } from '../../../format';
import { ItemApiService } from '../../item-api.service';
import questions from './questions';

@Component({
  selector: 'app-base-org-item',
  templateUrl: './base-org-item.component.html',
  styleUrls: ['./base-org-item.component.less']
})
export class BaseOrgItemComponent implements OnInit {
  @Input() item: any;

  @Input() overrideText = false;

  format = new Format();

  constructor(private api: ItemApiService) { }

  ngOnInit(): void {
    this.api.setQuestions(questions);
  }
}
