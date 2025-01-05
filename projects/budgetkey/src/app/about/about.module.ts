import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import { AboutPageComponent } from './about-page/about-page.component';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ListComponentsModule } from '../list-components/list-components.module';


@NgModule({ declarations: [
        AboutPageComponent
    ], imports: [CommonModule,
        CommonComponentsModule,
        ListComponentsModule,
        AboutRoutingModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AboutModule { }
