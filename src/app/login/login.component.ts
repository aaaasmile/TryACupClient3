import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { AlertService } from '../services/alert.service';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { SocketService } from '../services/socket.service';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  model: any = {};
  loading = false;
  returnUrl: string;
  private _alive: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService) {
      this._alive = true;
     }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngOnDestroy(): void {
    this._alive = false;
  }

  ngAfterViewInit() {
    this.authenticationService.activate_loginService();
  }

  login() {
    this.loading = true;
    this.authenticationService.login(this.model.username, this.model.password)
      .pipe(takeWhile(() => this._alive))
      .subscribe(
      data => {
        if (data.is_ok)
          this.router.navigate([this.returnUrl]);
        else {
          this.alertService.error(data.info);
          this.loading = false;
        }
      });
  }
}
