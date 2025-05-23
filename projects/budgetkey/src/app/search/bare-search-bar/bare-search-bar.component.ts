import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../common-components/auth/auth.service';
import { PlatformService } from '../../common-components/platform.service';

@Component({
    selector: 'app-bare-search-bar',
    templateUrl: './bare-search-bar.component.html',
    styleUrls: ['./bare-search-bar.component.less'],
    standalone: false
})
export class BareSearchBarComponent implements OnInit {

  @Input() config: any = {};
  @Input() term = '';
  @Output() search = new EventEmitter<string>();

  constructor(private auth: AuthService, private ps: PlatformService) {
    this.ps.browser(() => {
      this.auth.check().subscribe((user) => {});
    });
  }

  ngOnInit() {
  }

  onKeyup(event: KeyboardEvent) {
    const value = (<HTMLInputElement>event.target).value;
    this.search.next(value);
  }
}
