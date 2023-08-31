import { Component } from '@angular/core';
import { GlobalSettingsService } from '../../common-components/global-settings.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.less']
})
export class SearchPageComponent {

  init = false;

  constructor(private globalSettings: GlobalSettingsService) {
    globalSettings.ready.subscribe(() => {
      this.init = true;
    });
  }
}
