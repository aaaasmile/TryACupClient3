import { Injectable } from '@angular/core';
import { SocketService } from './socket.service'
import { Message } from '../data-models/socket/SocketMessages'
import { UserMessage, User, UserSignupReq } from '../data-models/socket/UserMessage'
import { Observable, Subject } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { CanActivate } from '@angular/router';


@Injectable({
    providedIn: 'root',
})
export class AuthenticationService implements CanActivate {
    private _isLoggedIn: boolean = false;
    private _user_name: string = '';
    public LoginChangeEvent: Subject<boolean>;

    constructor(private socketService: SocketService) {
        this.LoginChangeEvent = new Subject();
    }

    canActivate() {
        return this._isLoggedIn;
    }

    isLoggedin(): boolean {
        console.debug('is logged in' + this._isLoggedIn.toString());
        return this._isLoggedIn;
    }

    isAvailable(): boolean {
        return this.socketService.getProtocollConnected();
    }

    get_user_name(): string {
        return this._user_name;
    }

    activate_loginService() {
        this.socketService.connectSocketServer();
    }

    get_autologin_user(): User {
        this.socketService.connectSocketServer();
        if (this.socketService.isConnected && !this._isLoggedIn) {
            let cu_str: string = localStorage.getItem('currentUser');
            let user: User = JSON.parse(cu_str);
            return user;
        }
        return null;
    }

    autologin(user: User): Observable<UserMessage> {
        console.log('Try to atuologin with user :', user.login);
        return this.socketService.loginReq(user.login, '', user.token)
            .pipe(
                map((msg: Message) => {
                    if (msg instanceof UserMessage) {
                        let lm = msg as UserMessage;
                        if (lm.is_ok && lm.user) {
                            this._isLoggedIn = true;
                            this._user_name = lm.user.login;
                            this.LoginChangeEvent.next(true);
                        }
                        return lm;
                    }
                })
            );
    }

    login(username: string, password: string): Observable<UserMessage> {
        return this.socketService.loginReq(username, password, '')
            .pipe(
                map((msg: Message) => {
                    if (msg instanceof UserMessage) {
                        let lm = msg as UserMessage;
                        if (lm.is_ok && lm.user && lm.user.token && lm.user.token.length > 0) {
                            this._isLoggedIn = true;
                            this._user_name = lm.user.login;
                            this.LoginChangeEvent.next(true);
                            localStorage.setItem('currentUser', JSON.stringify(lm.user));
                        }
                        return lm;
                    }
                })
            );
        // code from :https://github.com/cornflourblue/angular2-registration-login-example/blob/master/app/_services/authentication.service.ts
    }

    signup(req: UserSignupReq): Observable<UserMessage> {
        let det_json = JSON.stringify({
            type: 'insert', login: req.login, password: btoa(req.password),
            fullname: req.fullname, email: req.email, gender: req.gender, deck_name: req.deckname, token_captcha: req.token_captcha
        });
        console.log('Send signup for: ', req.login);

        return this.socketService.signup(det_json)
            .pipe(
                map((msg: Message) => {
                    if (msg instanceof UserMessage) {
                        let lm = msg as UserMessage;
                        if (lm.is_ok && lm.user) {
                            this._isLoggedIn = true;
                            this._user_name = lm.user.login;
                            this.LoginChangeEvent.next(true);
                        }
                        return lm;
                    }
                })
            );
    }

    checkLoginExists(login: string): Observable<UserMessage> {

        return this.socketService.userExists(login)
            .pipe(map((msg: Message) => {
                return (msg instanceof UserMessage) ? msg : null;
            })).pipe(filter(m => m != null));
    }

    logout() {
        // remove user from local storage to log user out
        this._isLoggedIn = false;
        this.LoginChangeEvent.next(false);
        this._user_name = '';
        this.socketService.logoutReq();
        localStorage.removeItem('currentUser');
    }
}