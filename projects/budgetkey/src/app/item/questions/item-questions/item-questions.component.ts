import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BudgetKeyItemService } from '../../budgetkey-item.service';
import { PreparedQuestion } from '../../model';
import { GlobalSettingsService } from '../../../common-components/global-settings.service';
import { QuestionsManager } from '../questions-manager';

@UntilDestroy()
@Component({
  selector: 'app-item-questions',
  templateUrl: './item-questions.component.html',
  styleUrls: ['./item-questions.component.less']
})
export class ItemQuestionsComponent implements OnChanges, OnInit {

  @Input() item: any;
  @Input() label = 'הורדת<br/>נתונים';
  @Input() manager: QuestionsManager;

  isSearching: boolean;

  redashUrl: string;
  downloadUrl: string;
  downloadUrlXlsx: string;

  @ViewChild('btnToggleItemQuest') btnToggleItemQuest: ElementRef;

  constructor(private itemService: BudgetKeyItemService, private globalSettings: GlobalSettingsService) {}

  ngOnInit(): void {
    this.manager.preparedQuestionsChange.pipe(
      untilDestroyed(this)
    ).subscribe(() => this.refresh()),
    this.manager.dataQueryChange.pipe(
      untilDestroyed(this)
    ).subscribe(() => this.refresh()),
    this.manager.dataReady.pipe(
      untilDestroyed(this)
    ).subscribe(() => {this.isSearching = false; })
  }

  ngOnChanges() {
    this.refresh();
  }

  selectQuestion(question: PreparedQuestion) {
    if (this.manager.currentQuestion !== question) {
      this.manager.currentQuestion = question;
      this.manager.currentParameters = question.defaults;
    }
  }

  private refresh() {
    if (!this.manager.currentQuestion) {
      this.redashUrl = '';
      this.downloadUrl = '';
      this.downloadUrlXlsx = '';
      return;
    }

    this.redashUrl = this.itemService.getRedashUrl(this.manager.dataQuery);

    // Create a filename - item name + current question, so for example:
    // wingate institute__annual summary of communications

    // For the name, take either name, title, page title
    let entityName = '';
    if (this.item.name) {
      entityName = this.item.name;
    } else if (this.item.title) {
      entityName = this.item.title;
    } else if (this.item.page_title) {
      entityName = this.item.page_title;
    }

    // Create the question
    let question = '';
    for (let i = 0; i < this.manager.currentQuestion.parsed.length; i++) {
      question = question + this.manager.currentQuestion.parsed[i].value;
    }

    const fileName = entityName + '__' + question;

    this.downloadUrl =
      this.itemService.getDownloadUrl(
          this.manager.dataQuery,
          'csv',
          this.manager.currentQuestion.originalHeaders || [],
          fileName
      );
    this.downloadUrlXlsx =
      this.itemService.getDownloadUrl(
          this.manager.dataQuery,
          'xlsx',
          this.manager.currentQuestion.originalHeaders || [],
          fileName
      );
    this.isSearching = true;
  }

  get currentParameters() {
    return this.manager.currentParameters;
  }

  setParameter(key: string, value: string) {
    const params = Object.assign({}, this.manager.currentParameters);
    params[key] = value;
    this.manager.currentParameters = params;
  }

}
