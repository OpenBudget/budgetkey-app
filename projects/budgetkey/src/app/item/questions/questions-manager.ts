import { ReplaySubject } from "rxjs";
import { PreparedQuestion, PreparedQuestionFragment, PreparedQuestions, Question, Questions } from "../model";
import { BudgetKeyItemService } from "../budgetkey-item.service";
import { QuestionParser } from "./question-parser";
import { GlobalSettingsService } from "../../common-components/global-settings.service";

export class QuestionsManager {
  
  _preparedQuestions: PreparedQuestions = [];
  _currentQuestion: PreparedQuestion;
  _currentParameters: any = {};
  
  preparedQuestionsChange = new ReplaySubject(1);
  dataQueryChange = new ReplaySubject(1);
  dataReady = new ReplaySubject<{headers: any, data: any, err?: any, total?: any, graphLayout?: any, graphData?: any}>(1);
  
  loading = false;
  
  constructor(private item: any, private questions: Question[], private itemService: BudgetKeyItemService, private globalSettings: GlobalSettingsService) {
    this.preparedQuestions = this.parseQuestions(questions, item);
  }
  
  set preparedQuestions(value) {
    this._preparedQuestions = value;
    if (value) {
      this.currentQuestion = this.currentQuestion || value[0];
    }
  }
  
  get preparedQuestions() {
    return this._preparedQuestions || [];
  }
  
  set currentQuestion(value: PreparedQuestion) {
    if (value !== this._currentQuestion) {
      this._currentQuestion = value;
      if (value) {
        this.currentParameters = value.defaults;
      }
    }
  }
  
  get currentQuestion() {
    return this._currentQuestion;
  }
  
  get currentParameters(): any {
    return this._currentParameters;
  }
  
  set currentParameters(value: any) {
    this._currentParameters = value;
    
    this.doQuery();
    this.dataQueryChange.next(null);
  }
  
  get dataQuery(): string {
    const parameters: any = {};
    const context = this.item || {};
    Object.keys(this._currentParameters || {}).forEach((key: string) => {
      const value = this._currentParameters[key];
      parameters[key] = this.currentQuestion.parameters[key][value];
    });
    const query = this.formatQuery(this.currentQuestion.query, parameters);
    return this.formatQuery(query, context);
  }
  
  doQuery() {
    if (!this.currentQuestion) {
      return;
    }
    this.loading = true;
    this.dataReady.next({headers: [], data: [], total: 0});
    const headersOrder = Array.from(this.currentQuestion.headers);
    const formatters = this.currentQuestion.formatters;
    this.itemService.getItemData(this.dataQuery, headersOrder, formatters)
    .subscribe({
      next: (data: any) => {
        if (data && data.query === this.dataQuery) {
          this.loading = false;
          if (data.total && this.currentQuestion.graphFormatter) {
            const {graphLayout, graphData} = this.getGraphFormatter(this.currentQuestion.graphFormatter)(data.rows);
            this.dataReady.next({headers: data.headers, data: data.items, total: data.total, graphLayout, graphData});
          } else {
            this.dataReady.next({headers: data.headers, data: data.items, total: data.total});
          }
        }
      },
      error: (err) => {
        console.log('QUERY ERROR', err);
        this.loading = false;
        this.dataReady.next({headers: [], data: [], err});
      }
    });
  }
  
  getField(obj: any, field: string) {
    const parts = field.split('.');
    let result = obj;
    for (const part of parts) {
      result = result[part];
      if (result === undefined) {
        return undefined;
      }
    }
    return result;
  }

  formatQuery(query: string | string[], parameters: any): string {
    // TODO: Escape parameters (needs to be discussed)
    if (query instanceof Array) {
      query = (<string[]>query).join(' ');
    }
    return (<string>query).replace(/:([a-z][a-z0-9_.]*)/ig, (match, name) => {
      // return _.get(parameters, name) ? _.get(parameters, name) : match;
      return this.getField(parameters, name) || match;
    });
  }
  
  parseQuestions(questions: Questions, parameters: any): PreparedQuestions {
    QuestionParser.processQuestions(questions, this.globalSettings.themeId);
    return questions.map((question: Question) => {
      const result = new PreparedQuestion();
      if (Array.isArray(question.query)) {
        question.query = (<string[]>question.query).join(' ');
      }
      Object.assign(result, question);
      
      let s = this.formatQuery(question.text, parameters);
      const parsed = [];
      let lastText: any = null;
      while (true) {
        const pattern = /<([a-z0-9-_]+)>/ig;
        const match = pattern.exec(s);
        if (match === null) {
          break;
        }
        const name = match[1];
        if (question.parameters.hasOwnProperty(name)) {
          if (Object.values(question.parameters[name]).length > 0) {
            const fragment = s.slice(0, match.index);
            if (fragment !== '') {
              if (lastText) {
                lastText.value += fragment;
                lastText = null;
              } else {
                const pqf = new PreparedQuestionFragment();
                parsed.push(Object.assign(pqf, {
                  isText: true,
                  isParameter: false,
                  value: fragment
                }));
              }
            }
            const pqf = new PreparedQuestionFragment();
            parsed.push(Object.assign(pqf, {
              isText: false,
              isParameter: true,
              name: name,
              value: question.defaults ? question.defaults[name] : Object.keys(question.parameters[name])[0],
              values: question.parameters[name]
            }));
            s = s.slice(match.index + match[0].length);
          }
        } else {
          const fragment = s.slice(0, match.index + match[0].length);
          if (fragment !== '') {
            if (lastText) {
              lastText.value += fragment;
            } else {
              const lastText = Object.assign(new PreparedQuestionFragment(), {
                isText: true,
                isParameter: false,
                value: fragment
              });
              parsed.push(lastText);
            }
          }
          s = s.slice(match.index + match[0].length);
        }
      }
      if (s !== '') {
        const pqf = new PreparedQuestionFragment();
        parsed.push(Object.assign(pqf, {
          isText: true,
          isParameter: false,
          value: s
        }));
      }
      
      result.parsed = parsed;
      result.defaults = Object.fromEntries(parsed
        .filter((item: any) => item.isParameter)
        .map((item: any) => [item.name, item.value]))
      Object.assign(result.defaults, question.defaults);
      return result;
    });
  }
  
  getGraphFormatter(formatter: any) {
    if (formatter.type === 'bars') {
      return (items: any[]) => {
        const graphLayout = {barmode: 'stack'};
        const graphData = formatter.series.map((s: any) => {
          return {
            type: 'bar',
            name: s.display || s.field,
            x: items.map((x) => x[formatter.x_field]),
            y: items.map((x) => x[s.field]),
          };
        });
        return {graphLayout, graphData};
      };
    }
    return (items: any[]) => { return {graphLayout: {}, graphData: {}}; };
  }
}
