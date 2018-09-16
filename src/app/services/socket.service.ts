import { Injectable } from '@angular/core';
import { Log4Cup } from '../shared/log4cup';
import { ChatType } from '../data-models/sharedEnums';
import { OnlineModeService } from './networkMode.service';
import { Message } from '../data-models/socket/SocketMessages';
import { MessageBuilder } from '../data-models/socket/MessageBuilder';

import { Subject, Observable, Subscription } from 'rxjs';

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
    private subsc_ws: Subscription;

    private ws: WebSocketSubject<any>; // Websocket is a subject in RxJs

    constructor(private onlineService: OnlineModeService) {
        this._log.debug("socket - constructor");
        this.ConnectEvent = new Subject<boolean>();
        this._protocollConnected = false;
        this._closing = false;
    }

    private createSocket(): void {
        console.log('Create socket on SocketService');
        var port = location.port;
        var prefix = (window.location.protocol.match(/https/) ? 'wss' : 'ws')
        if (location.hostname === 'localhost') {
            port = "3000"; // overwritten because dev
        }
        var mybase_url = prefix + "://" + location.hostname + (port ? ':' + port : '');
        mybase_url += "/websocket";

        this.Messages = new Subject<Message>();

        this.ws = webSocket({ url: mybase_url, serializer: x => x });
        if (this.subsc_ws) {
            this.subsc_ws.unsubscribe();
        }
        this.subsc_ws = this.ws.subscribe(
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
                console.log('socket complete - DISCONNECTED');
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
        if (this.onlineService.isModeOnline()) {
            if (this.ws == null) {
                if (!this._closing) {
                    this._reconnect = false;
                    this.setProtocolConnected(true);
                    this.createSocket();
                } else {
                    this._reconnect = true;
                }
            }
        } else {
            console.log('Ignore connect because app is in offline mode');
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
            this.setProtocolConnected(false);
        }
    }

    isConnected(): boolean {
        return this.ws != null;
    }

    loginReq(login: string, password: string, token: string): Observable<Message> {
        this.connectSocketServer();

        let det_json = JSON.stringify({ name: login, password: btoa(password), token: token });
        let det: string = "LOGIN:" + det_json;
        console.log("Send cmd: ", det);

        this.ws.next(det);
        return this.Messages;
    }

    signup(det_json: string): Observable<Message> {
        this.connectSocketServer();
        var det = "USEROP:" + det_json;

        this.ws.next(det);
        return this.Messages;
    }

    userExists(login: string): Observable<Message> {
        this.connectSocketServer();

        let det_json = JSON.stringify({ login: login });
        var det = "USEREXIST:" + det_json;

        this.ws.next(det);
        this._log.debug('user exists for: ' + login);
        return this.Messages;
    }

    logoutReq(login: string): Observable<Message> {
        let det_json = JSON.stringify({ name: login});
        let det: string = "LOGOUT:" + det_json;
        console.log("Send cmd: ", det);

        this.ws.next(det);
        return this.Messages;
    }

    pendingGame2Req(): Observable<Message> {
        return this.sendCmdDetReq('PENDINGGAMESREQ2:');
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
        //this._log.debug('send ' + det);
        this.ws.next(det);
        return this.Messages;
    }
}