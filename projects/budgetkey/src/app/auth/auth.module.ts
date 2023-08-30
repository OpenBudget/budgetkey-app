import { NgModule } from '@angular/core';
import { AuthComponent } from './auth.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
// import { AuthService } from './auth.service';

@NgModule({
  declarations: [AuthComponent],
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  exports: [AuthComponent],
  providers: [
    AuthService,
  ]
})
export class AuthModule { }
