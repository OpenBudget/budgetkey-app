import { Component, Input } from '@angular/core';
import questions from '../questions';

@Component({
  selector: 'app-item-budget-func',
  templateUrl: './item-budget-func.component.html',
  styleUrls: ['./item-budget-func.component.less']
})
export class ItemBudgetFuncComponent {
  @Input() item: any;

  questions = questions;
}
