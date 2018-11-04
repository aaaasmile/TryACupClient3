import { Component, OnInit, OnDestroy } from '@angular/core';
import { LobbyCardGameService } from '../services/lobby-cardgames.service';
import { Subscription } from 'rxjs';
import { GameItem } from './game-item';
import { ModalService } from '../services/modal.service';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { ChatItem } from './chat-item';
import { Router } from '@angular/router';
import { CurrGameStateService } from '../services/curr-game-state.service';


@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html'
})

export class GameListComponent implements OnInit, OnDestroy {
  pendGames: GameItem[];
  liveGames: GameItem[];
  chatMsgs: ChatItem[];
  model: any = {};
  private countMsg: number;
  private subsc_list2: Subscription;
  private subsc_chat: Subscription;
  private subsc_join: Subscription;

  constructor(private lobbyCardGameService: LobbyCardGameService,
    private modalService: ModalService,
    private authService: AuthenticationService,
    private stateGameService: CurrGameStateService,
    private router: Router) {
    this.countMsg = 0;
    this.liveGames = new Array<GameItem>()
  }

  ngOnInit() {
    this.model = {
      num_segni: 2,
      game: "Briscola" // valore preso dal file game_info: cup_srv/games/briscola/game_info campo :name
    }
    this.chatMsgs = new Array<ChatItem>();
    this.lobbyCardGameService.BufferChatMsg.forEach(ele => {
      let ci = new ChatItem(ele)
      this.chatMsgs.push(ci)
    })
    this.populateOnGoingGames();
  }

  ngOnDestroy() {
    if (this.subsc_list2) {
      this.subsc_list2.unsubscribe();
    }
    if (this.subsc_chat) {
      this.subsc_chat.unsubscribe();
    }
    if (this.subsc_join) {
      this.subsc_join.unsubscribe();
    }
  }

  ngAfterViewInit() {
    console.log('Request table list');
    this.countMsg += 1;
    this.subsc_list2 = this.lobbyCardGameService.reqGameList()
      .subscribe(lm => { // ListMessage contains operation
        this.countMsg -= 1;
        console.log("game list message msg", lm.details, this.countMsg);
        switch (lm.cmd) {
          case 'LIST2':
            {
              this.pendGames = new Array<GameItem>();
              for (let item of lm.details) {
                let gi = new GameItem()
                gi.parseList2Det(item, this.authService.get_user_name(), 
                                 this.lobbyCardGameService.getGameLink(item.game));
                gi.message = lm;
                this.pendGames.push(gi);
              }
              break;
            }
          case 'LIST2ADD':
            {
              let item = lm.details[0];
              let gi = new GameItem();
              gi.parseList2Det(item, this.authService.get_user_name(),
                               this.lobbyCardGameService.getGameLink(item.game));
              gi.message = lm;
              this.pendGames.push(gi);
              break;
            }
          case 'LIST2REMOVE':
            {
              this.pendGames.forEach((item, index) => {
                if (item.index === lm.removedIx) {
                  console.log('Remove item from array games with ix: ', index);
                  this.pendGames.splice(index, 1);
                }
              });
              break;
            }
          default:
            {
              console.warn('Message not recognized:', lm.cmd);
              break;
            }
        }
      });
    console.log('Request chat subsc')

    this.subsc_chat = this.lobbyCardGameService.subscribeChatMsg()
      .subscribe(cm => {
        console.log('Chat?', cm)
        let ci = new ChatItem(cm)
        this.chatMsgs.push(ci)
      })
  }

  populateOnGoingGames(){
    console.log("populate ongoing games")
    let user_name = this.authService.get_user_name()
    let arr = this.stateGameService.getPlayingGames(user_name)
    arr.forEach(tb => {
      let gi = new GameItem();
      let gameName = this.lobbyCardGameService.getGameNameFromServerKey(tb.GameName)
      let gameLink = this.lobbyCardGameService.getGameLink(gameName)
      gi.parseTableBuffer(tb, user_name, gameName, gameLink)

      this.liveGames.push(gi)
    });
    
  }

  sendChatMsg(msg) {
    if (msg) {
      console.log('send chat msg: ', msg)
      this.lobbyCardGameService.sendChatLobbyMsg(msg)
    }
  }

  askNewGame(modalId: string) {
    console.log('Ask for a new game with a modal', modalId);
    this.modalService.open(modalId);
  }

  cancelDialogNewGame() {
    console.log("Cancel modal dialog create neew game")
    this.modalService.close("");
  }

  createNewGameReq(form: NgForm) {
    console.log("Create a new game request", this.model);
    this.modalService.close("");
    let gameName = this.model.game;
    let opt = this.getOpt(gameName, this.model);
    this.lobbyCardGameService.createNewGame(gameName, opt);
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
            val: +diaOpt.num_segni
          }
        };
      default:
        console.error("Game %s option not found (programming error)", gameName);
        break;
    }
  }

  joinGameReq(gi: GameItem) {
    console.log('Join  the game', gi);
    this.subsc_join = this.lobbyCardGameService.joinGame(gi.index)
      .subscribe(lj => {
        if (lj.isOk()) {
          console.log("Join OK, navigate to: ", gi.link);
          this.router.navigate([gi.link]);
        }
      });
  }

  viewGameOngoing(gi: GameItem){
    console.log("View game: ", gi.game_name, gi.link)
    this.router.navigate([gi.link]);
  }

  removeGameReq(gi: GameItem) {
    console.log("remove game request", gi);
    if (gi) {
      this.lobbyCardGameService.removePendingGame(gi.index);
    } else {
      this.lobbyCardGameService.removePendingGame(-1);
    }
  }

  is_admin() {
    return this.authService.is_admin();
  }

  is_newGamePossible(): boolean {
    return this.liveGames.length == 0
  }

}
