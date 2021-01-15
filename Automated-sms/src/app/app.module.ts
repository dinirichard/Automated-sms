import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './app-firebase/login/login.component';
import { ToastrModule } from 'ngx-toastr';
import { MaterialModule } from './material/material.module';

import {
  SocialLoginModule,
  SocialAuthServiceConfig,
} from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { environment } from '../environments/environment';
import { AppSetupComponent } from './app-firebase/app-setup/app-setup.component';
import { SlicePipe } from './shared/slice.pipe';

const googleLoginOptions = {
  scope: 'profile email openid',
};

@NgModule({
  declarations: [AppComponent, LoginComponent, AppSetupComponent, SlicePipe],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SocialLoginModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    MaterialModule,
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '541656524796-6qaf231al2errjj4hk1op383vng3fmep.apps.googleusercontent.com',
              googleLoginOptions
            ),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
