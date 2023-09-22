export class Question {
    text: string;
    query: string | string[];
    parameters: any = {};
    defaults: any | null = {};
    headers: string[];
    formatters: any[] = [];
    originalHeaders: string[];
    graphFormatter: string;
  }

  export class PreparedQuestionFragment {
    public isText = false;
    public isParameter = false;
    public value = '';
    public name = '';
    public values: any = {};

    valueKeys() {
      return Object.keys(this.values);
    }
}

  export class PreparedQuestion extends Question {
    parsed: PreparedQuestionFragment[] = [];
    override defaults: any = {};  // key-value pairs of default values for each parameter
  }

  export type Questions = Question[];
  export type PreparedQuestions = PreparedQuestion[];
