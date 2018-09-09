import { Component, OnInit } from '@angular/core';
import { CardGameService } from '../services/cardGame.service'
import { List2Message, List2detail } from '../data-models/SocketMessages';
import { map } from 'rxjs/operators';
import { GameCreatorUserType } from '../data-models/sharedEnums'

class GameItem {
  index: number;
  iconname: string;
  user: string;
  opzioni_short: string;
  message: List2Message;
  game_name: string;

  constructor(list2Det: List2detail) {
    this.index = list2Det.index;
    switch (list2Det.user_type) {
      case GameCreatorUserType.computer:
        this.iconname = "desktop";
        break;
      case GameCreatorUserType.user:
        this.iconname = "male";
        break;
      case GameCreatorUserType.female:
        this.iconname = "female";
        break;
    }
    this.user = list2Det.user;
    this.game_name = list2Det.game;
    this.opzioni_short = list2Det.getOptionsShortText();
  }
}

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html'
})
export class GameListComponent implements OnInit {
  games: GameItem[];
  private countMsg: number;

  constructor(private cardGameService: CardGameService) { 
    this.countMsg = 0;
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    console.log('Request table list');
    this.countMsg += 1;
    this.cardGameService.reqGameList()
      .subscribe(lm => {
          this.countMsg -= 1;
          console.log("*** Msg recognized,is...", lm.details, this.countMsg);
          this.games = new Array<GameItem>();
          for (let item of lm.details) {
            let gi = new GameItem(item);
            gi.message = lm;
            this.games.push(gi);
          }
        });
    // TODO Unsubscribe
  }

  selectGame(gi: GameItem) {

  }

}
