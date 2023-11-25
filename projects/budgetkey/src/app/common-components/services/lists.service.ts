/**
 * Created by adam on 18/12/2016.
 */
import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable, ReplaySubject, forkJoin, from, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { map, filter, switchMap, first, tap } from 'rxjs/operators';

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
  visibility?: number;
}

export class ListContents extends ListProperties {
  id: number;
  name: string;
  user_id: string;
  items?: Array<ListItem>;
}

export const CURATED_KIND = 'curated';

@Injectable()
export class ListsService {

  private token = new ReplaySubject<any>();

  public curatedLists = signal<Array<ListContents>>([]);
  public curatedItems = signal<Array<ListItem>>([]);
  public currentList = signal<ListContents | null>(null);
  public currentListItemIds = computed<any>(() => {
    const list = this.currentList();
    console.log('COMPUTEDDD', list);
    if (!list) {
      return {};
    }
    const itemIds: any = {};
    list.items?.forEach((item) => {
      const doc_id = item.properties?.source.doc_id;
      if (doc_id) {
        itemIds[doc_id] = true;
      }
    });
    console.log('LIST ITEM IDS', itemIds);
    return itemIds;
  });
  public hasCuratedLists = signal<boolean>(false);

  public EMPTY_LIST: ListContents = {
    id: 0,
    name: '',
    user_id: '',
    url: null,
    title: 'רשימה ללא שם',
    properties: {description: 'תיאור הרשימה...'},
    kind: 'curated',
    items: []
  };

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

  public getAnonymous(user_id: string, list: string): Observable<ListContents> {
    const params = {
      list, user_id, items: true
    };
    return <Observable<ListContents>>(this.http.get('https://next.obudget.org/lists/', {params}));
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

  public addItemToList(listName: string, item: any) {
    return this.auth.getUser().pipe(
      map((user) => {
        console.log('USER', user);
        return {
          name: user.profile?.name,
          avatar_url: user.profile?.avatar_url,
          user_id: user.profile?.id,
        };
      }),
      switchMap((user_props) => {
        return this.updateList('test-list', {
          title: 'רשימה לדוגמה לצורך בדיקות',
          url: null,
          properties: {
            description: 'זו רשימה שנוצרה לטובת בדיקות של המערכת. כל התוכן פה הוא שרירותי ולא מעניין את אף אחד',
            name: user_props.name,
            avatar_url: user_props.avatar_url,
          },
          kind: 'curated',
          visibility: 1
        }).pipe(
          map(() => user_props.user_id)
        )
      }),
      switchMap(() => {
        return this.put(listName, {
          title: item.source.page_title,
          url: '/i/' + item.source.doc_id,
          properties: item
        });
      }),
      switchMap(() => {
        return this.get(listName);
      }),
      tap((list) => {
        this.currentList.set(list);
      })
    );
  }


}
