import { HttpClient } from '@angular/common/http';
import { Component, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import * as Showdown from 'showdown';
import { GlobalSettingsService } from '../../common-components/global-settings.service';
import { switchMap } from 'rxjs';


@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.less']
})
export class AboutPageComponent {
  converter: Showdown.Converter;
  html: SafeHtml;

  constructor(private globalSettings: GlobalSettingsService, private http: HttpClient, private domSanitizer: DomSanitizer) {
    this.converter = new Showdown.Converter({
      customizedHeaderId: true,
      openLinksInNewWindow: true,
    });

    this.globalSettings.ready.pipe(
      switchMap(() => this.http.get(`assets/about/${this.globalSettings.themeId}.md`, {responseType: 'text'}))
    ).subscribe((text) => {
        this.html = this.domSanitizer.bypassSecurityTrustHtml(this.converter.makeHtml(text));
        console.log('TEXT', text, this.html);
        return this.html;
    });
  }
}
