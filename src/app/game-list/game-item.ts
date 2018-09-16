import { GameCreatorUserType } from '../data-models/sharedEnums'
import { List2Message, List2detail } from '../data-models/socket/List2Message';


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