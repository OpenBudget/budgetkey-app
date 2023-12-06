/**
 * Created by adam on 18/12/2016.
 */
import { Injectable, computed, effect, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable, ReplaySubject, Subject, Subscription, forkJoin, from, of, timer } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { map, filter, switchMap, first, tap } from 'rxjs/operators';
import { DocResultEntry } from '../search-models';

export class ListItem {
  id?: number;
  list_id?: number;
  url: string;
  title: string;
  properties: any;
  update_time?: string;
  create_time?: string;
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
  success?: boolean;
}

export const CURATED_KIND = 'curated';

export const EMPTY_LIST: ListContents = {
  id: 0,
  name: '',
  user_id: '',
  url: null,
  title: 'הרשימה שלי',
  properties: {description: 'תיאור הרשימה...'},
  kind: 'curated',
  items: [],
  visibility: 1
};

@Injectable()
export class ListsService {

  private token = new ReplaySubject<string | null>();
  private token_: string | null = null;

  public curatedLists = signal<Array<ListContents>>([]);
  public curatedListsMap = computed<{[key: string]: ListContents}>(() => {
    const lists = this.curatedLists();
    const map: {[key: string]: ListContents} = {};
    lists.forEach((list) => {
      map[list.name] = list;
    });
    return map;
  });
  public hasCuratedLists = signal<boolean>(false);
  public curatedItemIds = computed<any>(() => {
    const lists = this.curatedLists();
    const itemIds: any = {};
    lists.forEach((list) => {
      list.items?.forEach((item) => {
        const doc_id = item.properties?.source.doc_id;
        if (doc_id) {
          itemIds[doc_id] = true;
        }
      });
    });
    return itemIds;
  });

  public currentListId = signal<string | null>(null);
  public currentList = signal<ListContents | null>(null);
  public currentListItemIds = computed<any>(() => {
    const list = this.currentList();
    if (!list) {
      return {};
    }
    const itemIds: any = {};
    list.items?.forEach((item) => {
      const doc_id = item.properties?.source.doc_id;
      if (doc_id) {
        itemIds[doc_id] = item.id;
      }
    });
    return itemIds;
  });

  public emptyList = EMPTY_LIST;
  private anonymousSub: Subscription | null = null;

  constructor(private http: HttpClient, private auth: AuthService) {
    this.auth.getJwt().pipe(
      switchMap((jwt) => {
        if (!!jwt) {
          return this.auth.permission('list-manager');
        } else {
          this.token_ = null;
          this.token.next(this.token_);
          return EMPTY;
        }
      }),
      map((permission) => permission.token)
    ).subscribe((token) => {
      this.token_ = token;  
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
      lists = lists.sort((a: ListContents, b: ListContents) => (b.update_time || '').localeCompare(a.update_time || ''));
      items = items.sort((a: ListItem, b: ListItem) => (b.create_time || '').localeCompare(a.create_time || ''));
      lists.forEach((list: any) => {
        list.items = items.filter((item: ListItem) => item.list_id === list.id);
      });
      this.curatedLists.set(lists);
      this.hasCuratedLists.set(enabled);
    });
    effect(() => {
      const id = this.currentListId();
      if (!id) {
        this.currentList.set(null);
        return;
      }
      const parts = id ? id.split(':') : [];
      if (parts.length === 2) {
        const user_id = parts[0];
        const name = parts[1];
        for (const list of this.curatedLists()) {
          if (list.name === name && list.user_id === user_id) {
            this.anonymousSub?.unsubscribe();
            this.anonymousSub = null;
            this.currentList.set(list);
            return;
          }
        }
        this.anonymousSub?.unsubscribe();
        this.anonymousSub = timer(1).pipe(
          switchMap(() => this.getAnonymous(user_id, name))
        ).subscribe((list) => {
          this.currentList.set(list);
        });
      }
    }, {allowSignalWrites: true});
  }

  public headers(token: string | null) {
    return {
      'auth-token': token || ''
    };
  }

  public get(list: string): Observable<ListContents> {
    return <Observable<ListContents>>(
      this.token
          .pipe(
            filter((token) => token !== null),
            first(),
            switchMap((token) => {
              const params = {
                list, items: true
              };
              return this.http.get('https://next.obudget.org/lists/', {params, headers: this.headers(token)});
            }),
            tap((resp: any) => {
              const list = resp as ListContents;
              if (list.kind === CURATED_KIND) {
                const curatedLists = this.curatedLists();
                this.curatedLists.set([list, ...curatedLists.filter((l) => l.name !== list.name)]);
              }
            })
          )
    );
  }

  public getAnonymous(user_id: string, list: string): Observable<ListContents | null> {
    const params = {
      list, user_id, items: true
    };
    return (this.http.get<ListContents>('https://next.obudget.org/lists/', {params}))
      .pipe(
        tap((resp: ListContents) => {
          resp.items = resp.items?.sort((a: ListItem, b: ListItem) => (b.create_time || '').localeCompare(a.create_time || ''));
        }),
      );
  }

  public put(list: string, item: ListItem): Observable<ListItem> {
    return this.token
      .pipe(
        filter((token) => token !== null),
        first(),
        switchMap((token) => {
          console.log('PUTTING ITEM', item);
          const params = {list};
          return this.http.put<ListItem>('https://next.obudget.org/lists/', item, {params, headers: this.headers(token)});
        }),
        tap((resp: ListItem) => {
          const curatedLists = this.curatedLists();
          const listIndex = curatedLists.findIndex((l) => l.name === list);
          if (listIndex >= 0) {
            const curatedList = curatedLists[listIndex];
            const itemIndex = (curatedList.items || []).findIndex((i) => i.properties.source.doc_id === item.properties.source.doc_id);
            if (itemIndex >= 0) {
              curatedList.items?.splice(itemIndex, 1, resp);
            } else {
              curatedList.items?.unshift(resp);
            }
            const list = curatedLists.splice(listIndex, 1);
            this.curatedLists.set([...list, ...curatedLists]);
          }
        }),
      );
  }

  public updateList(listName: string | null, list: ListProperties): Observable<any> {
    return this.token
      .pipe(
        filter((token) => token !== null),
        first(),
        switchMap((token) => {
          console.log('PUTTING LIST', listName, list);
          const params: any = {self: true};
          if (listName) {
            params['list'] = listName;
          }
          return this.http.put('https://next.obudget.org/lists/', list, {params, headers: this.headers(token)});
        }),
        tap(() => {
          const curatedLists = this.curatedLists();
          const listIndex = curatedLists.findIndex((l) => l.name === listName);
          if (listIndex >= 0) {
            const curatedList = curatedLists[listIndex];
            Object.assign(curatedList, list);
            this.curatedLists.set([...curatedLists]);
          }
        }),
      );
  }

  public delete(list: string, item_id: number | null): Observable<any> {
    const _item_id = item_id ? item_id : 'all';
    return this.token
      .pipe(
        filter((token) => token !== null),
        first(),
        switchMap((token) => {
          const params = {list, item_id: _item_id}; 
          return this.http.delete('https://next.obudget.org/lists/', {params, headers: this.headers(token)});
        }),
        tap(() => {
          const curatedLists = this.curatedLists();
          const listIndex = curatedLists.findIndex((l) => l.name === list);
          if (listIndex >= 0) {
            const curatedList = curatedLists[listIndex];
            if (_item_id !== 'all') {
              const itemIndex = (curatedList.items || []).findIndex((i) => i.id === item_id);
              if (itemIndex >= 0) {
                curatedList.items?.splice(itemIndex, 1);
              }
            } else {
              curatedList.items = [];
              curatedLists.splice(listIndex, 1);
            }
            this.curatedLists.set([...curatedLists]);
          }
        })
      );
  }

  public getAllLists(token: string, kind?: string, items?: boolean): Observable<Array<ListContents>> {
    const params: any = {};
    if (kind) {
      params['kind'] = kind;
    }
    if (items) {
      params['items'] = 'yes';
    }
    return this.http.get('https://next.obudget.org/lists/', {params, headers: this.headers(token)})
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
    return this.http.get('https://next.obudget.org/lists/', {params, headers: this.headers(token)})
      .pipe(
        map((response: any) => {
          const lists: ListItem[] = response;
          return lists;
        })
    );
  }

  public addDocToList(listName: string, doc: DocResultEntry) {
    return this.put(listName, {
      title: doc.source.page_title,
      url: '/i/' + doc.source.doc_id,
      properties: doc
    });
  }

  public removeItemFromList(listName: string, itemId: number) {
    return this.delete(listName, itemId).pipe(
      switchMap(() => {
        return this.get(listName);
      }),
    );
  }

  public createList(properties?: ListProperties) {
    return this.auth.getUser().pipe(
      first(),
      map((user) => {
        return {
          name: user.profile?.name,
          avatar_url: user.profile?.avatar_url,
          user_id: user.profile?.id,
        };
      }),
      switchMap((user_props) => {
        const list = Object.assign({}, this.emptyList, properties || {});
        list.properties = Object.assign(list.properties, {
          name: user_props.name,
          avatar_url: user_props.avatar_url,
        });
        return this.updateList(null, list)
      }),
      tap((list) => {
        list.items = [];
        this.curatedLists.set([list, ...this.curatedLists()]);
      })
    );
  }
}
