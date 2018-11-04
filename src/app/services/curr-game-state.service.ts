import { Injectable } from '@angular/core';
import { Subscription, Observable, Subject } from 'rxjs';
import { SocketService } from './socket.service';
import { InGameMessage } from '../data-models/socket/InGameMessage';
import { map, filter } from 'rxjs/operators';
import { ChatMessage } from '../data-models/socket/ChatMessage';
import { ChatType } from '../data-models/sharedEnums';

class TableBuffer {
  TableIx: string
  GameName: string
  BufferInGameMsg: InGameMessage[] = new Array<InGameMessage>()
  BufferChatMsg: ChatMessage[] = new Array<ChatMessage>()
}

@Injectable({
  providedIn: 'root'
})
export class CurrGameStateService {
  private subsc_InGame: Subscription;
  private tables: { [key: string]: TableBuffer; } = {};
  public InGameMsgRecEvent: Subject<number>;

  constructor(private socketService: SocketService) {
    this.InGameMsgRecEvent = new Subject();
    this.tables["1"] = new TableBuffer
    this.collectGameMsgs();
  }

  ngOnDestroy() {
    this.stopCollectInGame();
  }

  getAllChatMesages(tableIx: string): ChatMessage[] {
    if (this.tables[tableIx]) {
      return this.tables[tableIx].BufferChatMsg;
    } else {
      return []
    }
  }

  subscribeChatMsg(): Observable<ChatMessage> {
    return this.socketService.Messages
      .pipe(map(msg => {
        if ((msg instanceof ChatMessage) && msg.is_chatTableItem()) {
          this.tables[msg.table_id].BufferChatMsg.push(msg)
          return msg;
        } else {
          return null;
        }
      }))
      .pipe(filter(m => m != null));
  }

  collectGameMsgs(): void {
    console.log("Collect in-game messages")
    this.subsc_InGame = this.socketService.Messages
      .subscribe(m => {
        if (m instanceof InGameMessage) {
          let tbix = m.table_id
          this.tables[tbix].BufferInGameMsg.push(m)
        }
      })
  }

  stopCollectInGame(): void {
    if (this.subsc_InGame) {
      this.subsc_InGame.unsubscribe()
      this.subsc_InGame = null
      this.tables = {}
    }
  }

  popFrontInGameMsg(tableIx: string): InGameMessage {
    if (!this.tables[tableIx].BufferInGameMsg || this.tables[tableIx].BufferInGameMsg.length == 0) {
      return null
    }
    let r = this.tables[tableIx].BufferInGameMsg[0]
    this.tables[tableIx].BufferInGameMsg.splice(0, 1)
    return r
  }

  sendChatTableMsg(msg: string, tableIx: string) {
    this.socketService.chatCup(ChatType.Table, msg);
  }

}
