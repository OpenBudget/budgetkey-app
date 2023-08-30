import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainPageComponent } from './main-page.component';
import { MainPageRoutingModule } from './main-page-routing.module';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { SpeechBubbleComponent } from './speech-bubble/speech-bubble.component';
import { AuthModule } from '../auth/auth.module';
import { MainPageSummaryComponent } from './main-page-summary/main-page-summary.component';
import { HeroComponent } from './hero/hero.component';
import { CategoryVisualizationComponent } from './category-visualization/category-visualization.component';
import { CategoryVisualizationInfoPopupComponent } from './category-visualization-info-popup/category-visualization-info-popup.component';
import { MushonkeyModule } from 'mushonkey';
import { HttpClientModule } from '@angular/common/http';
import { UtilsService } from './utils.service';


@NgModule({
  declarations: [
    MainPageComponent,
    SpeechBubbleComponent,
    MainPageSummaryComponent,
    HeroComponent,
    CategoryVisualizationComponent,
    CategoryVisualizationInfoPopupComponent
  ],
  imports: [
    CommonModule,
    CommonComponentsModule,
    AuthModule,
    MainPageRoutingModule,
    MushonkeyModule,
  ],
  providers: [
    UtilsService
  ]
})
export class MainPageModule { }
