import { Inject, Injectable } from "@angular/core";
import { NgxSeo, NgxSeoService } from "@avivharuzi/ngx-seo";
import { GlobalSettingsService } from "./global-settings.service";
import { DomSanitizer, Meta, SafeUrl } from "@angular/platform-browser";
import { DOCUMENT } from "@angular/common";

@Injectable()
export class SeoService {
  
  twitterShare: SafeUrl;
  fbShare: SafeUrl;
  whatsappShare: SafeUrl;
  scrolledOnce = false;
  shareData: { text: any; url: string; };

  constructor(private seo: NgxSeoService, private globalSettings: GlobalSettingsService, 
    private sanitizer: DomSanitizer, @Inject(DOCUMENT) private document: any) {}

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
    this.seo.setTitle(title);
    this.seo.setMetaSiteName(this.globalSettings.siteName + '');
    this.seo.setMetaCanonical(canonical);
    this.seo.setMetaUrl(canonical);
    this.seo.setMetaCustomTags([
      { itemprop: 'name', content: title },                
    ]);
    const head = this.document.getElementsByTagName('head')[0];
    const link = head.querySelector('link[rel="canonical"]');
    link?.setAttribute('href', canonical);

    this.prepareShare(title.replace(this.globalSettings.siteName, '#מפתח_התקציב'), canonical);
  }

  prepareShare(shareText: string, url: string) {
    this.shareData = {
      text: shareText,
      url
    };
    this.twitterShare = this.sanitizer.bypassSecurityTrustUrl(`http://twitter.com/share?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`);
    this.fbShare = this.sanitizer.bypassSecurityTrustUrl(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
    this.whatsappShare = this.sanitizer.bypassSecurityTrustUrl(`https://wa.me/?text=${encodeURIComponent(shareText)} ${encodeURIComponent(url)}`);
  }

  async mobileShare() {
    try {
        await navigator.share(this.shareData);
    } catch (err) {
      console.log('Failed to share', err);
    }
  }

}