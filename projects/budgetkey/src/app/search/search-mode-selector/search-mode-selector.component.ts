import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { SearchState } from '../search-state/search-state';
import { SearchApiService } from '../search-api.service';
import { GlobalSettingsService } from '../../common-components/global-settings.service';
import { SearchBarType } from '../../common-components/components/searchbar/bk-search-bar.component';

@Component({
    selector: 'search-mode-selector',
    templateUrl: './search-mode-selector.component.html',
    styleUrls: ['./search-mode-selector.component.less']
})
export class SearchModeSelectorComponent implements OnInit {

    @Input() state: SearchState;
    @Input() bare = false;
    @Output() searching = new EventEmitter<boolean>();

    private multiSearching: any = {};
    anySearching = false;


    constructor(
        private api: SearchApiService,
        private globalSettings: GlobalSettingsService,
    ) { }

    ngOnInit() {
    }

    onSearching(searching: boolean) {
        this.searching.emit(searching);
    }

    onSingleSearching(docTypeId: string, searching: boolean) {
        this.multiSearching[docTypeId] = searching;
        const anySearching = Object.values(this.multiSearching).filter(x => x).length > 0;
        this.searching.emit(anySearching);
    }

    cmp(a: any, b: any, prop: string, dflt: number) {
        return a[prop] > b[prop] ? -1 : a[prop] === b[prop] ? dflt : 1;
    }

    sortedDocTypes() {
        let sorted: SearchBarType[] = (this.globalSettings.theme.searchBarConfig as SearchBarType[]).slice().filter(x => x.id !== 'all');
        if (!this.globalSettings.theme.keepDocTypesOrder) {
            sorted = sorted.sort((a, b) => this.cmp(a, b, 'score', this.cmp(a, b, 'amount', 0)));
        }
        return sorted;
    }

}
