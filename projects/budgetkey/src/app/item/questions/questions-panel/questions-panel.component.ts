import { Component, ElementRef, Inject, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { GlobalSettingsService } from '../../../common-components/global-settings.service';
import { Question } from '../../model';
import { QuestionsManager } from '../questions-manager';
import { BudgetKeyItemService } from '../../budgetkey-item.service';

@Component({
  selector: 'app-questions-panel',
  templateUrl: './questions-panel.component.html',
  styleUrls: ['./questions-panel.component.less']
})
export class QuestionsPanelComponent implements OnChanges {

  @Input() item: any;
  @Input() questions: Question[] = [];

  @ViewChild('questionsPanel') questionsPanel: ElementRef;
  @ViewChild('dataTable') dataTable: ElementRef;

  questionsManager: QuestionsManager;

  constructor(public globalSettings: GlobalSettingsService, private itemService: BudgetKeyItemService) { }

  ngOnChanges() {
    this.questionsManager = new QuestionsManager(this.item, this.questions, this.itemService, this.globalSettings);
  }

  mailto() {
    const subject = `קישור למידע מאתר "${this.globalSettings.theme.siteName}"`;
    const body = `שלום.

העמוד ״${document.title}״ נשלח אליכם ממכשיר נייד.
לחצו כאן לצפייה בעמוד: ${window.location.href}`;
    return 'mailto:?' +
      'subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body)
    ;
  }

  scrollToTable() {
    const questionsPanelElement = this.questionsPanel.nativeElement as HTMLElement;
    if (questionsPanelElement && questionsPanelElement.scrollIntoView) {
      questionsPanelElement.scrollIntoView({behavior: 'smooth'});
    }
  }

}
