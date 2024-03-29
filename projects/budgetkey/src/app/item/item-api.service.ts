import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { EMPTY, Subject, catchError, map, tap } from 'rxjs';
import { GlobalSettingsService } from '../common-components/global-settings.service';
import { Router } from '@angular/router';
import { PlatformService } from '../common-components/platform.service';
import { REQUEST } from '../../express.tokens';
import { Request } from 'express';

@Injectable()
export class ItemApiService {

  questions = new Subject<any[] | null>()

  constructor(private http: HttpClient, private globalSettings: GlobalSettingsService, private router: Router, private ps: PlatformService, @Optional() @Inject(REQUEST) private request: Request) {}

  fetchItem(id: string) {
    return this.http.get('https://next.obudget.org/get/' + id).pipe(
      map((res: any) => res.value),
      map((item: any) => {
        if (item.__redirect) {
          const to = `/i/${item.__redirect}`;
          this.ps.browser(() => {
            this.router.navigateByUrl(to);
          });
          this.ps.server(() => {
            this.request?.res?.redirect(to);
          });
          return null;
        }
        return item;
      }),
      catchError((err: any) => {
        if (err?.status === 404) {
          this.ps.server(() => {
            this.request?.res?.status(404);
          });
          this.router.navigate(['/not-found'], {queryParamsHandling: 'preserve', replaceUrl: true});
        }    
        return EMPTY;
      })
    );
  }

  setQuestions(questions: any[]) {
    this.questions.next(questions)
  }
}
