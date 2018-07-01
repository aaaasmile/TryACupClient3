import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { Log4Cup } from './shared/log4cup'
import { takeWhile } from 'rxjs/operators'
import { SocketService } from './services/socket.service';
import { OnlineService } from './services/online.service';

@Component({
  selector: 'app-root',
  moduleId: module.id,
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private _log: Log4Cup = new Log4Cup('AppComponent');
  private _alive: boolean;
  user_name: string;
  isloggedin: boolean;
  isConnected: boolean;
  cup_version: string = '1.0.01012018';

  constructor(private authenticationService: AuthenticationService,
    private router: Router,
    private socketService: SocketService,
    private onlineService: OnlineService) {
    this._alive = true;
    this.isloggedin = authenticationService.isLoggedin();
    this.user_name = authenticationService.get_user_name();
    this.checkProtocolConnection();
  }

  ngOnInit() {
    // monitor login
    this.authenticationService.LoginChangeEvent
      .pipe(takeWhile(() => this._alive))
      .subscribe(evt => {
        this._log.debug("Login event received");
        this.isloggedin = this.authenticationService.isLoggedin();
        this.user_name = this.authenticationService.get_user_name();
        this.isConnected = this.socketService.isConnected();
      });
    // monitor socket connection
    this.socketService.ConnectEvent
      .pipe(takeWhile(() => this._alive))
      .subscribe(evt => {
        this.checkProtocolConnection();
      }, () => {
        this.checkProtocolConnection();
      });
  }

  ngOnDestroy(): void {
    this._alive = false;
  }

  private checkProtocolConnection() {
    let newConnect = this.socketService.getProtocollConnected();
    if (this.isConnected != newConnect) {
      this.isConnected = newConnect;
      if (!newConnect) {
        this.isloggedin = false;
      }
    }
  }

  logout(): void {
    this._log.debug("Logut user: " + this.user_name);
    this.authenticationService.logout();
    this.router.navigate(['/']);
  }

  toggleConnect(): void {
    console.log('Toggle server connction');
    this.checkProtocolConnection();
    if (this.isConnected) {
      // TODO ask before exit if an online game is ongoing
      this.onlineService.goOffline();
      if (this.authenticationService.isLoggedin()) {
        this.authenticationService.logout();
      } else {
        this.socketService.closeSocketServer();
      }
      this.router.navigate(['/']);
    } else {
      this.onlineService.goOnline();
      this.socketService.connectSocketServer();
    }
  }
}
