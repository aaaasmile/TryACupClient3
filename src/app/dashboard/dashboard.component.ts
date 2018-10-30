import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';
import { CardGame } from '../data-models/cardGame';
import { CardGameService } from '../services/cardGame.service';
import { Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { OnlineModeService } from '../services/networkMode.service';


@Component({
  moduleId: module.id,
  selector: 'my-dashboard',
  templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit, OnDestroy {

  cardGames: CardGame[];
  isloggedin: boolean;
  isConnected: boolean;
  private _alive: boolean;
  private _subscription: Subscription;
  private _subscription2: Subscription;
  private _subscription3: Subscription;

  constructor(
    private authService: AuthenticationService,
    private onlineService: OnlineModeService,
    private cardGameService: CardGameService,
    private router: Router) {
    this.isloggedin = authService.isLoggedin();
    this.isConnected = authService.isAvailable();
    this._alive = true;
  }

  ngOnInit(): void {
    this._subscription2 = this.authService.LoginChangeEvent
      .pipe(
        takeWhile(() => this._alive)
      )
      .subscribe(evt => {
        console.log('Login event received')
        this.isloggedin = this.authService.isLoggedin();
        this.isConnected = this.authService.isAvailable();
      });
    this.cardGames = this.cardGameService.getCardGames();
  }

  ngAfterViewInit() {
    this.checkForAutologin()

  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
    if (this._subscription2) {
      this._subscription2.unsubscribe();
    }
    if (this._subscription3) {
      this._subscription3.unsubscribe();
    }
    this._alive = false;
  }

  gotoCardGame(item: CardGame): void {
    console.log('Goto to card game ' + item.name);
    this.router.navigate([item.link]);
  }

  checkForAutologin() {
    console.log('Check for autologin');
    if (this.authService.isLoggedin()) {
      console.log('User already logged in');
      return;
    }
    if (this.onlineService.isModeOnline()) {
      this.authService.activate_loginService();
      this._subscription3 = this.authService.subscribeGameStatusMsg()
      .subscribe(gs => {
        console.debug("Game status received", gs)
        if (gs.is_status_requested()){
          console.log("Navigate to game list")
          this.router.navigate(['/app/games']);
        }
      })
      let user = this.authService.get_autologin_user();
      if (user != null) {
        console.log('Start autologin');
        this._subscription = this.authService.autologin(user)
          .subscribe(
            data => {
              if (data.is_ok) {
                console.log('Connected as user: ', data.user.login);
                this.isloggedin = true;
              } else {
                console.log('Not logged in');
                this.isloggedin = false;
              }
              this.isConnected = this.authService.isAvailable();
            });
      } else {
        console.log('No autologing because no user is setup');
      }
    } else {
      console.log('No autologin because is offline mode');
    }
  }
}

