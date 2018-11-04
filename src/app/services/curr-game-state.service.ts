import { Injectable } from '@angular/core';
import { Subscription, Observable, Subject } from 'rxjs';
import { SocketService } from './socket.service';
import { InGameMessage } from '../data-models/socket/InGameMessage';
import { map, filter } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';
import { ChatMessage } from '../data-models/socket/ChatMessage';
import { ChatType } from '../data-models/sharedEnums';

@Injectable({
  providedIn: 'root'
})
export class CurrGameStateService {
  private subsc_InGame: Subscription;
  private bufferInGameMsg: InGameMessage[];
  public InGameMsgRecEvent: Subject<boolean>;
  
  constructor(private socketService: SocketService,
    private authService: AuthenticationService) {
    this.bufferInGameMsg = new Array<InGameMessage>()
    this.InGameMsgRecEvent = new Subject();
    this.collectGameMsgs();
   }

   ngOnDestroy() {
    this.stopCollectInGame();
  }

  subscribeInGameMsg():Observable<InGameMessage> {
    return this.socketService.Messages
      .pipe(map(msg => {
        return (msg instanceof InGameMessage) ? msg : null;
      }))
      .pipe(filter(m => m != null));
  }

  subscribeChatMsg(): Observable<ChatMessage> {
    return this.socketService.Messages
      .pipe(map(msg => {
        return (msg instanceof ChatMessage) && msg.is_chatTableItem() ? msg : null;
      }))
      .pipe(filter(m => m != null));
  }

  collectGameMsgs(): void {
    console.log("Collect in-game messages")
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
      this.subsc_InGame = null
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

  sendChatTableMsg(msg: string) {
    this.socketService.chatCup(ChatType.Table, msg);
  }

}
