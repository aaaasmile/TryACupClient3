import { Injectable } from '@angular/core';
import { Log4Cup } from '../shared/log4cup';
import { ChatType } from '../data-models/sharedEnums';
import { OnlineService } from './online.service';
import { Message, UserMessage,  MessageBuilder, List2Message } from '../data-models/SocketMessages';

import { Subscription, Subject, Observable, Observer, ReplaySubject } from 'rxjs';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';

import { WebSocketSubject, webSocket } from 'rxjs/WebSocket'



// reference is: https://github.com/lwojciechowski/mildchat-client/blob/master/src/app/chat.service.ts

@Injectable({
    providedIn: 'root',
  })
export class SocketService {
    private _log: Log4Cup = new Log4Cup('SocketService');

    public Messages: Subject<Message>;
    public ConnectEvent: Subject<boolean>;
    private _closing: boolean;
    private _protocollConnected: boolean;
    private _reconnect: boolean;

    private ws: WebSocketSubject<any>; // Websocket is a subject in RxJs

    constructor(private onlineService: OnlineService) {
        this._log.debug("socket - constructor");
        this.ConnectEvent = new Subject<boolean>();
        this._protocollConnected = false;
        this._closing = false;
    }

    private createSocket(): void {
        this._log.debug('Create socket on SocketService');
        var port = location.port;
        var prefix = (window.location.protocol.match(/https/) ? 'wss' : 'ws')
        if (location.hostname === 'localhost') {
            port = "3000"; // overwritten because dev
        }
        var mybase_url = prefix + "://" + location.hostname + (port ? ':' + port : '');
        mybase_url += "/websocket";

        this.Messages = new Subject<Message>();

        this.ws = webSocket({url: mybase_url, serializer: x => x});
        this.ws.subscribe(
            (msg) => {
                console.log('socket received: ' + msg);
                if (this.Messages != null) {
                    this.setProtocolConnected(true);
                    let msgParsed = MessageBuilder.parse(msg);
                    console.log("Msg parsed is:", msgParsed);
                    this.Messages.next(msgParsed);
                } else {
                    this.setProtocolConnected(false);
                }
            },
            (err) => {
                console.log('socket error: ', err);
                this.Messages.complete();
                this.ws = null;
                this.Messages = null;
                this.setProtocolConnected(false);
            },
            () => {
                console.log('socket complete');
                if (this.Messages != null) {
                    this.Messages.complete();
                }
                this.Messages = null;
                this.ws = null;
                this.setProtocolConnected(false);
                this._closing = false;
                if (this._reconnect) {
                    console.log('Reconnect was requested');
                    this.connectSocketServer();
                }
            }
        );
    }

    private setProtocolConnected(val: boolean) {
        if (val != this._protocollConnected) {
            this._protocollConnected = val;
            this.ConnectEvent.next(val);
        }
    }

    getProtocollConnected(): boolean {
        return this._protocollConnected;
    }

    connectSocketServer(): void {
        if (this.onlineService.isOnline()) {
            if (this.ws == null) {
                if (!this._closing) {
                    this._reconnect = false;
                    this.createSocket();
                } else {
                    this._reconnect = true;
                }
            }
        } else {
            console.log('Ignore connect because app is offline');
        }
    }

    closeSocketServer(): void {
        if (this.ws != null) {
            this._log.debug("Close the socket by user action");
            this.ws.unsubscribe();
            this._reconnect = false;
            this.ws = null;
            if (this.Messages != null) {
                this._closing = true;
                this.Messages.complete();
                this.Messages = null;
            }
        }
    }

    isConnected(): boolean {
        return this.ws != null;
    }

    loginReq(login: string, password: string, token: string): Observable<UserMessage> {
        this.connectSocketServer();

        let det_json = JSON.stringify({ name: login, password: btoa(password), token: token });
        let det: string  = "LOGIN:" + det_json;
        console.log("Send cmd: ", det);

        this.ws.next(det);
        this._log.debug('Send login: ' + login);
        return this.Messages.pipe(map(msg => {
            return (msg instanceof UserMessage) ? msg : null;
        })).pipe(filter(m => m != null));
    }

    signup(login: string, password: string, email: string, gender: string, fullname: string, deckname: string, token_captcha: string): Observable<UserMessage> {
        this.connectSocketServer();

        let det_json = JSON.stringify({
            type: 'insert', login: login, password: btoa(password),
            fullname: fullname, email: email, gender: gender, deck_name: deckname, token_captcha: token_captcha
        });
        var det = "USEROP:" + det_json;
      
        this.ws.next(det);
        this._log.debug('Send signup for: ' + login);
        return this.Messages.pipe(map(msg => {
            return (msg instanceof UserMessage) ? msg : null;
        })).pipe(filter(m => m != null));
    }

    userExists(login: string): Observable<UserMessage> {
        this.connectSocketServer();

        let det_json = JSON.stringify({ login: login });
        var det = "USEREXIST:" + det_json;

        this.ws.next(det);
        this._log.debug('user exists for: ' + login);
        return this.Messages.pipe(map(msg => {
            //console.log('**** user exxist result', msg, msg instanceof UserMessage);
            return (msg instanceof UserMessage) ? msg : null;
        })).pipe(filter(m => m != null));
    }

    logoutReq(): void {
        this.closeSocketServer();
    }

    pendingGame2Req(): Observable<List2Message> {
        this.sendCmdDetReq('PENDINGGAMESREQ2:')
        return this.Messages.pipe(map(msg => {
            return (msg instanceof List2Message) ? msg : null;
          })).pipe(filter(m => m != null));
    }

    usersConnectedReq(): void {
        this.sendCmdDetReq('USERSCONNECTREQ:');
    }

    createNewGameReq(payloadObj: Object): void {
        var payloadJson = JSON.stringify(payloadObj);
        this._log.debug('Game created: ' + payloadJson);
        this.sendCmdDetReq('PGCREATE2:' + payloadJson);
    }

    joinGameReq(ix: number) {
        this._log.debug('Join game ix: ' + ix);
        this.sendCmdDetReq('PGJOIN:' + ix);
    }

    chatCup(type: ChatType, text: string) {
        let spec: string;
        switch (type) {
            case ChatType.Table:
                spec = "CHATTAVOLO:";
                break;
            case ChatType.Lobby:
                spec = "CHATLOBBY:";
                break;
        }
        this._log.debug('Chat ' + type + ':' + text);
        this.sendCmdDetReq(spec + text);
    }

    algPlayCard(card: string, name: string) {
        this._log.debug('Play card ' + card + ' player: ' + name);
        this.sendCmdDetReq('ALGPLAYERCARDPLAYED:' + name + ',' + card);
    }

    algLeaveTable(ix: number) {
        this._log.debug('Leave table game ix: ' + ix);
        this.sendCmdDetReq('LEAVETABLE:' + ix);
    }

    algResign(ix: number) {
        this._log.debug('Resign game ix: ' + ix);
        this.sendCmdDetReq('RESIGNGAME:' + ix);
    }

    algRestartWithNewGame(payloadObj: Object) {
        var payloadJson = JSON.stringify(payloadObj);
        this._log.debug('Restart new game: ' + payloadJson);
        this.sendCmdDetReq('RESTARTWITHNEWGAME:' + payloadJson);
    }

    algRestartSameGame(ix: number) {
        this._log.debug('Restart game ix: ' + ix);
        this.sendCmdDetReq('RESTARTGAME:' + ix);
    }

    private sendCmdDetReq(det: string): Observable<Message> {
        this._log.debug('send ' + det);
        this.ws.next(det);
        return this.Messages.pipe(map(msg => {
            return msg;
        })).pipe(filter(m => m != null));
    }
}