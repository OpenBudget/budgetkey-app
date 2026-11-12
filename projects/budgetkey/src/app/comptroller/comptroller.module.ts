import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { CommonComponentsModule } from '../common-components/common-components.module';
import { ListComponentsModule } from '../list-components/list-components.module';
import { ComptrollerDashService } from './comptroller-dash.service';
import { ComptrollerPageComponent } from './comptroller-page/comptroller-page.component';
import { ChronicIssuesComponent } from './chronic-issues/chronic-issues.component';
import { TopicMapComponent } from './topic-map/topic-map.component';
import { TopicTrendsComponent } from './topic-trends/topic-trends.component';
import { SpecialEventsComponent } from './special-events/special-events.component';
import { SegmentedComponent } from './segmented/segmented.component';

// The State Comptroller landing page: what the reports cover, and what we made of them
@NgModule({
  declarations: [
    ComptrollerPageComponent,
    ChronicIssuesComponent,
    TopicMapComponent,
    TopicTrendsComponent,
    SpecialEventsComponent,
    SegmentedComponent,
  ],
  imports: [
    CommonModule,
    CommonComponentsModule,
    ListComponentsModule,
    RouterModule.forChild([
      { path: '', component: ComptrollerPageComponent },
    ]),
  ],
  providers: [ComptrollerDashService, provideHttpClient(withInterceptorsFromDi())],
})
export class ComptrollerModule { }
