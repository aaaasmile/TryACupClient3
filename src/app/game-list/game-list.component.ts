import { Component, OnInit, OnDestroy } from '@angular/core';
import { CardGameService } from '../services/cardGame.service';
import { Subscription } from 'rxjs';
import { GameItem } from './game-item';
import { ModalService } from '../services/modal.service';



@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html'
})

export class GameListComponent implements OnInit, OnDestroy {
  games: GameItem[];
  model: any = {};
  private countMsg: number;
  private subsc_list2: Subscription;

  constructor(private cardGameService: CardGameService, private modalService: ModalService) {
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

  askNewGame(modalId: string) {
    console.log('Ask for a new game with a modal', modalId);
    this.modalService.open(modalId);
  }

  cancelNewGame() {
    this.modalService.close("");
  }

  createNewGame() {
    console.log("Create a new game request");
    //this.cardGameService.createNewGame(gameName, this.getOpt(gameName));
    this.modalService.close("");
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
