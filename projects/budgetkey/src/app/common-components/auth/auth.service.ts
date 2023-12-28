import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, tap, timer } from 'rxjs';
import { filter, first, switchMap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { PlatformService } from '../platform.service';

@Injectable()
export class AuthService {
    private authServerUrl: string;
    private jwtLocalStorageKey: string;
    private jwtQueryParam: string;
    private user = new ReplaySubject<any>();
    private jwt = new ReplaySubject<any>();
    private next: string | null = null;

    public authConfig = {
        authServerUrl: 'https://next.obudget.org',
        jwtLocalStorageKey: 'jwt',
        jwtQueryParam: 'jwt',
        profilePagePath: ['/p']
    };    

    constructor(private http: HttpClient, private platform: PlatformService) {
        this.authServerUrl = this.authConfig.authServerUrl;
        this.jwtLocalStorageKey = this.authConfig.jwtLocalStorageKey;
        this.jwtQueryParam = this.authConfig.jwtQueryParam;
    }

    /**
     * gets the jwt token, first tries from URL, then from local storage
     */
    private resolveToken(): string | null {
        let search = document.location.search.trim();
        if (search.startsWith('?')) {
          search = search.substring(1);
        }
        const params = new URLSearchParams(search);
        const jwt = params.get(this.jwtQueryParam);
        if (jwt) {
            // remove the jwt query param from the URL
            params.delete(this.jwtQueryParam);
            search = params.toString();
            history.replaceState(null,
                                 document.title,
                                 document.location.href.split('?')[0] + '?' + search);
            return jwt;
        } else {
            return this.getToken();
        }
    }

    /**
     * get the token from local storage
     */
    private getToken(): string | null {
        return localStorage.getItem(this.jwtLocalStorageKey);
    }

    /**
     * set the token in local storage
     */
    private setToken(jwt: string): void {
        this.jwt.next(jwt);
        localStorage.setItem(this.jwtLocalStorageKey, jwt);
    }

    /**
     * delete the token from local storage
     */
    private deleteToken(): void {
        this.jwt.next(null);
        localStorage.removeItem(this.jwtLocalStorageKey);
    }

    public getUser(): Observable<any> {
        return this.user;
    }

    public getJwt(): Observable<string> {
        return this.jwt;
    }

    public getNext(): string | null {
        return this.next;
    }

    check(next_?: string): Observable<any> {
        const next = next_ || window.location.href;
        const jwt = this.resolveToken();
        const headers: any = {};
        if (jwt) {
            this.setToken(jwt);
            headers['auth-token'] = jwt;
        }
        return this.http
            .get(`${this.authServerUrl}/auth/check?next=${encodeURIComponent(next)}`, { headers })
            .pipe(
                tap((user) => {
                    this.next = next;
                    this.user.next(user);
                }),
            );
    }

    logout(): Observable<any> {
        this.deleteToken();
        return this.check();
    }

    permission(service: string): Observable<any> {
        return this.jwt
            .pipe(
                filter((token) => token !== null),
                switchMap((token) => {
                    const headers = { 'auth-token': token };
                    return this.http.get(`${this.authServerUrl}/auth/authorize?service=${service}`, { headers });
                }),
                first()
            );
    }
}