import { GameCreatorUserType } from '../sharedEnums'
import { Message, MessageType } from './SocketMessages'

export class List2detailOption {
  type: string;
  name: string;
  val: number;
  assignPayload(p: any) {
    console.log('Payload Option is: ', p);
    this.type = p.type;
    this.name = p.name;
    this.val = p.val;
  }
}

export class List2detail {
  index: number;
  user: string;
  user_type: GameCreatorUserType;
  user_score: number;
  game: string;
  game_link: string;
  prive: boolean;
  rated: boolean;
  options: Map<string, List2detailOption>;
  players: string[];

  assignPayload(p: any) {
    // attenzione che i valori di p possono essere una stringa
    console.log('Payload detail is: ', p);
    this.index = +p.index;
    this.user = p.user;
    switch (p.user_type) {//(:user, :computer, :female)
      case "user":
        this.user_type = GameCreatorUserType.user;
        break;
      case "computer":
        this.user_type = GameCreatorUserType.computer;
        break;
      case "female":
        this.user_type = GameCreatorUserType.female;
        break;
      default:
        console.warn("User type not recognized: ", p.user_type);
    }
    this.user_score = parseInt(p.user_score, 10);
    this.game = p.game;
    this.game_link = this.getGameLink(p.game);
    this.prive = p.prive;
    this.rated = p.class;
    this.options = new Map<string, List2detailOption>();
    for (const [key, value] of Object.entries(p.opt_game)) {
      this.options[key] = new List2detailOption();
      this.options[key].assignPayload(value);
    };
    this.players = new Array<string>();
    for (let pl of p.players) {
      this.players.push(pl);
    }
  }

  getOptionsShortText(): string {
    let res = "2 giocatori";
    console.log('option text: ', this.options);
    if (this.options["num_segni_match"] != null) {
      res += ", segni " + this.options["num_segni_match"].val.toString();
    }
    return res;
  }

  getGameLink(game: string): string {
    switch (game) {
      case 'Briscola':
        {
          return 'games/briscola/briscola-in-due'
        }
    }
    console.error('Game link not set: ', game)
    return '';
  }
}

export class List2Message implements Message {
  cmd: string;
  type: string;
  slice: number;
  slice_state: string;
  details: List2detail[];
  removedIx: number;
  /* Esempio di messaggio in json
  {
    "type":"pgamelist","slice":0,"slice_state":"last","detail":[
    {"index":"1","user":"robot1","user_type":"user","user_score":0,
     "game":"Briscola","prive":false,"class":true,
      "opt_game": {
                "target_points_segno":{"type":"textbox","name":"Punti vittoria segno","val":61},
                 "num_segni_match":{"type":"textbox","name":"Segni in una partita","val":2}
                },
      "players":["robot1"]
    }]
  }*/
  constructor() {
    this.details = new Array<List2detail>();
  }

  parseCmdDetails(cmd_details: string) {
    let payload = JSON.parse(cmd_details);
    this.type = payload.type;
    this.slice = parseInt(payload.slice, 10);
    this.slice_state = payload.slice_state;
    for (let d of payload.detail) {
      let dd = new List2detail();
      dd.assignPayload(d);
      this.details.push(dd);
    }
    console.log(this.details);
  }

  //  //LIST2ADD:{"type":"pgamelist",
  // "detail":{"index":"2","user":"aaaasmile","user_type":"user","user_score":0,"game":"Briscola","prive":false,"class":false,
  // "opt_game":{"target_points_segno":{"type":"textbox","name":"Punti vittoria segno","val":61},
  // "num_segni_match":{"type":"textbox","name":"Segni in una partita","val":2}},"players":["aaaasmile"]}}
  parseCmdAddSingleDetail(cmd_details: string) {
    // La differenza qui è solo che vi è un singolo elemento nel messaggio detail
    let payload = JSON.parse(cmd_details);
    this.type = payload.type;
    let dd = new List2detail();
    dd.assignPayload(payload.detail);
    this.details.push(dd);
    console.log(this.details);
  }

  //LIST2REMOVE:{"type":"pgamelist","detail":{"index":7}}
  parseCmdRemoveSingleDetail(cmd_details: string) {
    let payload = JSON.parse(cmd_details);
    this.type = payload.type;
    //this.details = this.details.filter(x => x.index !== payload.detail.index); // TODO: remove without reassign otherwise you loose the binding
    //console.log(this.details);
    this.removedIx = payload.detail.index;
    console.log('Removed index is: ', this.removedIx);
  }

  msgType(): MessageType {
    return MessageType.List2;
  }

  toString(): string {
    return this.cmd + ':' + this.type;
  }
}
