import { GameCreatorUserType } from '../data-models/sharedEnums'
import { List2Message, List2detail } from '../data-models/socket/List2Message';
import { TableBuffer } from '../data-models/tableBuffer';


// Used in html template
export class GameItem {
  index: number;
  iconname: string;
  user: string;
  opzioni_short: string;
  message: List2Message;
  game_name: string;
  is_me: boolean;
  link: string;
  players: string[];
  constructor(){

  }

  parseList2Det(list2Det: List2detail, username: string, link: string) {
    this.index = list2Det.index;
    this.is_me = (list2Det.user === username);
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
    this.link = link;
  }

  parseTableBuffer(tb: TableBuffer, username: string, game_name: string, link: string){
    this.index =  +tb.TableIx
    this.is_me = true
    this.game_name = game_name
    this.user = username
    this.link = link
    this.players = tb.PlayerNames
  }
}