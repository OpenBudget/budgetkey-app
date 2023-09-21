import { Component, Input, OnInit } from '@angular/core';
import { Question } from '../../model';
import { ItemApiService } from '../../item-api.service';

@Component({
  selector: 'app-simple-item',
  templateUrl: './simple-item.component.html',
  styleUrls: ['./simple-item.component.less']
})
export class SimpleItemComponent implements OnInit{
  @Input() item: any;
  @Input() questions: Question[];

  constructor(private api: ItemApiService) { }

  ngOnInit(): void {
    if (this.questions) {
      this.api.setQuestions(this.questions);
    }
  }
}
