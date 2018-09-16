import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { Log4Cup } from './shared/log4cup'
import { takeWhile } from 'rxjs/operators'
import { Subscription } from 'rxjs';
import { SocketService } from './services/socket.service';
import { OnlineModeService } from './services/networkMode.service';

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
  cup_version: string = '1.0.09092018';
  subsc_login: Subscription;
  subsc_logout: Subscription;
  subsc_connect: Subscription;


  constructor(private authenticationService: AuthenticationService,
    private router: Router,
    private socketService: SocketService,
    private cdRef: ChangeDetectorRef,
    private onlineService: OnlineModeService) {
    this._alive = true;
    this.checkProtocolConnection();
  }

  ngOnInit() {
  }

  ngAfterViewChecked() {
    this.isloggedin = this.authenticationService.isLoggedin();
    this.user_name = this.authenticationService.get_user_name();
    this.cdRef.detectChanges();
  }

  ngAfterViewInit() {
    // monitor login
    this.subsc_login = this.authenticationService.LoginChangeEvent
      .pipe(takeWhile(() => this._alive))
      .subscribe(evt => {
        this._log.debug("Login event received");
        this.isloggedin = this.authenticationService.isLoggedin();
        this.user_name = this.authenticationService.get_user_name();
        this.isConnected = this.socketService.isConnected();
      });
    // monitor socket connection
    this.subsc_connect = this.socketService.ConnectEvent
      .pipe(takeWhile(() => this._alive))
      .subscribe(evt => {
        this.checkProtocolConnection();
      }, () => {
        this.checkProtocolConnection();
      });
  }

  ngOnDestroy(): void {
    this._alive = false;
    this.subsc_login.unsubscribe();
    this.subsc_connect.unsubscribe();
    if (this.subsc_logout) {
      this.subsc_logout.unsubscribe();
    }
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
    this.subsc_logout = this.authenticationService.logout(this.user_name)
      .subscribe(msg => {
        if (msg.is_ok) {
          this.isloggedin = false;
          this.user_name = "";
        }
      });
    this.router.navigate(['/']);
  }

  toggleConnect(): void {
    console.log('Toggle server connction');
    this.checkProtocolConnection();
    if (this.isConnected) {
      if (!this.authenticationService.isLoggedin()) {
        this.onlineService.goOffline();

        this.socketService.closeSocketServer();
        this.authenticationService.Refresh();
        this.router.navigate(['/']);
      } else {
        console.log("No connection toggle when the user is logged in");
      }
    } else {
      this.onlineService.goOnline();
      this.socketService.connectSocketServer();
      this.authenticationService.Refresh();
    }
  }
}
