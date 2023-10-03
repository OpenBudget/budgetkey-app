import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import { AboutPageComponent } from './about-page/about-page.component';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AboutPageComponent
  ],
  imports: [
    CommonModule,
    CommonComponentsModule,
    HttpClientModule,
    AboutRoutingModule
  ]
})
export class AboutModule { }
