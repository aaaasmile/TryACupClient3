import { Injectable } from '@angular/core';
import { CardGame } from '../data-models/cardGame';
import { SocketService } from './socket.service'
import { Observable } from 'rxjs';
import { List2Message } from '../data-models/socket/List2Message';
import { map, filter, } from 'rxjs/operators';
import { ChatType } from '../data-models/sharedEnums';
import { ChatMessage } from '../data-models/socket/ChatMessage';
import { JoinMessage } from '../data-models/socket/JoinMessage';


@Injectable()
export class LobbyCardGameService { // Used to handle the card lobby
  BufferChatMsg: ChatMessage[] = new Array<ChatMessage>()

  constructor(private socketService: SocketService) {
    
  }

  getCardGames(): CardGame[] {
    const games: CardGame[] = [
      { id: 1, name: 'Briscola in due', link: 'games/briscola/briscola-in-due' },
      { id: 2, name: 'Test Gfx', link: 'games/test-gfx' }
    ];
    return games;
  }

  getGameLink(game: string): string {
    // Valori presi da: cup_srv/games/briscola/game_info
    // nel file game_info, il gioco è identificato attraverso il campo :key. Ma anche il campo :name è unico. Quindi uso uno dei due.
    switch (game) {
      case 'briscola_game': // Key
      case 'Briscola':      // Name
        {
          return 'games/briscola/briscola-in-due'
        }
    }
    console.error('Game link not set: ', game)
    return '';
  }

  getGameNameFromServerKey(gemkey: string): string{
    switch (gemkey) {
      case 'briscola_game': // Key
        {
          return 'Briscola'
        }
    }
    console.error('Game key not recognized: ', gemkey)
    return '';
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
        if ((msg instanceof ChatMessage) && msg.is_chatLobbyItem()) {
          this.BufferChatMsg.push(msg)
          return msg;
        } else {
          return null;
        }
      }))
      .pipe(filter(m => m != null));
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

  sendChatLobbyMsg(msg: string) {
    this.socketService.chatCup(ChatType.Lobby, msg);
  }
}