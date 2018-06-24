import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { AlertService } from '../services/alert.service';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { SocketService } from '../services/socket.service';
import { NgForm } from '@angular/forms';
import "rxjs/add/operator/takeWhile";
import { ViewChild } from '@angular/core';
import { ReCaptchaComponent } from '../directives/captcha.component';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styles: []
})
export class SignUpComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;

  model: any = {};
  loading = false;
  returnUrl: string;
  private _alive: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService) {
    this.resetModel();
    this._alive = true;
  }

  private resetModel() {
    this.model = ({ deckname: '', gender: '', token_captcha: '' }); // importante l'inizializzazione del valore '' per avere selezionato l'elemento con la scritta
  }

  ngOnInit() {
    console.info("ngOnInit");
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngAfterViewInit() {
    this.authenticationService.activate_loginService();
  }

  ngOnDestroy(): void {
    this._alive = false;
  }

  signup(form: NgForm) {
    let conn = this.authenticationService.isAvailable();
    console.log('Connection available? ', conn);
    if (!conn){
      this.router.navigate([this.returnUrl]);
      this.alertService.error('Servizio non disponibile');
    }
    console.info('signup model is ', this.model);
    this.loading = true;
    this.authenticationService.signup(this.model.username, this.model.password, this.model.email, this.model.gender,
      this.model.fullname, this.model.deckname, this.model.token_captcha)
      .takeWhile(() => this._alive)
      .subscribe(
      data => {
        if (data.is_ok){
          this.router.navigate([this.returnUrl]);
          this.alertService.success('Utente ' + this.model.username + ' creato con successo');
        }
        else {
          form.reset();
          this.resetModel();
          this.router.navigate([this.returnUrl]);
          this.alertService.error(data.info);
          this.loading = false;
        }
      });
  }

  handleCorrectCaptcha(evt: any){
    console.info('Captcha is ok', evt);
    this.model.token_captcha = evt;
  }

  handleCaptchaExpired(){
    console.info('Captcha is expired');
    this.model.token_captcha = '';
    this.captcha.reset();
  }

}
