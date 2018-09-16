import { Component, OnInit, OnDestroy } from '@angular/core';
import { CardGameService } from '../services/cardGame.service'
import { List2Message, List2detail } from '../data-models/socket/List2Message';
import { Subscription } from 'rxjs';
import { GameCreatorUserType } from '../data-models/sharedEnums'

// Used in html template
export class GameItem {
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

export class GameListComponent implements OnInit, OnDestroy {
  games: GameItem[];
  private countMsg: number;
  private subsc_list2: Subscription;

  constructor(private cardGameService: CardGameService) {
    this.countMsg = 0;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subsc_list2.unsubscribe();
  }

  ngAfterViewInit() {
    console.log('Request table list');
    this.countMsg += 1;
    this.subsc_list2 = this.cardGameService.reqGameList()
      .subscribe(lm => {
        this.countMsg -= 1;
        console.log("game avail list msg", lm.details, this.countMsg);
        this.games = new Array<GameItem>();
        for (let item of lm.details) {
          let gi = new GameItem(item);
          gi.message = lm;
          this.games.push(gi);
        }
      });
  }

  createNewGame(gameName: string) {
    console.log('Create a new game', gameName);
    //this.cardGameService.createNewGame(gameName, this.getOpt(gameName));
  }

  getOpt(gameName: string) {
    switch (gameName) {
      case "Briscola":
        return {
          target_points_segno: {
            type: 'textbox',
            name: 'Punti vittoria segno',
            val: 61
          },
          num_segni_match: {
            type: 'textbox',
            name: 'Segni in una partita',
            val: 2
          }
        };
      default:
        console.warn("Game option not found");
        break;
    }
  }

  

  selectGame(gi: GameItem) {

  }

}
