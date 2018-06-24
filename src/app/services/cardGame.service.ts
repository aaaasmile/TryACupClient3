import { Injectable } from '@angular/core';
import { CardGame } from '../data-models/cardGame';


@Injectable()
export class CardGameService {
  getCardGames(): CardGame[] {
    const games: CardGame[] = [
      { id: 1, name: 'Briscola in due', link: 'games/briscola/briscola-in-due' },
      //{ id: 1, name: 'Briscola in due', link: 'games' },
      { id: 2, name: 'Test Gfx', link: 'games/test-gfx' }
    ];
    return games;
  }
}