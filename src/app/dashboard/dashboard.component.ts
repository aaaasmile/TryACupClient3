import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';
import { CardGame } from '../data-models/cardGame';
import { CardGameService } from '../services/cardGame.service';
import { Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { OnlineService } from '../services/online.service';


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

  constructor(
    private authService: AuthenticationService,
    private onlineService: OnlineService,
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
        this.isloggedin = this.authService.isLoggedin();
      });

    if (this.onlineService.isOnline()) {
      let user = this.authService.get_autologin_user();
      if (user != null) {
        console.log('Start autologin');
        this._subscription = this.authService.autologin(user)
          .subscribe(
            data => {
              if (data.is_ok)
                console.log('Connected as user: ', data.user.login);
              else {
                console.log('Not logged in');
              }
            });
      }
    }
    this.cardGames = this.cardGameService.getCardGames();
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
    if (this._subscription2) {
      this._subscription2.unsubscribe();
    }
    this._alive = false;
  }

  gotoCardGame(item: CardGame): void {
    console.log('Goto to card game ' + item.name);
    this.router.navigate([item.link]);
  }
}

