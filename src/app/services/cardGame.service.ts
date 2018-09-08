import { Injectable } from '@angular/core';
import { CardGame } from '../data-models/cardGame';
import { SocketService } from './socket.service'


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

  reqGameList() {
    this.socketService.pendingGame2Req()
  }
}