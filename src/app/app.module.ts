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
import { LobbyCardGameService } from './services/lobby-cardgames.service';
import { AuthenticationService } from './services/authentication.service';
import { AlertService } from './services/alert.service';
import { OnlineModeService } from './services/networkMode.service';
import { ModalService } from './services/modal.service';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { ResourceLoader } from './games/common/gfx/resource-loader';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component'
import { AlertComponent } from './directives/alert.component';
import { ModalComponent } from './directives/modal.component';
import { APPLICATION_VALIDATORS } from './directives/app-validators';
import { ShowErrorComponent } from './show-error/show-error.component';
import { ReCaptchaComponent } from './directives/captcha.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { GameListComponent } from './game-list/game-list.component';
import { BriscolaInDueComponent } from './games/briscola/briscola_in_due/briscola-in-due.component';
import { TestGfxComponent } from './games/test-gfx/test-gfx.component';
import { TestCardComponent } from './games/test-gfx/testcard/testcard.component';
import { TestCardComponent2 } from './games/test-gfx/testcard2/testcard2.component';

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
    ModalComponent,
    DashboardComponent,
    UsersComponent,
    LoginComponent,
    SignUpComponent,
    ShowErrorComponent,
    ReCaptchaComponent,
    UserDetailsComponent,
    GameListComponent,
    BriscolaInDueComponent,
    TestGfxComponent,
    TestCardComponent,
    TestCardComponent2,
    TestCardComponent2
  ],
  providers: [
    UserService,
    SocketService,
    LobbyCardGameService,
    ResourceLoader,
    AuthenticationService,
    AlertService,
    OnlineModeService,
    ModalService,
    { provide: LocationStrategy, useClass: HashLocationStrategy } // Hash in url to avoid browser reload issue
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
