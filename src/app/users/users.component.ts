import { Component } from '@angular/core';
import { User } from '../data-models/socket/UserMessage';
import { UserService } from '../services/user.service';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { ChatType } from '../data-models/sharedEnums'

// Nota che quest service è obsoleto ed è stato usato solo per provare dei comandi


@Component({
  selector: 'my-users',
  moduleId: module.id,
  templateUrl: 'users.component.html'
})

export class UsersComponent implements OnInit {
  title = 'Lista utenti';
  selectedUser: User;
  users: User[];
  ixgame: number;
  chatLobbyText: string;
  chatTableText: string;
  cardToPlay: string;

  constructor(
    private userService: UserService,
    private socketService: SocketService,
    private router: Router) {
  }
  ngOnInit(): void {
    this.socketService.connectSocketServer();
    this.getUsers();
  }
  getUsers(): void {
    //this.userService.getUsers().then(users => this.users = users); // TODO
  }
  onSelect(user: User): void {
    this.selectedUser = user;
    this.socketService.loginReq(user.login,'','');
  }
  gotoDetail(): void {
    this.router.navigate(['/detail', this.selectedUser.id]);
  }
  doLogout(): void {
    this.socketService.logoutReq();
    this.selectedUser = null;
  }
  doPendingGameRe2(): void {
    this.socketService.pendingGame2Req();
  }
  doUsersConnectedReq(): void {
    this.socketService.usersConnectedReq();
  }

  doCreateNewGameReq(): void {
    var payloadObj = {
      game: 'Briscola', prive: { val: false, pin: '' }, class: false,
      opt_game: this.getBriscolaOpt()
    }
    this.socketService.createNewGameReq(payloadObj);
  }

  doJoinGame(): void {
    this.socketService.joinGameReq(this.ixgame);
  }

  doChatLobby(): void {
    this.socketService.chatCup(ChatType.Lobby, this.chatLobbyText);
  }

  doChatTable(): void {
    this.socketService.chatCup(ChatType.Table, this.chatTableText);
  }

  doAlgPlayCard(): void {
    this.socketService.algPlayCard(this.cardToPlay, this.selectedUser.login);
  }

  doAlgLeaveTable(): void {
    this.socketService.algLeaveTable(this.ixgame);
  }

  doAlgResign(): void {
    this.socketService.algResign(this.ixgame);
  }

  doAlgRestartNewGame(): void {
    // JSON.create({ :type_req => :create | :resp | :challenge | :join | :decline
    //   :resp_code => :ok_create | :reject_create | :join_ok | :join_declined
    //           :detail => {
    //             :index => index
    //             :name => gioco_name,
    //             :prive => {val =>treu/false, pin =>"1234"}
    //             :class => true/false
    //             :opt => {<gaeme specific option hash>}
    //           }
    //         })
    // Use now an example payload
    let payload = {
      type_req: 'create',
      detail:
      {
        index: this.ixgame,
        name: 'Mariazza',
        prive: { val: false, pin: '' },
        class: false,
        opt: this.getMariazzaOpt()
      }
    }
    this.socketService.algRestartWithNewGame(payload);
  }

  doAlgRestartSameGame():void{
    this.socketService.algRestartSameGame(this.ixgame);
  }

  private getBriscolaOpt() {
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
  }

  private getMariazzaOpt() {
    return {
      target_points_segno: {
        type: 'textbox',
        name: 'Punti vittoria segno',
        val: 41
      },
      num_segni_match: {
        type: 'textbox',
        name: 'Segni in una partita',
        val: 2
      }
    };
  }
}
