import { Component, Input } from '@angular/core';
import questions from '../questions';
import questions_spending from '../questions_spending';

@Component({
  selector: 'app-item-budget0dig',
  templateUrl: './item-budget0dig.component.html',
  styleUrls: ['./item-budget0dig.component.less']
})
export class ItemBudget0digComponent {
  @Input() item: any;

  questions = [
    ...questions_spending,
    ...questions,
  ];
}
