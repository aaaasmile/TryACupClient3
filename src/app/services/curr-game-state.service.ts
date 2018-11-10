import { Injectable } from '@angular/core';
import { Subscription, Observable, Subject } from 'rxjs';
import { SocketService } from './socket.service';
import { InGameMessage, InGameMsgType } from '../data-models/socket/InGameMessage';
import { map, filter } from 'rxjs/operators';
import { ChatMessage } from '../data-models/socket/ChatMessage';
import { ChatType } from '../data-models/sharedEnums';
import { TableBuffer } from '../data-models/tableBuffer';
import { CardLoaderGfx } from '../games/common/gfx/card-loader_gfx';


@Injectable({
  providedIn: 'root'
})
export class CurrGameStateService {
  private subsc_InGame: Subscription;
  private tables: { [key: string]: TableBuffer; } = {};
  public InGameMsgRecEvent: Subject<number>;
  private cardLoaderGfx = new CardLoaderGfx()

  constructor(private socketService: SocketService) {
    this.InGameMsgRecEvent = new Subject();
    this.tables["1"] = new TableBuffer
    if (socketService.isConnected()) {
      this.collectGameMsgs();
    }
  }

  ngOnDestroy() {
    this.stopCollectInGame();
  }

  getPlayingGames(playerName: string): TableBuffer[] {
    var res = new Array<TableBuffer>()
    for (let key in this.tables) {
      let val = this.tables[key]
      if (val.PlayerNames.findIndex(x => x === playerName) !== -1) {
        res.push(val)
      }
    }
    return res
  }

  getCardLoaderGfx(){
    return this.cardLoaderGfx;
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
          let tbItem = this.tables[tbix]
          if (m.inGameMsgType === InGameMsgType.NewMatch) {
            console.log("New match message payload", m.Payload)
            tbItem.PlayerNames = new Array<string>()
            m.Payload[1].forEach(pl => {
              tbItem.PlayerNames.push(pl)
            })
            tbItem.GameName = m.Payload[0]
            tbItem.TableIx = tbix
          }
          tbItem.BufferInGameMsg.push(m)
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
