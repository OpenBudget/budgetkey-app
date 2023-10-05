import { Inject, NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonComponentsModule } from './common-components/common-components.module';
import { AuthModule } from './auth/auth.module';
import { NgxSeoModule } from '@avivharuzi/ngx-seo';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonComponentsModule,
    AuthModule,
    NgxSeoModule.forRoot(),
  ],
  providers: [ provideClientHydration() ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
