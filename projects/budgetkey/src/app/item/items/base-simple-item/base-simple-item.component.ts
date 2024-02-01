import { Component, Input, OnInit } from '@angular/core';
import { Question } from '../../model';
import { ItemApiService } from '../../item-api.service';

@Component({
  selector: 'app-base-simple-item',
  templateUrl: './base-simple-item.component.html',
  styleUrls: ['./base-simple-item.component.less']
})
export class BaseSimpleItemComponent implements OnInit{
  @Input() item: any;
  @Input() questions: Question[];

  @Input() headerBorderColor: string;
  @Input() headerBgColor: string;
  @Input() headerPrimaryColor: string;
  @Input() headerSecondaryColor: string;

  constructor(private api: ItemApiService) { }

  ngOnInit(): void {
    if (this.questions) {
      this.api.setQuestions(this.questions);
    }
    if (this.item) {
      if (this.item.code) {
        this.item.child_code_len = this.item.code.length + 2;
      }
    }
  }
}
