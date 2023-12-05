import {
    AfterViewInit,
  Component, Input, OnInit
} from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { PlatformService } from '../platform.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Router } from '@angular/router';
import { ListsService } from '../services/lists.service';

@UntilDestroy()
@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.less']
})
export class AuthComponent implements AfterViewInit {
    public user: any;

    @Input() theme: any;

    constructor(private auth: AuthService, private ps: PlatformService, private router: Router, public lists: ListsService) {
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

    get hasProfile() {
        return this.auth?.authConfig?.profilePagePath || null;
    }
    
    profile() {
        if (this.auth.authConfig.profilePagePath) {
            this.router.navigate(this.auth.authConfig.profilePagePath, { queryParamsHandling: 'preserve' });
        }
    }

    myLists() {
        this.router.navigate(['/l/my'], { queryParamsHandling: 'preserve' });
    }
}
