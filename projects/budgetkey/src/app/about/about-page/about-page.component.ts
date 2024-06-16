import { HttpClient } from '@angular/common/http';
import { Component, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import * as Showdown from 'showdown';
import { GlobalSettingsService } from '../../common-components/global-settings.service';
import { switchMap } from 'rxjs';
import { PlatformService } from '../../common-components/platform.service';
import { ActivatedRoute, Data } from '@angular/router';


@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.less']
})
export class AboutPageComponent {
  converter: Showdown.Converter;
  html: SafeHtml;

  constructor(private globalSettings: GlobalSettingsService, private http: HttpClient, private domSanitizer: DomSanitizer, private ps: PlatformService, private route: ActivatedRoute) {

    Showdown.extension('ariaLabelLinks', () => {
      return [
        {
          type: 'output',
          regex: /<a href="([^"]+)"(.*?)>(.*?)<\/a>/g,
          replace: (match: any, href: string, otherAttributes: string, linkText: string) => {
            // Customize the aria-label based on your requirements
            let ariaLabel: string | null = null;
            if (linkText.indexOf('<') >= 0) {
              // find alt="...." in the linkText
              let alt = linkText.match(/alt="([^"]+)"/);
              if (alt) {
                ariaLabel = alt[1];
              }
            } else {
              ariaLabel = linkText;
            }
            if (ariaLabel) {
              ariaLabel = href.indexOf('//') > 0 ? `מעבר לאתר אחר - ${ariaLabel} בטאב חדש` : `מעבר לעמוד ${ariaLabel} בטאב חדש`;
              ariaLabel = ariaLabel.split('"').join('\'');
              return `<a href="${href}"${otherAttributes} aria-label="${ariaLabel}">${linkText}</a>`;  
            } else {
              return `<a href="${href}"${otherAttributes}>${linkText}</a>`;
            }
          }
        }
      ];
    });

    this.converter = new Showdown.Converter({
      extensions: ['ariaLabelLinks'],
      customizedHeaderId: true,
      openLinksInNewWindow: true,
    });

    this.globalSettings.ready.pipe(
      switchMap(() => this.route.data),
      switchMap((data: Data) => {
        if (data['a11y']) {
          return this.http.get(ps.BASE + `/assets/about/a11y.md`, {responseType: 'text'})
        }
        return this.http.get(ps.BASE + `/assets/about/${this.globalSettings.themeId}.md`, {responseType: 'text'})
      })
    ).subscribe((text: string) => {
        this.html = this.domSanitizer.bypassSecurityTrustHtml(this.converter.makeHtml(text));
        return this.html;
    });
  }
}
