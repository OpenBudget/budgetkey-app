import { HttpClient } from '@angular/common/http';
import {Component, ViewEncapsulation, Input, signal, AfterViewInit, effect, computed, OnChanges} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalSettingsService } from '../../common-components/global-settings.service';
import { distinct, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PlatformService } from '../../common-components/platform.service';
import { ListContents, ListsService } from '../../common-components/services/lists.service';
import { LayoutService } from '../../common-components/layout.service';
import { ListDialogService } from '../list-dialog.service';

@UntilDestroy()
@Component({
    selector: 'app-container',
    templateUrl: './app-container.component.html',
    styleUrls: ['./app-container.component.less'],
})
export class AppContainerComponent implements AfterViewInit, OnChanges {
    @Input() showHeader = true;
    @Input() showFooter = true;
    @Input() showSearchBar = false;
    @Input() showLanguages = false;
    @Input() showShare = true;
    @Input() helpWidget = true;
    @Input() listSideView = false;
    @Input() fakeSearchBar = true;

    configured = false;

    maxWidth = signal<number>(0);
    hasListView = computed(() => {
        const list = this.lists.currentList();
        if (!list) {
            return false;
        }
        if (list.success === false) {
            return false;
        }
        if (!this.listKey()) {
            return false;
        }
        if (this.listKey() !== `${list?.user_id}:${list?.name}`) {
            return false;
        }
        return true;
    });
    listKey = signal<string | null>(null);

    constructor(private route: ActivatedRoute, private globalSettings: GlobalSettingsService, public lists: ListsService, 
        public layout: LayoutService, private router: Router, public listDialog: ListDialogService) {
        this.globalSettings.ready.subscribe(() => {
            this.configured = true;
        });
        this.globalSettings.init(this, this.route);
        this.route.queryParams.pipe(
            untilDestroyed(this),
            map((params) => params['list']),
            distinctUntilChanged(),
        ).subscribe((list) => {
            this.listKey.set(list);
            this.lists.currentListId.set(this.listKey());
        });
        effect(() => {
            const x = this.hasListView();
            this.updateWidth();
        }, { allowSignalWrites: true});
    }

    ngAfterViewInit(): void {
        this.layout.recalcWidth();
        this.updateWidth();
    }

    ngOnChanges(): void {
        this.updateWidth();
    }

    showListView() {
        return this.layout.desktop && this.listSideView && this.hasListView();
    }

    onDeleted() {
        this.router.navigate(['.'], { relativeTo: this.route, queryParams: { list: null }, queryParamsHandling: 'merge', replaceUrl: true});
    }

    updateWidth() {
        let maxWidth = this.layout.width();
        if (this.showListView()) {
            maxWidth -= 400;
        }
        if (maxWidth < 0) {
            maxWidth = 0;
        }
        this.maxWidth.set(maxWidth);
    }
}
