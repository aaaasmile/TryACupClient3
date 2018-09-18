import { Component, OnInit, OnDestroy } from '@angular/core';
import { CardGameService } from '../services/cardGame.service';
import { Subscription } from 'rxjs';
import { GameItem } from './game-item';
import { ModalService } from '../services/modal.service';
import { NgForm } from '@angular/forms';
import { SocketService } from '../services/socket.service';
import { map, filter } from 'rxjs/operators';
import { Message } from '../data-models/socket/SocketMessages'
import { List2Message } from '../data-models/socket/List2Message';



@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html'
})

export class GameListComponent implements OnInit, OnDestroy {
  games: GameItem[];
  model: any = {};
  private countMsg: number;
  private subsc_list2: Subscription;
  private subsc_ls_add: Subscription;

  constructor(private cardGameService: CardGameService,
    private modalService: ModalService,
    private socketService: SocketService) {
    this.countMsg = 0;
  }

  ngOnInit() {
    this.model = {
      num_segni: 2,
      game: "Briscola" // valore preso dal file game_info di cup_srv/games/briscola campo :name
    }
  }

  ngOnDestroy() {
    this.subsc_list2.unsubscribe();
    this.subsc_ls_add.unsubscribe();
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
    this.subsc_ls_add = this.socketService.Messages
      .pipe(map((msg: Message) => {return (msg instanceof List2Message) ? msg : null;}))
      .pipe(filter(m => m != null))
      .subscribe(lm => {
        // TODO
      });
  }

  askNewGame(modalId: string) {
    console.log('Ask for a new game with a modal', modalId);
    this.modalService.open(modalId);
  }

  cancelNewGame() {
    console.log("Cancel modal create neew game")
    this.modalService.close("");
  }

  createNewGame(form: NgForm) {
    console.log("Create a new game request", this.model);
    this.modalService.close("");
    let gameName = this.model.game;
    let opt = this.getOpt(gameName, this.model);
    this.cardGameService.createNewGame(gameName, opt);
  }

  getOpt(gameName: string, diaOpt: any) {
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
            val: diaOpt.num_segni
          }
        };
      default:
        console.error("Game %s option not found (programming error)", gameName);
        break;
    }
  }



  selectGame(gi: GameItem) {

  }

}
