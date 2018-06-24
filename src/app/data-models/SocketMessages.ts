import { User } from './user';

enum MessageType {
  Info,
  Ver,
  User
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
      default:
        console.warn('Parseframe: ignore message ' + srv_message);
        break;
    }

    return result;
  }
}
