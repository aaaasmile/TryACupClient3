import { GameCreatorUserType } from '../sharedEnums'
import { Message, MessageType } from './SocketMessages'

export class List2detailOption {
  type: string;
  name: string;
  value: number;
  assignPayload(p: any) {
    this.type = p.type;
    this.name = p.name;
    this.value = p.value;
  }
}

export class List2detail {
  index: number;
  user: string;
  user_type: GameCreatorUserType;
  user_score: number;
  game: string;
  prive: boolean;
  rated: boolean;
  options: Map<string, List2detailOption>;
  players: string[];

  assignPayload(p: any) {
    this.index = p.index;
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
    if (this.options["num_segni_match"] != null) {
      console.log(this.options);
      //res += ", segni " + this.options["num_segni_match"].value.toString(); //TODO
    }
    return res;
  }
}

export class List2Message implements Message {
  cmd: string;
  type: string;
  slice: number;
  slice_state: string;
  details: List2detail[];
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
  constructor(){
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

  parseCmdAddSingleDetail(cmd_details: string) {
    // La differenza qui è solo che vi è un singolo elemento nel messaggio detail
    let payload = JSON.parse(cmd_details);
    this.type = payload.type;
    let dd = new List2detail();
    dd.assignPayload(payload.detail);
    this.details.push(dd);
    console.log(this.details);
  }

  msgType(): MessageType {
    return MessageType.List2;
  }

  toString(): string {
    return this.cmd + ':' + this.type;
  }
}
