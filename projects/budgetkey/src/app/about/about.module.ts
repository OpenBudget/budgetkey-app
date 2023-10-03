import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about.component';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AboutComponent
  ],
  imports: [
    CommonModule,
    CommonComponentsModule,
    HttpClientModule,
    AboutRoutingModule
  ]
})
export class AboutModule { }
