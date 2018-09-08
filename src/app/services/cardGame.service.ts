import { Injectable } from '@angular/core';
import { CardGame } from '../data-models/cardGame';
import { SocketService } from './socket.service'
import { Observable } from 'rxjs';
import { List2Message } from '../data-models/SocketMessages';
import { map, filter, } from 'rxjs/operators';


@Injectable()
export class CardGameService {
  constructor(private socketService: SocketService) {

  }

  getCardGames(): CardGame[] {
    const games: CardGame[] = [
      { id: 1, name: 'Briscola in due', link: 'games/briscola/briscola-in-due' },
      //{ id: 1, name: 'Briscola in due', link: 'games' },
      { id: 2, name: 'Test Gfx', link: 'games/test-gfx' }
    ];
    return games;
  }

  reqGameList(): Observable<List2Message> {
    return this.socketService.pendingGame2Req()
    .pipe(
      map((lm: List2Message) => {
          console.log("List2Message recognized");
          return lm;
      })
  );
  }
}