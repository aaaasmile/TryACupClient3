import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import {
  LocationStrategy,
  HashLocationStrategy
} from '@angular/common';
import { AppComponent } from './app.component';
import { SocketService } from './services/socket.service';
import { UserService } from './services/user.service';
import { CardGameService } from './services/cardGame.service';
import { AuthenticationService } from './services/authentication.service';
import { AlertService } from './services/alert.service';
import { OnlineService } from './services/online.service';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { ResourceLoader } from './games/common/gfx/resource-loader';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component'
import { AlertComponent } from './directives/alert.component';
import { APPLICATION_VALIDATORS } from './directives/app-validators';
import { ShowErrorComponent } from './show-error/show-error.component';
import { ReCaptchaComponent } from './directives/captcha.component';
import { UserDetailsComponent } from './user-details/user-details.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  declarations: [
    APPLICATION_VALIDATORS,
    AppComponent,
    AlertComponent,
    DashboardComponent,
    UsersComponent,
    LoginComponent,
    SignUpComponent,
    ShowErrorComponent,
    ReCaptchaComponent,
    UserDetailsComponent
  ],
  providers: [
    UserService,
    SocketService,
    CardGameService,
    ResourceLoader,
    AuthenticationService,
    AlertService,
    OnlineService,
    { provide: LocationStrategy, useClass: HashLocationStrategy } // Hash in url to avoid browser reload issue
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
