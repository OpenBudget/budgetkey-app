/**
 * Created by adam on 18/12/2016.
 */
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable, ReplaySubject, forkJoin, from, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { map, filter, switchMap, first } from 'rxjs/operators';

export class ListItem {
  id?: number;
  list_id?: number;
  url: string;
  title: string;
  properties: any;
}


export class ListProperties {
  url: string | null;
  title: string | null;
  properties: any | null;
  kind: string | null;
  update_time?: string;
  create_time?: string;
}

export class ListContents extends ListProperties {
  id: number;
  name: string;
  items?: Array<ListItem>;
}

export const CURATED_KIND = 'curated';

@Injectable()
export class ListsService {

  private token = new ReplaySubject<any>();

  public curatedLists = signal<Array<ListContents>>([]);
  public curatedItems = signal<Array<ListItem>>([]);
  public curatedItemIds = signal<any>({});
  public hasCuratedLists = signal<boolean>(false);

  constructor(private http: HttpClient, private auth: AuthService) {
    this.auth.getJwt().pipe(
      switchMap((jwt) => {
        if (!!jwt) {
          return this.auth.permission('list-manager');
        } else {
          this.token.next(null);
          return EMPTY;
        }
      }),
      map((permission) => permission.token)
    ).subscribe((token) => {
      this.token.next(token);
    });
    this.token.pipe(
      switchMap((token) => {
        if (!!token) {
          return forkJoin([of(true), this.getAllLists(token, CURATED_KIND), this.getAllItems(token, CURATED_KIND)]);
        } else {
          return forkJoin([of(false), of([]), of([])]);
        }
      }),
    ).subscribe(([enabled, lists, items]) => {
      this.curatedLists.set(lists);
      this.curatedItems.set(items);
      console.table(lists);
      console.table(items);
      const itemIds: any = {};
      items.forEach((item) => {
        const doc_id = item.properties?.source.doc_id;
        if (doc_id) {
          itemIds[doc_id] = true;
        }
      });
      this.curatedItemIds.set(itemIds);
      this.hasCuratedLists.set(enabled);
    });
  }

  public get(list: string): Observable<ListContents> {
    return <Observable<ListContents>>(
      this.token
          .pipe(
            filter((token) => token !== null),
            switchMap((token) => {
              const params = {
                list, items: true
              };
              return this.http.get('https://next.obudget.org/lists/', {params, headers: {'auth-token': token}});
            }),
            first()
          )
    );
  }

  public put(list: string, item: ListItem): Observable<ListItem> {
    return this.token
      .pipe(
        filter((token) => token !== null),
        switchMap((token) => {
          console.log('PUTTING ITEM', item);
          const params = {list};
          return this.http.put('https://next.obudget.org/lists/', item, {params, headers: {'auth-token': token}});
        }),
        map((response) => {
          const added: any = response;
          item.id = added.item_id;
          item.list_id = added.list_id;
          return item;
        }),
        first()
      );
  }

  public updateList(listName: string | null, list: ListProperties): Observable<any> {
    return this.token
      .pipe(
        filter((token) => token !== null),
        switchMap((token) => {
          console.log('PUTTING LIST', listName, list);
          const params: any = {list: listName, self: true};
          return this.http.put('https://next.obudget.org/lists/', list, {params, headers: {'auth-token': token}});
        }),
        first()
      );
  }

  public delete(list: string, item_id: number | null): Observable<boolean> {
    const _item_id = item_id ? item_id : 'all';
    return <Observable<boolean>>(this.token
      .pipe(
        filter((token) => token !== null),
        switchMap((token) => {
          const params = {list, item_id: _item_id}; 
          return this.http.delete('https://next.obudget.org/lists/', {params, headers: {'auth-token': token}});
        }),
        first()
      ));
  }

  public getAllLists(token: string, kind?: string): Observable<Array<ListContents>> {
    const params: any = {};
    if (kind) {
      params['kind'] = kind;
    }
    return this.http.get('https://next.obudget.org/lists/', {params, headers: {'auth-token': token}})
      .pipe(
        map((response: any) => {
          const lists: ListContents[] = response;
          return lists;
        })
    );
  }

  public getAllItems(token: string, kind?: string): Observable<Array<ListItem>> {
    const params: any = {items: true};
    if (kind) {
      params['kind'] = kind;
    }
    return this.http.get('https://next.obudget.org/lists/', {params, headers: {'auth-token': token}})
      .pipe(
        map((response: any) => {
          const lists: ListItem[] = response;
          return lists;
        })
    );
  }

  public testAdd(item: any) {
    this.auth.getUser().pipe(
      map((user) => {
        console.log('USER', user);
        return {
          name: user.profile?.name,
          avatar_url: user.profile?.avatar_url,
        };
      }),
      switchMap((user_props) => {
        return this.updateList('test-list', {
          title: 'רשימה לדוגמה לצורך בדיקות',
          url: null,
          properties: {
            description: 'זו רשימה שנוצרה לטובת בדיקות של המערכת. כל התוכן פה הוא שרירותי ולא מעניין את אף אחד',
            ...user_props
          },
          kind: 'curated',
        })
      }),
      switchMap(() => {
        return this.put('test-list', {
          title: item.source.page_title,
          url: '/i/' + item.source.doc_id,
          properties: item
        });
      })
    ).subscribe((item) => {
      console.log('ITEM ADDED', item);
    });
  }
}
