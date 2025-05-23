import { Component, Input, signal } from '@angular/core';
import { Subscription, timer, switchMap, fromEvent, EMPTY, take } from 'rxjs';
import { SeoService } from '../../seo.service';
import { WindowService } from '../../window.service';

@Component({
    selector: 'app-share-widget',
    templateUrl: './share-widget.component.html',
    styleUrl: './share-widget.component.less',
    standalone: false
})
export class ShareWidgetComponent {

  @Input() color: string;

  D = "M27.293 18.2928C27.4805 18.1053 27.7348 18 28 18C28.2652 18 28.5195 18.1053 28.707 18.2928L31.707 21.2928C31.8892 21.4814 31.99 21.734 31.9877 21.9962C31.9854 22.2584 31.8802 22.5092 31.6948 22.6946C31.5094 22.88 31.2586 22.9852 30.9964 22.9875C30.7342 22.9897 30.4816 22.8889 30.293 22.7068L29 21.4138V30.9998C29 31.265 28.8946 31.5194 28.7071 31.7069C28.5196 31.8944 28.2652 31.9998 28 31.9998C27.7348 31.9998 27.4804 31.8944 27.2929 31.7069C27.1054 31.5194 27 31.265 27 30.9998V21.4138L25.707 22.7068C25.5184 22.8889 25.2658 22.9897 25.0036 22.9875C24.7414 22.9852 24.4906 22.88 24.3052 22.6946C24.1198 22.5092 24.0146 22.2584 24.0123 21.9962C24.01 21.734 24.1108 21.4814 24.293 21.2928L27.293 18.2928ZM20 26.9998C20 26.4694 20.2107 25.9606 20.5858 25.5856C20.9609 25.2105 21.4696 24.9998 22 24.9998H24C24.2652 24.9998 24.5196 25.1051 24.7071 25.2927C24.8946 25.4802 25 25.7346 25 25.9998C25 26.265 24.8946 26.5194 24.7071 26.7069C24.5196 26.8944 24.2652 26.9998 24 26.9998H22V35.9998H34V26.9998H32C31.7348 26.9998 31.4804 26.8944 31.2929 26.7069C31.1054 26.5194 31 26.265 31 25.9998C31 25.7346 31.1054 25.4802 31.2929 25.2927C31.4804 25.1051 31.7348 24.9998 32 24.9998H34C34.5304 24.9998 35.0391 25.2105 35.4142 25.5856C35.7893 25.9606 36 26.4694 36 26.9998V35.9998C36 36.5302 35.7893 37.0389 35.4142 37.414C35.0391 37.7891 34.5304 37.9998 34 37.9998H22C21.4696 37.9998 20.9609 37.7891 20.5858 37.414C20.2107 37.0389 20 36.5302 20 35.9998V26.9998Z"

  public showShareMenu = signal(false);
  shareMenuSub: Subscription | null = null;

  constructor(private window: WindowService, public seo: SeoService) {}

  openShareMenu() {
    if (this.showShareMenu()) {
      this.showShareMenu.set(false);
      return;
    }
    this.showShareMenu.set(true);
    if (this.window._) {
      this.shareMenuSub?.unsubscribe();
      this.shareMenuSub = timer(100).pipe(
        switchMap(() => this.window._ ? fromEvent(this.window._, 'click') : EMPTY),
        take(1),
      ).subscribe(() => {
        this.showShareMenu.set(false);
      });
    }
  }

}
