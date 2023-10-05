import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, map } from 'rxjs';
import { GlobalSettingsService } from '../common-components/global-settings.service';

@Injectable()
export class ItemApiService {

  questions = new Subject<any[] | null>()

  constructor(private http: HttpClient, private globalSettings: GlobalSettingsService) {}

  fetchItem(id: string) {
    return this.http.get('https://next.obudget.org/get/' + id).pipe(
      map((res: any) => res.value)
    );
  }

  setQuestions(questions: any[]) {
    this.questions.next(questions)
  }
}
