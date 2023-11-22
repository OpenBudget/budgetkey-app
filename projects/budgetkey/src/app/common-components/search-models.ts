import { SearchBarType } from './components/searchbar/bk-search-bar.component';

export class SearchParams {
    constructor(other?: SearchParams) {
        if (other) {
            this.term = other.term;
            // this.period = other.period;
            this.docType = other.docType;
            this.offset = other.offset;
            this.pageSize = other.pageSize;
            this.filters = other.filters;
            this.ordering = other.ordering;
            this.context = other.context;
        }
    }

    term: string;
    // period: any;
    docType: SearchBarType;
    offset: number;
    pageSize: number;
    filters: any;
    ordering: string;
    context: string | null;
}

class TimeDistributionEntry {
    doc_count: number;
    key: number;
    key_as_string: string;
}

export class DocResultEntry {
    highlight: any;
    source: any;
    type: any;
    score: number;
}

class KindResults {
    data_time_distribution: Array<TimeDistributionEntry>;
    total_in_result: number;
    total_overall: number;
}

class SearchResultsCounts {
    entities: KindResults;
    budget: KindResults;
    supports: KindResults;
    'national-budget-changes': KindResults;
    procurement: KindResults;
    people: KindResults;
    gov_decisions: KindResults;
    activities: KindResults;
    _current: KindResults;
}

export class SearchResults {
    search_counts: SearchResultsCounts;
    search_results: Array<DocResultEntry>;
    timeline: Array<any>;
    params?: SearchParams;
}
