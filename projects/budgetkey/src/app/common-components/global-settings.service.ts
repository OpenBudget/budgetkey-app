import { Injectable } from '@angular/core';
import { DEFAULT_THEME } from './theme.budgetkey.he';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class GlobalSettingsService {

  ready = new ReplaySubject<void>(1);
  
  constructor() { }

  lang = 'he';
  themeId = 'budgetkey';
  theme: any = DEFAULT_THEME;
}
