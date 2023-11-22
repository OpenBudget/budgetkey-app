import {
    AfterViewInit,
  Component, Input, OnInit
} from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { PlatformService } from '../platform.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.less']
})
export class AuthComponent implements AfterViewInit {
    public user: any;

    @Input() theme: any;

    constructor(private auth: AuthService, private ps: PlatformService) {
        this.auth.getUser().pipe(
            untilDestroyed(this)
        ).subscribe((user) => {
            this.user = user;
        });
    }

    ngAfterViewInit() {
        this.ps.browser(() => {
            this.auth.check().subscribe();
        });
    }

    login() {
        if (this.user && this.user.providers) {
            const href = this.user.providers.google || this.user.providers.github;
            if (href && href.url) {
                if (document.location.href === this.auth.getNext()) {
                    window.location.href = href.url;
                } else {
                    this.auth.check()
                        .subscribe((user) => {
                            this.user = user;
                            this.login();
                        });
                }
            }
        }
    }

    logout() {
        this.auth.logout().subscribe((user) => {
            console.log('logged out!');
        });
    }

    profile() {
        if (this.auth.authConfig.profilePagePath) {
            let params = '';
            if (this.theme && this.theme.themeId) {
                params = '?theme=' + this.theme.themeId;
            }
            window.location.href = this.auth.authConfig.profilePagePath + params;
        }
    }
}
