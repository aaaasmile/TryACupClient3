import { User } from './user';
import { GameCreatorUserType } from './sharedEnums'

enum MessageType {
  Info,
  Ver,
  User,
  List2
}
export interface Message {
  msgType(): MessageType;
  toString(): string;
}

export class VerMessage implements Message {
  cmd: string;
  MajorVer: number;
  MinVer: number;

  parseDetails(details: string): void {
    let vers = details.split(".");
    this.MajorVer = parseInt(vers[0], 10);
    this.MinVer = parseInt(vers[1], 10);
  }

  msgType(): MessageType {
    return MessageType.Ver;
  }

  toString(): string {
    return this.cmd + ':' + this.MajorVer.toString() + '.' + this.MinVer.toString();
  }
}

export class InfoMessage implements Message {
  cmd: string;
  info: string;

  msgType(): MessageType {
    return MessageType.Info;
  }

  toString(): string {
    return this.cmd + ':' + this.info;
  }
}

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

  getOptionsShortText(): string{
    let res =  "Num Giocatori 2";
    if (this.options["num_segni_match"] != null){
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
  parseCmdDetails(cmd_details: string) {
    let payload = JSON.parse(cmd_details);
    this.type = payload.type;
    this.slice = parseInt(payload.slice, 10);
    this.slice_state = payload.slice_state;
    this.details = new Array<List2detail>();
    for (let d of payload.detail) {
      let dd = new List2detail();
      dd.assignPayload(d);
      this.details.push(dd);
    }
    console.log(this.details);
  }

  msgType(): MessageType {
    return MessageType.List2;
  }

  toString(): string {
    return this.cmd + ':' + this.type;
  }
}

export class UserMessage implements Message {
  cmd: string;
  info: string;
  user: User;
  is_ok: boolean;
  error_code: number;
  constructor(isok: boolean) {
    this.is_ok = isok;
  }

  msgType(): MessageType {
    return MessageType.User;
  }

  toString(): string {
    return this.cmd + '-> is_ok: ' + this.is_ok.toString() + ' user ' + JSON.stringify(this.user);
  }
}

export class MessageBuilder {

  static parse(srv_message: string): Message {
    let arr_cmd_msg = srv_message.split(":");
    let cmd = arr_cmd_msg[0];
    // details of command
    arr_cmd_msg = arr_cmd_msg.slice(1, arr_cmd_msg.length);
    let cmd_details = arr_cmd_msg.join(":");
    //retreive the symbol of the command handler
    var result: Message = null;
    switch (cmd) {
      case 'INFO':
        {
          let msg = new InfoMessage();
          msg.cmd = cmd;
          msg.info = cmd_details;
          result = msg;
          break;
        }
      case 'VER':
        {
          let msg = new VerMessage();
          msg.cmd = cmd;
          msg.parseDetails(cmd_details);
          result = msg;
          break;
        }
      case 'LOGINERROR':
        {
          let msg = new UserMessage(false);
          let det = JSON.parse(cmd_details);
          msg.cmd = cmd;
          msg.info = det.info;
          msg.error_code = det.code;
          result = msg;
          break;
        }
      case 'LOGINOK':
        {
          let msg = new UserMessage(true);
          let det = JSON.parse(cmd_details);
          msg.cmd = cmd;
          msg.user = new User();
          msg.user.login = det.name;
          msg.user.token = det.token;
          result = msg;
          break;
        }
      case 'USEREXISTRESULT':
        {
          let msg = new UserMessage(true);
          let det = JSON.parse(cmd_details);
          msg.cmd = cmd;
          msg.is_ok = det.exists;
          if (det.exists == true) {
            msg.user = new User();
            msg.user.login = det.login;
          }
          result = msg;
          break;
        }
      case 'USEROPRESULT':
        {
          //{"login":null,"is_ok":false,"code":1,"info":"Impossibile inserire l'utente"}
          let msg = new UserMessage(true);
          let det = JSON.parse(cmd_details);
          msg.cmd = cmd;
          msg.is_ok = det.is_ok;
          msg.info = det.info;
          if (det.is_ok == true) {
            msg.user = new User();
            msg.user.login = det.login;
          }
          result = msg;
          break;
        }
      case 'LIST2':
        {
          let msg = new List2Message();
          msg.cmd = cmd;

          msg.parseCmdDetails(cmd_details);
          result = msg;
          break;
        }
      default:
        console.warn('Parseframe: ignore message ' + srv_message);
        break;
    }

    return result;
  }
}
