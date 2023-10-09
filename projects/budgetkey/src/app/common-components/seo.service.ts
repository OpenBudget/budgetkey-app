import { Inject, Injectable } from "@angular/core";
import { NgxSeo, NgxSeoService } from "@avivharuzi/ngx-seo";
import { GlobalSettingsService } from "./global-settings.service";
import { Meta } from "@angular/platform-browser";
import { DOCUMENT } from "@angular/common";

@Injectable()
export class SeoService {
  
  constructor(private seo: NgxSeoService, private globalSettings: GlobalSettingsService, @Inject(DOCUMENT) private document: any) {}

  setSeo(title: string, canonical: string) {
    // const seo: NgxSeo = {
    //   title: title,
    //   meta: {
    //       canonical: canonical,
    //       siteName: this.globalSettings.siteName + '1',
    //       customTags: [
    //           // { name: 'og:title', content: title },
    //           // { name: 'og:url', content: canonical },
    //           // { name: 'twitter:title', content: title },
    //           // { name: 'twitter:url', content: canonical },
    //           // { name: 'og:site_name', content: this.globalSettings.siteName },
    //           { itemprop: 'name', content: title },                
    //       ]
    //   }
    // };
    console.log('setSeo', title, this.globalSettings.siteName, canonical);
    this.seo.setTitle(title);
    this.seo.setMetaSiteName(this.globalSettings.siteName + '1');
    this.seo.setMetaCanonical(canonical);
    this.seo.setMetaUrl(canonical);
    this.seo.setMetaCustomTags([
      { itemprop: 'name', content: title },                
    ]);
    const head = this.document.getElementsByTagName('head')[0];
    const link = head.querySelector('link[rel="canonical"]');
    link?.setAttribute('href', canonical);
  }
}