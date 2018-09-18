import { Injectable } from '@angular/core';
import { CardGame } from '../data-models/cardGame';
import { SocketService } from './socket.service'
import { Observable } from 'rxjs';
import { List2Message } from '../data-models/socket/List2Message';
import { map, filter, } from 'rxjs/operators';


@Injectable()
export class CardGameService {
 
  constructor(private socketService: SocketService) {
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
        //(msg instanceof List2Message) ? msg : null; // Mah, non ho la minima idea...
        return (msg instanceof List2Message) ? msg : null;
      }))
      .pipe(filter(m => m != null));
  }

  createNewGame(gameName: string, opt: any){
    var payloadObj = {
      game: gameName, prive: { val: false, pin: '' }, class: false,
      opt_game: opt
    }
    
    this.socketService.createNewGameReq(payloadObj);
  }
}