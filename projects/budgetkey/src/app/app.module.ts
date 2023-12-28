import { ErrorHandler, Inject, NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonComponentsModule } from './common-components/common-components.module';
import { NGX_SEO_CONFIG_TOKEN, NgxSeoModule } from '@avivharuzi/ngx-seo';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AppErrorHandler } from './app-error-handler';
import { ListComponentsModule } from './list-components/list-components.module';
import { provideRouter, withDebugTracing } from '@angular/router';
import { ListPageModule } from './list-page/list-page.module';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonComponentsModule,
    ListComponentsModule,
    NgxSeoModule.forRoot(),
    ListPageModule,
  ],
  providers: [
    provideClientHydration(),
    // {provide: ErrorHandler, useClass: AppErrorHandler},
    {provide: NGX_SEO_CONFIG_TOKEN, useValue: {
      changeTitle: (title: any) => title,
      preserve: true,
      listenToRouteEvents: false,
    }},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
