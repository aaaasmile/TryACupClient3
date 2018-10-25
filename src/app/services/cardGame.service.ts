import { Injectable } from '@angular/core';
import { CardGame } from '../data-models/cardGame';
import { SocketService } from './socket.service'
import { Observable, Subscription } from 'rxjs';
import { List2Message } from '../data-models/socket/List2Message';
import { map, filter, } from 'rxjs/operators';
import { ChatType } from '../data-models/sharedEnums';
import { ChatMessage } from '../data-models/socket/ChatMessage';
import { JoinMessage } from '../data-models/socket/JoinMessage';
import { InGameMessage } from '../data-models/socket/InGameMessage';


@Injectable()
export class CardGameService {
  bufferInGameMsg: InGameMessage[]
  private subsc_InGame: Subscription;

  constructor(private socketService: SocketService) {
    this.bufferInGameMsg = new Array<InGameMessage>()
  }

  getCardGames(): CardGame[] {
    const games: CardGame[] = [
      { id: 1, name: 'Briscola in due', link: 'games/briscola/briscola-in-due' },
      { id: 2, name: 'Test Gfx', link: 'games/test-gfx' }
    ];
    return games;
  }

  reqGameList(): Observable<List2Message> {
    return this.socketService.pendingGame2Req()
      .pipe(map(msg => {
        return (msg instanceof List2Message) ? msg : null;
      }))
      .pipe(filter(m => m != null));
  }

  subscribeChatMsg(): Observable<ChatMessage> {
    return this.socketService.Messages
      .pipe(map(msg => {
        return (msg instanceof ChatMessage) ? msg : null;
      }))
      .pipe(filter(m => m != null));
  }

  subscribeInGameMsg():Observable<InGameMessage> {
    return this.socketService.Messages
      .pipe(map(msg => {
        return (msg instanceof InGameMessage) ? msg : null;
      }))
      .pipe(filter(m => m != null));
  }

  collectGameMsgs(): void {
    this.bufferInGameMsg = new Array<InGameMessage>()
    this.subsc_InGame = this.socketService.Messages
      .subscribe(m => {
        if (m instanceof InGameMessage) {
          this.bufferInGameMsg.push(m)
        }
      })
  }

  stopCollectInGame(): void {
    if (this.subsc_InGame) {
      this.subsc_InGame.unsubscribe()
    }
  }

  popFrontInGameMsg(): InGameMessage {
    if (!this.bufferInGameMsg || this.bufferInGameMsg.length == 0) {
      return null
    }
    let r = this.bufferInGameMsg[0]
    this.bufferInGameMsg.splice(0, 1)
    return r
  }

  createNewGame(gameName: string, opt: any) {
    var payloadObj = {
      game: gameName, prive: { val: false, pin: '' }, class: false,
      opt_game: opt
    }

    this.socketService.createNewGameReq(payloadObj);
  }

  joinGame(ix: number) {
    return this.socketService.joinGameReq(ix)
      .pipe(map(msg => {
        return (msg instanceof JoinMessage) ? msg : null;
      }))
      .pipe(filter(m => m != null));
  }

  removePendingGame(ix: number) {
    this.socketService.removeGameReq(ix);
  }

  sendChatTableMsg(msg: string) {
    this.socketService.chatCup(ChatType.Lobby, msg);
  }
}